import { type Actions, fail, redirect } from '@sveltejs/kit';
import { getExistingSlugId, getForm, validateForm } from '$/routes/links/validation.ts';
import { generateId } from '$lib/id.ts';

export const actions = {
	default: async ({ request, platform }) => {
		const db = platform?.env.aka;
		if (!db) {
			throw Error('database unavailable');
		}

		const data = await request.formData();
		const form = getForm(data);
		const errors = await validateForm(form, db);
		if (!!errors) {
			return fail(400, {
				...form,
				errors: errors
			});
		}

		const existingSlug = await getExistingSlugId(form.slug, db);
		const isDuplicateSlug = !!existingSlug;
		if (isDuplicateSlug) {
			return fail(400, {
				...form,
				errors: {
					slug: 'A link already exists with this slug'
				}
			});
		}

		const id = generateId();
		const now = new Date().toISOString();
		await db
			.prepare(
				`INSERT INTO links (id,
					                   slug,
					                   destination_url,
					                   notes,
					                   is_active,
					                   created_at,
					                   updated_at)
					VALUES (?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(id, form.slug, form.destination, form.notes, true, now, now)
			.run();

		// No point redirecting to the created link since it won't have any analytics yet
		return redirect(302, `/links`);
	}
} satisfies Actions;
