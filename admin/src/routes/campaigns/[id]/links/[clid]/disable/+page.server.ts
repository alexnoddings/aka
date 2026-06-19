import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const campaignLink = await db
        .prepare(`
            SELECT cl.id, cl.slug, c.id AS campaignId, c.name AS campaignName
            FROM campaign_links cl
            JOIN campaigns c ON c.id = cl.campaign_id
            WHERE cl.id = ? AND cl.campaign_id = ?
        `)
        .bind(params.clid, params.id)
        .first<{ id: string; slug: string; campaignId: string; campaignName: string }>();

    return { campaignLink };
};

export const actions = {
    default: async ({ platform, params }) => {
        const db = platform?.env.aka;
        if (!db) throw Error('database unavailable');

        const exists = await db
            .prepare(`SELECT EXISTS(SELECT 1 FROM campaign_links WHERE id=? AND campaign_id=?) AS clExists`)
            .bind(params.clid, params.id)
            .first<{ clExists: boolean }>();

        if (!exists?.clExists) return fail(404, { errors: { id: 'Campaign link not found' } });

        await db
            .prepare(`UPDATE campaign_links SET is_active=0 WHERE id=?`)
            .bind(params.clid)
            .run();

        return redirect(302, `/campaigns/${params.id}`);
    }
} satisfies Actions;
