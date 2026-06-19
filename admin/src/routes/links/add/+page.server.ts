import { type Actions, fail, redirect } from '@sveltejs/kit';
import { getExistingSlugId, getForm, validateForm } from '$/routes/links/validation';
import { generateId } from '$lib/id';

export const actions = {
	default: async ({ request, platform }) => {
		const db = platform?.env.aka;
		if (!db) {
			throw Error('database unavailable');
		}

		const data = await request.formData();
		const publicSlug = data.get('publicSlug') === 'on';
		const form = getForm(data);
		if (!publicSlug) form.slug = '';

		const errors = await validateForm(form, db);
		if (errors) {
			return fail(400, { ...form, publicSlug, errors });
		}

		if (publicSlug) {
			const existingSlug = await getExistingSlugId(form.slug, db);
			if (existingSlug) {
				return fail(400, { ...form, publicSlug, errors: { slug: 'A link already exists with this slug' } });
			}
		}

		const id = generateId();
		const now = new Date().toISOString();
		const slug = publicSlug ? form.slug : null;
		await db
			.prepare(`
                INSERT INTO links (id, slug, destination_url, notes, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `)
			.bind(id, slug, form.destination, form.notes, true, now, now)
			.run();

		return redirect(302, `/links`);
	}
} satisfies Actions;
