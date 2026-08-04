# Octopus Admin Console

Source mirror for the protected Octopus Admin Site.

## Architecture

- Cloudflare D1 stores Admin list records and immutable audit events.
- `/api/admin/records` requires the approved ChatGPT administrator identity for reads and writes.
- `/api/shared/records` is a CORS-enabled, read-only and allowlisted API for the GitHub Pages User Portal.
- Sensitive views such as billing details, administrator accounts, credentials, system parameters, and blocklists are never exposed through the public endpoint.
- The User Portal bridge lives in `user-portal/v78/api-config.js` and `user-portal/v78/d1-client-v713.js`.

Production Admin: https://octopus-admin-console.suzywang168.chatgpt.site

The deployable Site remains managed by OpenAI Sites; this directory is the GitHub source mirror and integration reference.
