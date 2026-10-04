import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  traineeType: text("trainee_type").notNull().default("recommend"),
  childAge: text("child_age"),
  trainingType: text("training_type").notNull().default("not_sure"),
  participants: text("participants"),
  goal: text("goal").notNull().default(""),
  area: text("area").notNull().default("other"),
  preferredTime: text("preferred_time"),
  packageChoice: text("package_choice"),
  notes: text("notes").notNull().default(""),
  language: text("language").notNull().default("ar"),
  source: text("source").notNull().default("website"),
  status: text("status").notNull().default("new"),
  followUpAt: text("follow_up_at"),
  crmNotes: text("crm_notes").notNull().default(""),
  lastContactedAt: text("last_contacted_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [
  index("idx_leads_status_created_at").on(table.status, table.createdAt),
  index("idx_leads_follow_up_at").on(table.followUpAt),
]);

export const crmSettings = sqliteTable("crm_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const adminAuthAttempts = sqliteTable("admin_auth_attempts", {
  key: text("key").primaryKey(),
  attemptCount: integer("attempt_count").notNull().default(0),
  windowStartedAt: text("window_started_at").notNull(),
  lockedUntil: text("locked_until"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
