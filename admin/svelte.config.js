import adapter from '@sveltejs/adapter-cloudflare';

const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$/*': 'src/*',
		}
	}
};

export default config;
