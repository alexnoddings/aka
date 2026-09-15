import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { campaignIdExists } from '$/routes/campaigns/validation';
import { generateCampaignSlug } from '$lib/slug';
import { generateId } from '$lib/id';

// Unlikely to hit this many links currently, but future proofs against sending too many bound parameters to D1
const ID_CHUNK_SIZE = 90;

export const load: PageServerLoad = async ({ params, platform }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const campaign = await db
        .prepare(`SELECT id, name FROM campaigns WHERE id=?`)
        .bind(params.id)
        .first<{ id: string; name: string }>();

    if (!campaign) return { campaign: undefined, availableLinks: [] };

    const availableLinks = await db
        .prepare(`
            SELECT l.id, l.slug, l.destination_url AS destinationUrl
            FROM links l
            WHERE l.is_active = 1
              AND NOT EXISTS (
                  SELECT 1 FROM campaign_links cl
                  WHERE cl.link_id = l.id AND cl.campaign_id = ? AND cl.is_active = 1
              )
            ORDER BY l.slug IS NULL, l.slug
        `)
        .bind(params.id)
        .all<LinkOption>();

    return { campaign, availableLinks: availableLinks.results! };
};

type LinkOption = {
    id: string;
    slug: string | null;
    destinationUrl: string;
};

function chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

function getSelectedLinkIds(data: FormData): string[] {
    const ids = data
        .getAll('linkIds')
        .filter((value): value is string => typeof value === 'string')
        .map(value => value.trim())
        .filter(value => value.length > 0);
    return [...new Set(ids)];
}

// Links which are active and not in the campaign yet
async function getAvailableLinkIds(
    linkIds: string[],
    campaignId: string,
    db: D1Database
): Promise<Set<string>> {
    const available = new Set<string>();

    for (const ids of chunk(linkIds, ID_CHUNK_SIZE)) {
        const placeholders = ids.map(() => '?').join(', ');
        const results = await db
            .prepare(`
                SELECT l.id
                FROM links l
                WHERE l.id IN (${placeholders})
                  AND l.is_active = 1
                  AND NOT EXISTS (
                      SELECT 1 FROM campaign_links cl
                      WHERE cl.link_id = l.id AND cl.campaign_id = ? AND cl.is_active = 1
                  )
            `)
            .bind(...ids, campaignId)
            .all<{ id: string }>();

        for (const row of results.results!)
            available.add(row.id);
    }

    return available;
}

export const actions = {
    default: async ({ request, platform, params }) => {
        const db = platform?.env.aka;
        if (!db) throw Error('database unavailable');

        const data = await request.formData();
        const linkIds = getSelectedLinkIds(data);

        if (!(await campaignIdExists(params.id, db))) {
            return fail(404, { linkIds, errors: { linkIds: 'Campaign not found' } });
        }

        if (linkIds.length === 0) {
            return fail(400, { linkIds, errors: { linkIds: 'Please select at least one link' } });
        }

        const availableIds = await getAvailableLinkIds(linkIds, params.id, db);
        const unavailableIds = linkIds.filter(id => !availableIds.has(id));

        if (unavailableIds.length > 0) {
            return fail(400, {
                linkIds,
                errors: {
                    linkIds: `${unavailableIds.length} selected link(s) are no longer available. Reload the page and try again.`
                }
            });
        }

        const now = new Date().toISOString();
        const reservedSlugs = new Set<string>();
        const inserts = [];

        for (const linkId of linkIds) {
            const slug = await generateCampaignSlug(db, reservedSlugs);
            inserts.push(
                db
                    .prepare(`
                        INSERT INTO campaign_links (id, campaign_id, link_id, slug, is_active, created_at)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `)
                    .bind(generateId(), params.id, linkId, slug, true, now)
            );
        }

        await db.batch(inserts);

        return redirect(302, `/campaigns/${params.id}`);
    }
} satisfies Actions;
