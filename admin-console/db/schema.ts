import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const adminRecords = sqliteTable(
  "admin_records",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    viewKey: text("view_key").notNull(),
    position: integer("position").notNull(),
    payload: text("payload").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("admin_records_view_position_idx").on(
      table.viewKey,
      table.position,
    ),
  ],
);

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  viewKey: text("view_key").notNull(),
  detail: text("detail").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
