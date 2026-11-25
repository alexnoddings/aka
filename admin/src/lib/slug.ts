const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_LENGTH = 8;

export async function generateCampaignSlug(
	db: D1Database,
	reserved?: Set<string>
): Promise<string> {
	for (let attempt = 0; attempt < 8; attempt++) {
		const slug = randomSlug();
		if (reserved?.has(slug)) continue;

		const exists = await slugExistsAnywhere(slug, db);
		if (!exists) {
			reserved?.add(slug);
			return slug;
		}
	}

	throw new Error('Failed to generate unique campaign slug');
}

function randomSlug(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(SLUG_LENGTH));
	return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

async function slugExistsAnywhere(slug: string, db: D1Database): Promise<boolean> {
	const result = await db
		.prepare(
			`SELECT 1 FROM links WHERE slug = ?
			UNION ALL
			SELECT 1 FROM campaign_links WHERE slug = ?
			LIMIT 1`
		)
		.bind(slug, slug)
		.first();
	return result !== null;
}
