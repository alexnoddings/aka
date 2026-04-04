import type { PageServerLoad } from './$types';

export const load = (async ({ platform }) => {
	const db = platform?.env.aka;
	if (!db) {
		throw Error('database unavailable');
	}

	const today = new Date();

	const dayMin = new Date(today.valueOf());
	dayMin.setDate(dayMin.getDate() - 1);

	const monthMin = new Date(today.valueOf());
	monthMin.setDate(monthMin.getDate() - 30);

	const data = await db
		.prepare(
			`
				SELECT (SELECT COUNT(*) FROM links WHERE is_active = 1)               AS enabledLinkCount,
				       (SELECT COUNT(*) FROM links WHERE is_active = 0)               AS disabledLinkCount,
				       (SELECT COUNT(*) FROM redirect_events WHERE requested_at >= ?) AS dayVisitorCount,
				       (SELECT COUNT(*) FROM redirect_events WHERE requested_at >= ?) AS monthVisitorCount,
				       (SELECT COUNT(*) FROM redirect_events)                         AS lifetimeVisitorCount
			`
		)
		.bind(dayMin.toISOString(), monthMin.toISOString())
		.first<Data>();

	return data;
}) satisfies PageServerLoad;

type Data = {
	enabledLinkCount: number;
	disabledLinkCount: number;
	dayVisitorCount: number;
	monthVisitorCount: number;
	lifetimeVisitorCount: number;
};
