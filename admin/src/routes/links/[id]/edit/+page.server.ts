import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getExistingSlugId, getForm, idExists, validateForm } from '../../validation.ts';

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform?.env.aka;
	if (!db) {
		throw Error('database unavailable');
	}

	const id = params.id;
	const link = await db
		.prepare(`SELECT id, slug, destination_url AS destinationUrl, notes FROM links WHERE id=?`)
		.bind(id)
		.first<Link>();

	return { link: link };
};

type Link = {
	id: string;
	slug: string;
	destinationUrl: string;
	notes: string;
};

export const actions = {
	default: async ({ request, platform, params }) => {
		const id = params.id;

		const db = platform?.env.aka;
		if (!db) {
			throw Error('database unavailable');
		}

		const data = await request.formData();
		const form = getForm(data);
		if (!(await idExists(id, db))) {
			return fail(404, {
				...form,
				errors: {
					id: 'Link not found'
				}
			});
		}

		const errors = await validateForm(form, db);
		if (!!errors) {
			return fail(400, {
				...form,
				errors: errors
			});
		}

		const existingSlug = await getExistingSlugId(form.slug, db);
		const isDuplicateSlug = !!existingSlug && existingSlug != id;
		if (isDuplicateSlug) {
			return fail(400, {
				...form,
				errors: {
					slug: 'A different link already exists with this slug'
				}
			});
		}

		const now = new Date().toISOString();
		await db
			.prepare(
				`
				UPDATE links
				SET slug            = ?2,
				    destination_url = ?3,
				    notes           = ?4,
				    updated_at      = ?5
				WHERE id = ?1`
			)
			.bind(id, form.slug, form.destination, form.notes, now)
			.run();

		return redirect(302, `/links}`);
	}
} satisfies Actions;
