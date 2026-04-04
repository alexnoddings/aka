import {recordRedirectEvent} from "./events";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			return await handleRequest(request, env, ctx);
		} catch (error) {
			console.error('Unhandled error', error);
			return Response.json({ error: 'Internal server error' }, { status: 500 });
		}
	}
} satisfies ExportedHandler<Env>;

async function handleRequest(
	request: Request<unknown, IncomingRequestCfProperties>,
	env: Env,
	ctx: ExecutionContext
): Promise<Response> {
	const { pathname } = new URL(request.url);

	if (request.method !== 'GET') {
		return Response.json({ error: 'Method not allowed' }, { status: 405 });
	}

	if (pathname === '/favicon.ico') {
		return new Response(null, { status: 204 });
	}

	// strip '/' from the start
	const slug = pathname.substring(1).toLowerCase();
	return await handleRedirectRequest(request, env, ctx, slug);
}

async function handleRedirectRequest(
	request: Request<unknown, IncomingRequestCfProperties>,
	env: Env,
	ctx: ExecutionContext,
	slug: string
): Promise<Response> {
	const link = await env.aka
		.prepare(
			`
				SELECT id,
				       slug,
				       destination_url AS destinationUrl
				FROM links
				WHERE is_active = 1
				  AND slug = ? LIMIT 1
			`
		)
		.bind(slug)
		.first<Link>();

	if (!link) {
		return new Response(null, { status: 404 });
	}

	const recordEventPromise = recordRedirectEvent(
		request,
		env,
		link.id,
		request.url,
		link.destinationUrl
	);
	ctx.waitUntil(recordEventPromise);

	return Response.redirect(link.destinationUrl, 302);
}

type Link = {
	id: string;
	slug: string;
	destinationUrl: string;
};
