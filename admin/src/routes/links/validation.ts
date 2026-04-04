import { linkConstraints } from '$/routes/links/linkConstraints.ts';

type Form = {
	slug: string;
	destination: string;
	notes: string;
};

type FormErrors = {
	slug?: string;
	destination?: string;
	notes?: string;
};

function getString(form: FormData, key: string) {
	const value = form.get(key);
	if (!value) return '';

	if (typeof value !== 'string') return '';

	return value.trim();
}

export function getForm(data: FormData) {
	return {
		slug: getString(data, 'slug').toLowerCase(),
		destination: getString(data, 'destination'),
		notes: getString(data, 'notes')
	};
}

export async function validateForm(form: Form, aka: D1Database): Promise<FormErrors | undefined> {
	if (form.slug.length > linkConstraints.slug.maxLength) {
		return {
			slug: `Slug must be ${linkConstraints.slug.maxLength} characters or less`
		};
	}

	const slugError = linkConstraints.slug.validate(form.slug);
	if (!!slugError) {
		return {
			slug: slugError
		};
	}

	if (!linkConstraints.destination.isValid(form.destination)) {
		return {
			destination: `Destination must be a valid URL`
		};
	}

	if (form.destination.length > linkConstraints.destination.maxLength) {
		return {
			destination: `Destination must be ${linkConstraints.destination.maxLength} characters or less`
		};
	}

	if (form.notes.length > linkConstraints.notes.maxLength) {
		return {
			notes: `Notes must be ${linkConstraints.destination.maxLength} characters or less`
		};
	}

	return undefined;
}

export async function getExistingSlugId(
	slug: string,
	aka: D1Database
): Promise<string | undefined> {
	const result = await aka
		.prepare(`SELECT id FROM links WHERE slug=?`)
		.bind(slug)
		.first<{ id: string }>();
	return result?.id;
}

export async function idExists(id: string, aka: D1Database): Promise<boolean> {
	const result = await aka
		.prepare(`SELECT EXISTS(SELECT 1 FROM links WHERE id=?) AS linkExists`)
		.bind(id)
		.first<{ linkExists: boolean }>();
	return result?.linkExists ?? false;
}
