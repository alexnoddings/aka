import type { PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ platform, params, url }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const campaignLink = await db
        .prepare(`
            SELECT cl.id, cl.slug, cl.is_active AS isActive,
                   l.slug AS linkSlug, l.destination_url AS destinationUrl,
                   c.id AS campaignId, c.name AS campaignName
            FROM campaign_links cl
            JOIN links l ON l.id = cl.link_id
            JOIN campaigns c ON c.id = cl.campaign_id
            WHERE cl.id = ? AND cl.campaign_id = ?
        `)
        .bind(params.clid, params.id)
        .first<CampaignLink>();

    if (!campaignLink) return { campaignLink: undefined };

    const pageStr = url.searchParams.get('page') ?? '1';
    const pageInt = parseInt(pageStr, 10);
    const page = Math.max(1, pageInt);

    const countResult = await db
        .prepare(`SELECT COUNT(*) AS total FROM redirect_events WHERE campaign_link_id = ?`)
        .bind(params.clid)
        .first<{ total: number }>();

    const totalEvents = countResult?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalEvents / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const offset = (currentPage - 1) * PAGE_SIZE;

    const events = await db
        .prepare(`
            SELECT requested_at AS requestedAt,
                   referrer, user_agent AS userAgent,
                   country, region, city,
                   utm_source AS utmSource, utm_medium AS utmMedium,
                   utm_campaign AS utmCampaign, utm_term AS utmTerm, utm_content AS utmContent
            FROM redirect_events
            WHERE campaign_link_id = ?
            ORDER BY requested_at DESC
            LIMIT ? OFFSET ?
        `)
        .bind(params.clid, PAGE_SIZE, offset)
        .all<RedirectEvent>();

    return { campaignLink, events: events.results!, currentPage, totalPages, totalEvents };
};

type CampaignLink = {
    id: string;
    slug: string;
    isActive: boolean;
    linkSlug: string | null;
    destinationUrl: string;
    campaignId: string;
    campaignName: string;
};

type RedirectEvent = {
    requestedAt: string;
    referrer: string | null;
    userAgent: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    utmContent: string | null;
};
