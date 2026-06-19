import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getExistingSlugId, getForm, idExists, validateForm } from '$/routes/links/validation';

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

	return { link };
};

type Link = {
	id: string;
	slug: string | null;
	destinationUrl: string;
	notes: string | null;
};

export const actions = {
	default: async ({ request, platform, params }) => {
		const id = params.id;

		const db = platform?.env.aka;
		if (!db) {
			throw Error('database unavailable');
		}

		const data = await request.formData();
		const publicSlug = data.get('publicSlug') === 'on';
		const form = getForm(data);
		if (!publicSlug) form.slug = '';

		if (!(await idExists(id, db))) {
			return fail(404, { ...form, publicSlug, errors: { id: 'Link not found' } });
		}

		const errors = await validateForm(form, db);
		if (errors) {
			return fail(400, { ...form, publicSlug, errors });
		}

		if (publicSlug) {
			const existingSlug = await getExistingSlugId(form.slug, db);
			if (existingSlug && existingSlug !== id) {
				return fail(400, { ...form, publicSlug, errors: { slug: 'A different link already exists with this slug' } });
			}
		}

		const now = new Date().toISOString();
		const slug = publicSlug ? form.slug : null;
		await db
			.prepare(`
                UPDATE links
                SET slug            = ?2,
                    destination_url = ?3,
                    notes           = ?4,
                    updated_at      = ?5
                WHERE id = ?1
            `)
			.bind(id, slug, form.destination, form.notes, now)
			.run();

		return redirect(302, `/links`);
	}
} satisfies Actions;
