import type { PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = platform?.env.aka;
	if (!db) {
		throw Error('database unavailable');
	}

	const filterLinkId = url.searchParams.get('linkId') || null;
	const filterSource = url.searchParams.get('utmSource') || null;
	const filterMedium = url.searchParams.get('utmMedium') || null;
	const filterCampaign = url.searchParams.get('utmCampaign') || null;
	const filterTerm = url.searchParams.get('utmTerm') || null;
	const filterContent = url.searchParams.get('utmContent') || null;

	const pageInt = parseInt(url.searchParams.get('page') ?? '1', 10);
	const page = Math.max(1, isNaN(pageInt) ? 1 : pageInt);

	const conditions: string[] = [];
	const bindings: (string | number)[] = [];

	if (filterLinkId) { conditions.push('re.link_id = ?'); bindings.push(filterLinkId); }
	if (filterSource) { conditions.push('re.utm_source = ?'); bindings.push(filterSource); }
	if (filterMedium) { conditions.push('re.utm_medium = ?'); bindings.push(filterMedium); }
	if (filterCampaign) { conditions.push('re.utm_campaign = ?'); bindings.push(filterCampaign); }
	if (filterTerm) { conditions.push('re.utm_term = ?'); bindings.push(filterTerm); }
	if (filterContent) { conditions.push('re.utm_content = ?'); bindings.push(filterContent); }

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

	const countResult = await db
		.prepare(`SELECT COUNT(*) AS total FROM redirect_events re ${whereClause}`)
		.bind(...bindings)
		.first<{ total: number }>();

	const linksResult = await db
		.prepare(`SELECT id, slug FROM links ORDER BY slug`)
		.all<LinkOption>();

	const totalEvents = countResult?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalEvents / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const offset = (currentPage - 1) * PAGE_SIZE;

	const events = await db
		.prepare(
			`
				SELECT re.id            AS id,
				       re.link_id       AS linkId,
				       l.slug           AS linkSlug,
				       re.requested_at  AS requestedAt,
				       re.referrer      AS referrer,
				       re.user_agent    AS userAgent,
				       re.country       AS country,
				       re.region        AS region,
				       re.city          AS city,
				       re.utm_source    AS utmSource,
				       re.utm_medium    AS utmMedium,
				       re.utm_campaign  AS utmCampaign,
				       re.utm_term      AS utmTerm,
				       re.utm_content   AS utmContent
				FROM redirect_events re
				JOIN links l ON l.id = re.link_id
				${whereClause}
				ORDER BY re.requested_at DESC
				LIMIT ? OFFSET ?
			`
		)
		.bind(...bindings, PAGE_SIZE, offset)
		.all<VisitEvent>();

	return {
		events: events.results!,
		links: linksResult.results!,
		currentPage,
		totalPages,
		totalEvents,
		filters: {
			linkId: filterLinkId,
			source: filterSource,
			medium: filterMedium,
			campaign: filterCampaign,
			term: filterTerm,
			content: filterContent
		}
	};
};

type LinkOption = {
	id: string;
	slug: string;
};

type VisitEvent = {
	id: string;
	linkId: string;
	linkSlug: string;
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
