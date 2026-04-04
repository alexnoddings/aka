export const linkConstraints = {
	slug: {
		maxLength: 128,
		validate: (slug: string): string | undefined => {
			const base = new URL('invalid://site');
			let url;
			try {
				url = new URL(slug, base);
			} catch {
				return 'Invalid slug';
			}

			let pathname = url.pathname;
			if (pathname.startsWith('/')) {
				pathname = pathname.substring(1);
			}

			if (pathname != slug) return `Slug is not a valid pathname. It forms '${pathname}'.`;

			return undefined;
		}
	},
	destination: {
		maxLength: 512,
		isValid: (url: string): boolean => {
			try {
				new URL(url);
				return true;
			} catch {
				return false;
			}
		}
	},
	notes: {
		maxLength: 512
	}
};
