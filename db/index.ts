import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { DatabaseSync } from "node:sqlite";

export type LeadRecord = {
  id: number;
  name: string;
  phone: string;
  traineeType: string;
  childAge: string | null;
  trainingType: string;
  participants: string | null;
  goal: string;
  area: string;
  preferredTime: string | null;
  packageChoice: string | null;
  notes: string;
  language: string;
  source: string;
  status: string;
  followUpAt: string | null;
  crmNotes: string;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type LeadInput = Omit<LeadRecord, "id" | "source" | "status" | "followUpAt" | "crmNotes" | "lastContactedAt" | "createdAt" | "updatedAt">;
export type LeadChanges = Partial<Omit<LeadRecord, "id" | "createdAt">>;

type AuthAttempt = {
  key: string;
  attemptCount: number;
  windowStartedAt: string;
  lockedUntil: string | null;
  updatedAt: string;
};

let database: DatabaseSync | null = null;

function dbPath() {
  const configured = process.env.CRM_DB_PATH?.trim();
  return configured || join(homedir(), ".be-fighter", "be-fighter-crm.sqlite");
}

function getDb() {
  if (database) return database;
  const path = dbPath();
  mkdirSync(dirname(path), { recursive: true });
  database = new DatabaseSync(path);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      trainee_type TEXT NOT NULL DEFAULT 'recommend',
      child_age TEXT,
      training_type TEXT NOT NULL DEFAULT 'not_sure',
      participants TEXT,
      goal TEXT NOT NULL DEFAULT '',
      area TEXT NOT NULL DEFAULT 'other',
      preferred_time TEXT,
      package_choice TEXT,
      notes TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'ar',
      source TEXT NOT NULL DEFAULT 'website',
      status TEXT NOT NULL DEFAULT 'new',
      follow_up_at TEXT,
      crm_notes TEXT NOT NULL DEFAULT '',
      last_contacted_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON leads(status, created_at);
    CREATE INDEX IF NOT EXISTS idx_leads_follow_up_at ON leads(follow_up_at);

    CREATE TABLE IF NOT EXISTS crm_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_auth_attempts (
      key TEXT PRIMARY KEY,
      attempt_count INTEGER NOT NULL DEFAULT 0,
      window_started_at TEXT NOT NULL,
      locked_until TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return database;
}

function mapLead(row: Record<string, unknown>): LeadRecord {
  return {
    id: Number(row.id),
    name: String(row.name ?? ""),
    phone: String(row.phone ?? ""),
    traineeType: String(row.trainee_type ?? "recommend"),
    childAge: row.child_age == null ? null : String(row.child_age),
    trainingType: String(row.training_type ?? "not_sure"),
    participants: row.participants == null ? null : String(row.participants),
    goal: String(row.goal ?? ""),
    area: String(row.area ?? "other"),
    preferredTime: row.preferred_time == null ? null : String(row.preferred_time),
    packageChoice: row.package_choice == null ? null : String(row.package_choice),
    notes: String(row.notes ?? ""),
    language: String(row.language ?? "ar"),
    source: String(row.source ?? "website"),
    status: String(row.status ?? "new"),
    followUpAt: row.follow_up_at == null ? null : String(row.follow_up_at),
    crmNotes: String(row.crm_notes ?? ""),
    lastContactedAt: row.last_contacted_at == null ? null : String(row.last_contacted_at),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export function listLeads(status?: string, query?: string) {
  const db = getDb();
  const where: string[] = [];
  const params: (string | number | null)[] = [];
  if (status) {
    where.push("status = ?");
    params.push(status);
  }
  if (query) {
    where.push("(name LIKE ? OR phone LIKE ? OR area LIKE ?)");
    const term = `%${query}%`;
    params.push(term, term, term);
  }
  const sql = `SELECT * FROM leads${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY datetime(created_at) DESC, id DESC LIMIT 500`;
  return db.prepare(sql).all(...params).map(row => mapLead(row as Record<string, unknown>));
}

export function createLead(input: LeadInput) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO leads (
      name, phone, trainee_type, child_age, training_type, participants, goal, area,
      preferred_time, package_choice, notes, language
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.name,
    input.phone,
    input.traineeType,
    input.childAge,
    input.trainingType,
    input.participants,
    input.goal,
    input.area,
    input.preferredTime,
    input.packageChoice,
    input.notes,
    input.language,
  );
  return getLead(Number(result.lastInsertRowid));
}

export function getLead(id: number) {
  const row = getDb().prepare("SELECT * FROM leads WHERE id = ? LIMIT 1").get(id);
  return row ? mapLead(row as Record<string, unknown>) : null;
}

const leadColumns: Record<keyof LeadChanges, string> = {
  name: "name",
  phone: "phone",
  traineeType: "trainee_type",
  childAge: "child_age",
  trainingType: "training_type",
  participants: "participants",
  goal: "goal",
  area: "area",
  preferredTime: "preferred_time",
  packageChoice: "package_choice",
  notes: "notes",
  language: "language",
  source: "source",
  status: "status",
  followUpAt: "follow_up_at",
  crmNotes: "crm_notes",
  lastContactedAt: "last_contacted_at",
  updatedAt: "updated_at",
};

export function updateLead(id: number, changes: LeadChanges) {
  const entries = Object.entries(changes).filter(([, value]) => value !== undefined) as [keyof LeadChanges, string | number | null][];
  if (!entries.length) return getLead(id);
  const assignments = entries.map(([key]) => `${leadColumns[key]} = ?`).join(", ");
  const params = entries.map(([, value]) => value);
  const result = getDb().prepare(`UPDATE leads SET ${assignments} WHERE id = ?`).run(...params, id);
  return result.changes ? getLead(id) : null;
}

export function deleteLead(id: number) {
  return getDb().prepare("DELETE FROM leads WHERE id = ?").run(id).changes > 0;
}

export function getAuthAttempt(key: string): AuthAttempt | null {
  const row = getDb().prepare("SELECT * FROM admin_auth_attempts WHERE key = ? LIMIT 1").get(key) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
    key: String(row.key),
    attemptCount: Number(row.attempt_count),
    windowStartedAt: String(row.window_started_at),
    lockedUntil: row.locked_until == null ? null : String(row.locked_until),
    updatedAt: String(row.updated_at),
  };
}

export function upsertAuthAttempt(attempt: AuthAttempt) {
  getDb().prepare(`
    INSERT INTO admin_auth_attempts (key, attempt_count, window_started_at, locked_until, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      attempt_count = excluded.attempt_count,
      window_started_at = excluded.window_started_at,
      locked_until = excluded.locked_until,
      updated_at = excluded.updated_at
  `).run(attempt.key, attempt.attemptCount, attempt.windowStartedAt, attempt.lockedUntil, attempt.updatedAt);
}

export function deleteAuthAttempt(key: string) {
  getDb().prepare("DELETE FROM admin_auth_attempts WHERE key = ?").run(key);
}

export function getCrmSetting(key: string) {
  const row = getDb().prepare("SELECT value FROM crm_settings WHERE key = ? LIMIT 1").get(key) as { value?: unknown } | undefined;
  return row?.value == null ? null : String(row.value);
}

export function setCrmSettingIfMissing(key: string, value: string) {
  getDb().prepare("INSERT OR IGNORE INTO crm_settings (key, value, updated_at) VALUES (?, ?, ?)").run(key, value, new Date().toISOString());
}
