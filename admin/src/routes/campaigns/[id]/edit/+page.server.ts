import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { campaignIdExists, getCampaignForm, validateCampaignForm } from '$/routes/campaigns/validation';

export const load: PageServerLoad = async ({ params, platform }) => {
    const db = platform?.env.aka;
    if (!db) throw Error('database unavailable');

    const campaign = await db
        .prepare(`SELECT id, name, notes FROM campaigns WHERE id=?`)
        .bind(params.id)
        .first<{ id: string; name: string; notes: string | null }>();

    return { campaign };
};

export const actions = {
    default: async ({ request, platform, params }) => {
        const db = platform?.env.aka;
        if (!db) throw Error('database unavailable');

        if (!(await campaignIdExists(params.id, db))) {
            return fail(404, { errors: { id: 'Campaign not found' } });
        }

        const data = await request.formData();
        const form = getCampaignForm(data);
        const errors = validateCampaignForm(form);
        if (errors) return fail(400, { ...form, errors });

        const now = new Date().toISOString();
        await db
            .prepare(`UPDATE campaigns SET name=?2, notes=?3, updated_at=?4 WHERE id=?1`)
            .bind(params.id, form.name, form.notes || null, now)
            .run();

        return redirect(302, `/campaigns/${params.id}`);
    }
} satisfies Actions;
