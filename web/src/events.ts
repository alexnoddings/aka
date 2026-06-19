export async function recordRedirectEvent(
    request: Request<unknown, IncomingRequestCfProperties>,
    env: Env,
    linkId: string,
    campaignLinkId: string | null,
    requestUrl: string
) {
    const queryParams = new URL(requestUrl).searchParams;

    const id = crypto.randomUUID().replace(/-/g, '');
    const now = new Date().toISOString();
    await env.aka
        .prepare(`
            INSERT INTO redirect_events (
                id, 
                link_id, 
                campaign_link_id, 
                requested_at,           
                referrer, 
                user_agent, 
                country, 
                region, 
                city,
                utm_source, 
                utm_medium, 
                utm_campaign, 
                utm_term,
                utm_content
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            id,
            linkId,
            campaignLinkId,
            now,
            request.headers.get('Referer'),
            request.headers.get('User-Agent'),
            request.cf?.country ?? null,
            request.cf?.region ?? null,
            request.cf?.city ?? null,
            queryParams.get('utm_source'),
            queryParams.get('utm_medium'),
            queryParams.get('utm_campaign'),
            queryParams.get('utm_term'),
            queryParams.get('utm_content')
        )
        .run();
}
