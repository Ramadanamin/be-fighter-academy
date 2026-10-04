import { clearAdminSessionCookie, isSameOrigin } from "@/app/admin-auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "طلب غير مسموح" }, { status: 403 });
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearAdminSessionCookie(), "Cache-Control": "no-store" } });
}
