import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, params }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const id = params.id;

    const campaign = await db
        .prepare(`SELECT id, name, notes, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt FROM campaigns WHERE id=?`)
        .bind(id)
        .first<Campaign>();

    if (!campaign) return { campaign: undefined };

    const today = new Date();
    const dayMin = new Date(today.valueOf());
    dayMin.setDate(dayMin.getDate() - 1);
    const monthMin = new Date(today.valueOf());
    monthMin.setDate(monthMin.getDate() - 30);

    const stats = await db
        .prepare(`
            SELECT COUNT(CASE WHEN re.requested_at >= ? THEN 1 END) AS dayHits,
                   COUNT(CASE WHEN re.requested_at >= ? THEN 1 END) AS monthHits,
                   COUNT(*) AS totalHits
            FROM redirect_events re
            JOIN campaign_links cl ON re.campaign_link_id = cl.id
            WHERE cl.campaign_id = ?
        `)
        .bind(dayMin.toISOString(), monthMin.toISOString(), id)
        .first<Stats>();

    const campaignLinks = await db
        .prepare(`
            SELECT cl.id,
                   cl.slug,
                   cl.is_active AS isActive,
                   cl.created_at AS createdAt,
                   l.slug AS linkSlug,
                   l.destination_url AS destinationUrl,
                   COUNT(re.id) AS hits,
                   MAX(re.requested_at) AS lastUsed
            FROM campaign_links cl
            JOIN links l ON l.id = cl.link_id
            LEFT JOIN redirect_events re ON re.campaign_link_id = cl.id
            WHERE cl.campaign_id = ?
            GROUP BY cl.id
            ORDER BY cl.created_at
        `)
        .bind(id)
        .all<CampaignLink>();
    const links = campaignLinks.results!;
    links.sort((a, b) => {
        const aslug = a.linkSlug ?? '';
        const bslug = b.linkSlug ?? '';

        if (aslug < bslug)
            return -1;

        if (aslug > bslug)
            return 1;

        return 1;
    });

    return {
        campaign,
        stats: stats ?? { dayHits: 0, monthHits: 0, totalHits: 0 },
        campaignLinks: links
    };
};

type Campaign = {
    id: string;
    name: string;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

type Stats = {
    dayHits: number;
    monthHits: number;
    totalHits: number;
};

type CampaignLink = {
    id: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    linkSlug: string | null;
    destinationUrl: string;
    hits: number;
    lastUsed: string | null;
};
