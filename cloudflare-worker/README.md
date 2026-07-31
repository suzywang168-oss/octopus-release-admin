# Octopus Release API

Cloudflare Worker + D1 backend for the Octopus Release User Portal.

## Capabilities

- Real registration and login sessions
- Organization and member isolation
- Project CRUD
- Route-level record CRUD for scripts, production, assets, localization, release, revenue, reconciliation and settlement
- Business status actions such as review, sign, reconcile, cancel, withdraw and archive
- Audit log for all writes
- CORS restricted to the configured portal origins

## Deploy

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler d1 create octopus-release-db --location apac
cp wrangler.toml.example wrangler.toml
```

Copy the returned D1 database ID into `wrangler.toml`, then run:

```bash
npm run db:migrate:remote
npm run deploy
```

The deploy command prints the Worker URL. Open the User Portal and click the database status chip to save that URL.

## Production switches

- Set `ALLOW_DEMO = "false"` after creating real users.
- Keep `ALLOWED_ORIGINS` limited to the production portal origins.
- Use a custom Worker domain before wider external testing.
