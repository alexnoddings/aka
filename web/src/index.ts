import { recordRedirectEvent } from './events';

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
    const resolved = await env.aka
        .prepare(`
            SELECT l.id AS linkId, l.destination_url AS destinationUrl, NULL AS campaignLinkId
            FROM links l
            WHERE l.slug = ? AND l.is_active = 1

            UNION ALL

            SELECT l.id AS linkId, l.destination_url AS destinationUrl, cl.id AS campaignLinkId
            FROM campaign_links cl
            JOIN links l ON l.id = cl.link_id
            JOIN campaigns c ON c.id = cl.campaign_id
            WHERE cl.slug = ? AND cl.is_active = 1 AND l.is_active = 1 AND c.is_active = 1

            LIMIT 1
        `)
        .bind(slug, slug)
        .first<ResolvedSlug>();

    if (!resolved) {
        return new Response(null, { status: 404 });
    }

    ctx.waitUntil(
        recordRedirectEvent(request, env, resolved.linkId, resolved.campaignLinkId, request.url)
    );

    return Response.redirect(resolved.destinationUrl, 302);
}

type ResolvedSlug = {
    linkId: string;
    destinationUrl: string;
    campaignLinkId: string | null;
};
