import { adminSessionCookie, clearLoginFailures, createAdminSession, isSameOrigin, loginAttemptAllowed, recordLoginFailure, verifyAdminPassword } from "@/app/admin-auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "طلب غير مسموح" }, { status: 403 });
  try {
    if (!await loginAttemptAllowed(request)) return Response.json({ error: "محاولات كتير. جرّب تاني بعد 15 دقيقة." }, { status: 429 });
    const payload = await request.json() as Record<string, unknown>;
    const username = typeof payload.username === "string" ? payload.username.trim().slice(0, 80) : "";
    const password = typeof payload.password === "string" ? payload.password.slice(0, 200) : "";
    if (!await verifyAdminPassword(username, password)) {
      await recordLoginFailure(request);
      return Response.json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    await clearLoginFailures(request);
    const token = await createAdminSession(username);
    return Response.json({ ok: true }, { headers: { "Set-Cookie": adminSessionCookie(token), "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin login failed", error);
    return Response.json({ error: "تسجيل الدخول غير متاح مؤقتًا" }, { status: 500 });
  }
}
