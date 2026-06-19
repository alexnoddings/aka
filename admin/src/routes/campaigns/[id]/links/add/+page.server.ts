import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { campaignIdExists } from '$/routes/campaigns/validation';
import { generateCampaignSlug } from '$lib/slug';
import { generateId } from '$lib/id';

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

export const actions = {
    default: async ({ request, platform, params }) => {
        const db = platform?.env.aka;
        if (!db) throw Error('database unavailable');

        if (!(await campaignIdExists(params.id, db))) {
            return fail(404, { errors: { linkId: 'Campaign not found' } });
        }

        const data = await request.formData();
        const linkId = (data.get('linkId') as string | null)?.trim() ?? '';

        if (!linkId) {
            return fail(400, { errors: { linkId: 'Please select a link' } });
        }

        const linkExists = await db
            .prepare(`SELECT EXISTS(SELECT 1 FROM links WHERE id=? AND is_active=1) AS linkExists`)
            .bind(linkId)
            .first<{ linkExists: boolean }>();

        if (!linkExists?.linkExists) {
            return fail(400, { errors: { linkId: 'Selected link not found or inactive' } });
        }

        const alreadyAdded = await db
            .prepare(`SELECT EXISTS(SELECT 1 FROM campaign_links WHERE campaign_id=? AND link_id=? AND is_active=1) AS alreadyExists`)
            .bind(params.id, linkId)
            .first<{ alreadyExists: boolean }>();

        if (alreadyAdded?.alreadyExists) {
            return fail(400, { errors: { linkId: 'This link is already in the campaign' } });
        }

        const slug = await generateCampaignSlug(db);
        const id = generateId();
        const now = new Date().toISOString();

        await db
            .prepare(`
                INSERT INTO campaign_links (id, campaign_id, link_id, slug, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            .bind(id, params.id, linkId, slug, true, now)
            .run();

        return redirect(302, `/campaigns/${params.id}`);
    }
} satisfies Actions;
