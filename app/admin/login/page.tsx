import { redirect } from "next/navigation";
import { getAdminSessionFromServer } from "@/app/admin-auth";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdminSessionFromServer()) redirect("/dashboard");
  return <LoginForm />;
}
