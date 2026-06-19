import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform?.env.aka;
	if (!db) {
		throw Error('database unavailable');
	}

	const links = await db
		.prepare(`
            SELECT links.id,
                   links.is_active AS active,
                   links.slug,
                   links.notes,
                   links.destination_url AS destinationUrl,
                   links.created_at AS createdAt,
                   links.updated_at AS updatedAt,
                   sub.visitors,
                   sub.lastUsed
            FROM links
            LEFT JOIN (
                SELECT links.id,
                       COUNT(redirect_events.id) AS visitors,
                       MAX(redirect_events.requested_at) AS lastUsed
                FROM links
                LEFT JOIN redirect_events ON redirect_events.link_id = links.id
                GROUP BY links.id
            ) sub ON links.id = sub.id
            ORDER BY links.slug IS NULL, links.slug
        `)
		.all<LinkInfo>();

	return { links: links.results! };
};

type LinkInfo = {
	id: string;
	active: boolean;
	slug: string | null;
	notes: string | null;
	destinationUrl: string;
	createdAt: string;
	updatedAt: string;
	visitors: number;
	lastUsed: string | null;
};
