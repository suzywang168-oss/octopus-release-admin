import { env } from "cloudflare:workers";

const PUBLIC_VIEWS = new Set([
  "partners-0",
  "resources-1",
  "risk-2",
  "channels-0",
  "analytics-0",
  "analytics-1",
  "analytics-2",
  "analytics-3",
  "ops-0",
]);
const PORTAL_ORIGIN = "https://suzywang168-oss.github.io";

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  return {
    "access-control-allow-origin":
      origin === PORTAL_ORIGIN ? origin : PORTAL_ORIGIN,
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "Content-Type",
    "access-control-max-age": "86400",
    vary: "Origin",
    "cache-control": "public, max-age=30, stale-while-revalidate=120",
  };
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedView = url.searchParams.get("view");
  if (requestedView && !PUBLIC_VIEWS.has(requestedView)) {
    return Response.json(
      { error: "This view is not available through the public Portal API." },
      { status: 403, headers: corsHeaders(request) },
    );
  }
  const keys = requestedView ? [requestedView] : [...PUBLIC_VIEWS];
  const placeholders = keys.map(() => "?").join(",");
  const result = await env.DB.prepare(
    `SELECT view_key, position, payload, updated_at FROM admin_records WHERE view_key IN (${placeholders}) ORDER BY view_key, position`,
  )
    .bind(...keys)
    .all<{
      view_key: string;
      position: number;
      payload: string;
      updated_at: number;
    }>();
  const records: Record<string, string[][]> = {};
  let updatedAt = 0;
  for (const row of result.results) {
    if (!records[row.view_key]) records[row.view_key] = [];
    records[row.view_key].push(JSON.parse(row.payload) as string[]);
    updatedAt = Math.max(updatedAt, row.updated_at);
  }
  return Response.json(
    {
      source: "octopus-admin-d1",
      version: 1,
      updatedAt: updatedAt ? new Date(updatedAt * 1000).toISOString() : null,
      records,
    },
    { headers: corsHeaders(request) },
  );
}
