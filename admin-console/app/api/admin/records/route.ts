import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";

const ADMIN_EMAILS = new Set(["suzywang168@gmail.com"]);

async function requireAdmin() {
  const user = await getChatGPTUser();
  if (!user || !ADMIN_EMAILS.has(user.email.toLowerCase())) return null;
  return user;
}

function validRows(value: unknown): value is string[][] {
  return (
    Array.isArray(value) &&
    value.length <= 1000 &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.length <= 30 &&
        row.every((cell) => typeof cell === "string" && cell.length <= 5000),
    )
  );
}

async function readAllRecords() {
  const result = await env.DB.prepare(
    "SELECT view_key, position, payload FROM admin_records ORDER BY view_key, position",
  ).all<{ view_key: string; position: number; payload: string }>();
  const records: Record<string, string[][]> = {};
  for (const row of result.results) {
    if (!records[row.view_key]) records[row.view_key] = [];
    records[row.view_key].push(JSON.parse(row.payload) as string[]);
  }
  return records;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ records: await readAllRecords() });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { records?: Record<string, unknown> };
  const entries = Object.entries(body.records ?? {}).filter(([, rows]) =>
    validRows(rows),
  ) as Array<[string, string[][]]>;
  const existing = await env.DB.prepare(
    "SELECT DISTINCT view_key FROM admin_records",
  ).all<{ view_key: string }>();
  const existingKeys = new Set(existing.results.map((row) => row.view_key));
  const statements = entries
    .filter(([viewKey]) => !existingKeys.has(viewKey))
    .flatMap(([viewKey, rows]) =>
      rows.map((row, position) =>
        env.DB.prepare(
          "INSERT INTO admin_records (view_key, position, payload, updated_at) VALUES (?, ?, ?, ?)",
        ).bind(
          viewKey,
          position,
          JSON.stringify(row),
          Math.floor(Date.now() / 1000),
        ),
      ),
    );
  if (statements.length) await env.DB.batch(statements);
  return Response.json({
    records: await readAllRecords(),
    initialized: statements.length,
  });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as {
    viewKey?: string;
    rows?: unknown;
    action?: string;
  };
  const viewKey = body.viewKey?.trim() ?? "";
  if (!/^[a-z]+-\d+$/.test(viewKey) || !validRows(body.rows)) {
    return Response.json({ error: "Invalid records payload" }, { status: 400 });
  }
  const now = Math.floor(Date.now() / 1000);
  const statements = [
    env.DB.prepare("DELETE FROM admin_records WHERE view_key = ?").bind(
      viewKey,
    ),
    ...body.rows.map((row, position) =>
      env.DB.prepare(
        "INSERT INTO admin_records (view_key, position, payload, updated_at) VALUES (?, ?, ?, ?)",
      ).bind(viewKey, position, JSON.stringify(row), now),
    ),
    env.DB.prepare(
      "INSERT INTO audit_logs (actor_email, action, view_key, detail, created_at) VALUES (?, ?, ?, ?, ?)",
    ).bind(
      admin.email,
      body.action?.slice(0, 80) || "replace_records",
      viewKey,
      JSON.stringify({ rowCount: body.rows.length }),
      now,
    ),
  ];
  await env.DB.batch(statements);
  return Response.json({ ok: true, rows: body.rows });
}
