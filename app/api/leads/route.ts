import { and, desc, eq, like, or, type SQL } from "drizzle-orm";
import { getAdminSessionFromRequest, isSameOrigin } from "@/app/admin-auth";
import { getDb } from "@/db";
import { leads } from "@/db/schema";

const statuses = new Set(["new", "qualified", "package_sent", "follow_up", "booked", "not_interested"]);
const traineeTypes = new Set(["kids", "adults", "group", "recommend"]);
const trainingTypes = new Set(["boxing", "kickboxing", "mma", "self_defense", "fitness", "not_sure"]);
const packages = new Set(["starter_private", "private_coaching", "signature_coaching", "private_circle"]);
const areas = new Set(["madinaty", "rehab", "shorouk", "golf", "diar", "other"]);

function clean(value: unknown, max = 250) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function requireAdmin(request: Request) {
  return getAdminSessionFromRequest(request);
}

export async function GET(request: Request) {
  try {
    if (!await requireAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const status = clean(url.searchParams.get("status"), 40);
    const query = clean(url.searchParams.get("q"), 100);
    const conditions: SQL[] = [];
    if (statuses.has(status)) conditions.push(eq(leads.status, status));
    if (query) conditions.push(or(like(leads.name, `%${query}%`), like(leads.phone, `%${query}%`), like(leads.area, `%${query}%`))!);
    const rows = await getDb().select().from(leads).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(leads.createdAt), desc(leads.id)).limit(500);
    return Response.json({ leads: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("CRM lead list failed", error);
    return Response.json({ error: "CRM data is temporarily unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) return Response.json({ error: "Request not allowed" }, { status: 403 });
    const payload = await request.json() as Record<string, unknown>;
    const name = clean(payload.name, 100);
    const phone = clean(payload.phone, 30);
    if (name.length < 2 || !/^[+0-9 ()-]{9,30}$/.test(phone)) {
      return Response.json({ error: "Name and a valid phone number are required" }, { status: 400 });
    }
    const traineeType = clean(payload.traineeType, 30);
    const trainingType = clean(payload.trainingType, 30);
    const area = clean(payload.area, 30);
    const packageChoice = clean(payload.packageChoice, 40);
    const [lead] = await getDb().insert(leads).values({
      name,
      phone,
      traineeType: traineeTypes.has(traineeType) ? traineeType : "recommend",
      childAge: clean(payload.childAge, 10) || null,
      trainingType: trainingTypes.has(trainingType) ? trainingType : "not_sure",
      participants: clean(payload.participants, 20) || null,
      goal: clean(payload.goal, 500),
      area: areas.has(area) ? area : "other",
      preferredTime: clean(payload.preferredTime, 120) || null,
      packageChoice: packages.has(packageChoice) ? packageChoice : null,
      notes: clean(payload.notes, 1500),
      language: payload.language === "en" ? "en" : "ar",
    }).returning({ id: leads.id, createdAt: leads.createdAt });
    return Response.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Lead capture failed", error);
    return Response.json({ error: "Unable to save the request right now" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!isSameOrigin(request) || !await requireAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await request.json() as Record<string, unknown>;
    const id = Number(payload.id);
    if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid lead update" }, { status: 400 });
    const changes: Partial<typeof leads.$inferInsert> = { updatedAt: new Date().toISOString() };
    if ("name" in payload) {
      const name = clean(payload.name, 100);
      if (name.length < 2) return Response.json({ error: "Name is required" }, { status: 400 });
      changes.name = name;
    }
    if ("phone" in payload) {
      const phone = clean(payload.phone, 30);
      if (!/^[+0-9 ()-]{9,30}$/.test(phone)) return Response.json({ error: "A valid phone number is required" }, { status: 400 });
      changes.phone = phone;
    }
    if ("traineeType" in payload) {
      const value = clean(payload.traineeType, 30);
      if (!traineeTypes.has(value)) return Response.json({ error: "Invalid trainee type" }, { status: 400 });
      changes.traineeType = value;
    }
    if ("trainingType" in payload) {
      const value = clean(payload.trainingType, 30);
      if (!trainingTypes.has(value)) return Response.json({ error: "Invalid training type" }, { status: 400 });
      changes.trainingType = value;
    }
    if ("area" in payload) {
      const value = clean(payload.area, 30);
      if (!areas.has(value)) return Response.json({ error: "Invalid area" }, { status: 400 });
      changes.area = value;
    }
    if ("packageChoice" in payload) {
      const value = clean(payload.packageChoice, 40);
      changes.packageChoice = packages.has(value) ? value : null;
    }
    if ("status" in payload) {
      const value = clean(payload.status, 40);
      if (!statuses.has(value)) return Response.json({ error: "Invalid lead status" }, { status: 400 });
      changes.status = value;
    }
    if ("childAge" in payload) changes.childAge = clean(payload.childAge, 10) || null;
    if ("participants" in payload) changes.participants = clean(payload.participants, 20) || null;
    if ("goal" in payload) changes.goal = clean(payload.goal, 500);
    if ("preferredTime" in payload) changes.preferredTime = clean(payload.preferredTime, 120) || null;
    if ("notes" in payload) changes.notes = clean(payload.notes, 1500);
    if ("followUpAt" in payload) changes.followUpAt = clean(payload.followUpAt, 40) || null;
    if ("crmNotes" in payload) changes.crmNotes = clean(payload.crmNotes, 3000);
    if (payload.markContacted) changes.lastContactedAt = new Date().toISOString();
    const [lead] = await getDb().update(leads).set(changes).where(eq(leads.id, id)).returning();
    if (!lead) return Response.json({ error: "Lead not found" }, { status: 404 });
    return Response.json({ lead });
  } catch (error) {
    console.error("CRM lead update failed", error);
    return Response.json({ error: "Unable to update this lead" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isSameOrigin(request) || !await requireAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid lead" }, { status: 400 });
    const [deleted] = await getDb().delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
    if (!deleted) return Response.json({ error: "Lead not found" }, { status: 404 });
    return Response.json({ deleted: true, id: deleted.id });
  } catch (error) {
    console.error("CRM lead deletion failed", error);
    return Response.json({ error: "Unable to delete this lead" }, { status: 500 });
  }
}
