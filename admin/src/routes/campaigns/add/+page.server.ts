import { type Actions, fail, redirect } from '@sveltejs/kit';
import { getCampaignForm, validateCampaignForm } from '$/routes/campaigns/validation';
import { generateId } from '$lib/id';

export const actions = {
    default: async ({ request, platform }) => {
        const db = platform?.env.aka;
        if (!db) throw Error('database unavailable');

        const data = await request.formData();
        const form = getCampaignForm(data);
        const errors = validateCampaignForm(form);
        if (errors) return fail(400, { ...form, errors });

        const id = generateId();
        const now = new Date().toISOString();
        await db
            .prepare(`
                INSERT INTO campaigns (id, name, notes, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            .bind(id, form.name, form.notes || null, true, now, now)
            .run();

        return redirect(302, `/campaigns/${id}`);
    }
} satisfies Actions;
