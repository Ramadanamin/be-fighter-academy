import { redirect } from "next/navigation";
import { getAdminSessionFromServer } from "@/app/admin-auth";
import DashboardClient from "./dashboard-client";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const session = await getAdminSessionFromServer();
  if (!session) redirect("/admin/login");
  return <DashboardClient displayName={session.username} />;
}
