import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getForm, idExists } from '$/routes/links/validation';

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform?.env.aka;
	if (!db) {
		throw Error('database unavailable');
	}

	const id = params.id;
	const link = await db
		.prepare(`SELECT id, slug, notes FROM links WHERE id=?`)
		.bind(id)
		.first<Link>();

	return { link: link };
};

type Link = {
	id: string;
	slug: string;
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

		const now = new Date().toISOString();
		await db
			.prepare(
				`
				UPDATE links
				SET is_active  = 1,
				    updated_at = ?2
				WHERE id = ?1`
			)
			.bind(id, now)
			.run();

		return redirect(302, `/links`);
	}
} satisfies Actions;
