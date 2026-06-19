import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { campaignIdExists } from '$/routes/campaigns/validation';

export const load: PageServerLoad = async ({ params, platform }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const campaign = await db
        .prepare(`SELECT id, name FROM campaigns WHERE id=?`)
        .bind(params.id)
        .first<{ id: string; name: string }>();

    return { campaign };
};

export const actions = {
    default: async ({ platform, params }) => {
        const db = platform?.env.aka;
        if (!db) throw Error('database unavailable');

        if (!(await campaignIdExists(params.id, db))) {
            return fail(404, { errors: { id: 'Campaign not found' } });
        }

        const now = new Date().toISOString();
        await db
            .prepare(`UPDATE campaigns SET is_active=0, updated_at=?2 WHERE id=?1`)
            .bind(params.id, now)
            .run();

        return redirect(302, `/campaigns`);
    }
} satisfies Actions;
