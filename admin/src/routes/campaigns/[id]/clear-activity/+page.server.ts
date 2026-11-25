import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { campaignIdExists } from '$/routes/campaigns/validation';
import { getDb } from '$lib/server/db';
import { minutesAgo } from '$lib/server/time';

const CLEAR_WINDOW_MINUTES = 30;

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = getDb(platform);

	const campaign = await db
		.prepare(`SELECT id, name FROM campaigns WHERE id=?`)
		.bind(params.id)
		.first<{ id: string; name: string }>();

	if (!campaign) return { campaign: undefined, eventCount: 0, windowMinutes: CLEAR_WINDOW_MINUTES };

	const result = await db
		.prepare(
			`
            SELECT COUNT(*) AS count
            FROM redirect_events re
            JOIN campaign_links cl ON re.campaign_link_id = cl.id
            WHERE cl.campaign_id = ? AND re.requested_at >= ?
        `
		)
		.bind(params.id, minutesAgo(CLEAR_WINDOW_MINUTES))
		.first<{ count: number }>();

	return { campaign, eventCount: result?.count ?? 0, windowMinutes: CLEAR_WINDOW_MINUTES };
};

export const actions = {
	default: async ({ platform, params }) => {
		const db = getDb(platform);

		if (!(await campaignIdExists(params.id, db))) {
			return fail(404, { errors: { id: 'Campaign not found' } });
		}

		await db
			.prepare(
				`
                DELETE FROM redirect_events
                WHERE requested_at >= ?2
                  AND campaign_link_id IN (SELECT id FROM campaign_links WHERE campaign_id = ?1)
            `
			)
			.bind(params.id, minutesAgo(CLEAR_WINDOW_MINUTES))
			.run();

		return redirect(302, `/campaigns/${params.id}`);
	}
} satisfies Actions;
