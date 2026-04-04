import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform, params }) => {
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
            `
		)
		.bind(id)
		.all<RedirectEvent>();

	return {
		link: link,
		events: events.results!
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
