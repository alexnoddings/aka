import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const campaigns = await db
        .prepare(`
            SELECT c.id,
                   c.name,
                   c.is_active AS isActive,
                   c.created_at AS createdAt,
                   COUNT(DISTINCT cl.id) AS linkCount,
                   COUNT(re.id) AS totalHits,
                   MAX(re.requested_at) AS lastUsed
            FROM campaigns c
            LEFT JOIN campaign_links cl ON cl.campaign_id = c.id AND cl.is_active = 1
            LEFT JOIN redirect_events re ON re.campaign_link_id = cl.id
            GROUP BY c.id
            ORDER BY c.name
        `)
        .all<CampaignRow>();

    return { campaigns: campaigns.results! };
};

type CampaignRow = {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
    linkCount: number;
    totalHits: number;
    lastUsed: string | null;
};
