# aka

aka is a lightweight personal URL shortener.

It runs on [Cloudflare Workers](https://workers.cloudflare.com/)
with a [SvelteKit](https://svelte.dev/docs/kit/introduction#What-is-SvelteKit) admin interface.

## Structure

The main site runs on [Cloudflare Workers](https://www.cloudflare.com/en-gb/developer-platform/products/workers/)
and redirects users to links based on the path they are accessing.

Links are stored in a [Cloudflare D1 database](https://www.cloudflare.com/en-gb/developer-platform/products/d1/).

The admin site runs on [Cloudflare Workers](https://www.cloudflare.com/en-gb/developer-platform/products/workers/)
and uses [SvelteKit](https://svelte.dev/docs/kit/introduction#What-is-SvelteKit).

```mermaid
architecture-beta
    group cf(cloud)[Cloudflare]

    service db(database)[D1 Database] in cf
    service web(server)[Web Worker] in cf
    service admin(server)[Admin Pages] in cf

    service users(internet)[Users]
    service admins(internet)[Admins]

    users:R -- L:web
    admins:R -- L:admin

    web:R -- T:db
    admin:R -- L:db
```

## Local development

### First-time setup

Web needs a `wrangler.jsonc` file, based on the `wrangler.jsonc.example` file.

```bash
cd web
npm install
# init:
# - sets up local D1 database schema
# - generates TS types
npm run init
```

Admin also needs a `wrangler.jsonc` file, based on the `wrangler.jsonc.example` file.

```bash
cd admin
npm install
# init:
# - generates TS types
npm run init
```

### Running web

Web is hosted locally at http://localhost:8777/.

```bash
cd web
npm run dev
```

### Running admin

Web is hosted locally at http://localhost:8778/.

```bash
cd admin
npm run dev
```
