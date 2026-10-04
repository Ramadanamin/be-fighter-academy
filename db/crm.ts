import { eq } from "drizzle-orm";
import { getDb } from ".";
import { crmSettings } from "./schema";

const OWNER_KEY = "owner_user_id";

export async function claimCrmOwnership(userId: string) {
  const db = getDb();
  await db.insert(crmSettings).values({ key: OWNER_KEY, value: userId }).onConflictDoNothing();
  return isCrmOwner(userId);
}

export async function isCrmOwner(userId: string) {
  const db = getDb();
  const [setting] = await db.select({ value: crmSettings.value }).from(crmSettings).where(eq(crmSettings.key, OWNER_KEY)).limit(1);
  return setting?.value === userId;
}
