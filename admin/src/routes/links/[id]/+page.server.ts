import type { PageServerLoad } from './$types';

const PAGE_SIZE = 2;

export const load: PageServerLoad = async ({ platform, params, url }) => {
	const db = platform?.env.aka;
	if (!db) {
		throw Error('database unavailable');
	}

	const id = params.id;
	const link = await db
		.prepare(`SELECT id, slug, is_active AS isActive FROM links WHERE id=?`)
		.bind(id)
		.first<Link>();

	if (!link) {
		return { link: undefined };
	}

	const pageStr = url.searchParams.get('page') ?? '1';
	const pageInt = parseInt(pageStr, 10);
	const page = Math.max(1, pageInt);

	const countResult = await db
		.prepare(`SELECT COUNT(*) AS total FROM redirect_events WHERE link_id = ?`)
		.bind(id)
		.first<{ total: number }>();

	const totalEvents = countResult?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalEvents / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const offset = (currentPage - 1) * PAGE_SIZE;

	const events = await db
		.prepare(
			`
				SELECT requested_at AS requestedAt,
				       referrer     AS referrer,
				       user_agent   AS userAgent,
				       country      AS country,
				       region       AS region,
				       city         AS city,
				       utm_source   AS utmSource,
				       utm_medium   AS utmMedium,
				       utm_campaign AS utmCampaign,
				       utm_term     AS utmTerm,
				       utm_content  AS utmContent
				FROM redirect_events
				WHERE link_id = ?
				ORDER BY requested_at DESC
				LIMIT ? OFFSET ?
            `
		)
		.bind(id, PAGE_SIZE, offset)
		.all<RedirectEvent>();

	return {
		link,
		events: events.results!,
		currentPage,
		totalPages,
		totalEvents
	};
};

type Link = {
	id: string;
	slug: string;
	destinationUrl: string;
	notes: string;
};

type RedirectEvent = {
	requestedAt: string;
	referrer: string;
	userAgent: string;
	country: string;
	region: string;
	city: string;
	utmSource: string;
	utmMedium: string;
	utmCampaign: string;
	utmTerm: string;
	utmContent: string;
};
