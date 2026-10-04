import "server-only";

import { headers } from "next/headers";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminAuthAttempts } from "@/db/schema";

const COOKIE_NAME = "bf_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type AdminSession = { username: string; expiresAt: number };

function runtimeValue(key: "CRM_ADMIN_USERNAME" | "CRM_ADMIN_PASSWORD_HASH" | "CRM_SESSION_SECRET") {
  return (env as unknown as Record<string, string | undefined>)[key] || "";
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  let different = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) different |= (left[index] || 0) ^ (right[index] || 0);
  return different === 0;
}

async function hmac(message: string) {
  const secret = runtimeValue("CRM_SESSION_SECRET");
  if (secret.length < 32) throw new Error("CRM session secret is unavailable");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

export async function verifyAdminPassword(username: string, password: string) {
  const expectedUsername = runtimeValue("CRM_ADMIN_USERNAME");
  const encodedHash = runtimeValue("CRM_ADMIN_PASSWORD_HASH");
  const [algorithm, iterationsValue, saltValue, hashValue] = encodedHash.split("$");
  if (!expectedUsername || algorithm !== "pbkdf2_sha256" || !iterationsValue || !saltValue || !hashValue) return false;

  const passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = new Uint8Array(await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt: base64UrlDecode(saltValue),
    iterations: Number(iterationsValue),
  }, passwordKey, 256));
  const passwordMatches = constantTimeEqual(derived, base64UrlDecode(hashValue));
  const usernameMatches = constantTimeEqual(encoder.encode(username), encoder.encode(expectedUsername));
  return usernameMatches && passwordMatches;
}

export async function createAdminSession(username: string) {
  const payload = base64UrlEncode(encoder.encode(JSON.stringify({
    username,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  })));
  return `${payload}.${base64UrlEncode(await hmac(payload))}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    if (!constantTimeEqual(base64UrlDecode(signature), await hmac(payload))) return null;
    const parsed = JSON.parse(decoder.decode(base64UrlDecode(payload))) as AdminSession;
    if (!parsed.username || parsed.username !== runtimeValue("CRM_ADMIN_USERNAME") || parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function cookieValue(cookieHeader: string | null) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [name, ...value] = part.trim().split("=");
    if (name === COOKIE_NAME) return value.join("=");
  }
  return undefined;
}

export async function getAdminSessionFromRequest(request: Request) {
  return verifyAdminSessionToken(cookieValue(request.headers.get("cookie")));
}

export async function getAdminSessionFromServer() {
  const requestHeaders = await headers();
  return verifyAdminSessionToken(cookieValue(requestHeaders.get("cookie")));
}

export function adminSessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    if (originUrl.origin === requestUrl.origin) return true;
    const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return Boolean(forwardedHost && originUrl.host === forwardedHost && originUrl.protocol === "https:");
  } catch {
    return false;
  }
}

async function attemptKey(request: Request) {
  const address = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(address));
  return base64UrlEncode(new Uint8Array(digest));
}

export async function loginAttemptAllowed(request: Request) {
  const key = await attemptKey(request);
  const [attempt] = await getDb().select().from(adminAuthAttempts).where(eq(adminAuthAttempts.key, key)).limit(1);
  if (!attempt) return true;
  return !attempt.lockedUntil || new Date(attempt.lockedUntil).getTime() <= Date.now();
}

export async function recordLoginFailure(request: Request) {
  const key = await attemptKey(request);
  const now = Date.now();
  const [existing] = await getDb().select().from(adminAuthAttempts).where(eq(adminAuthAttempts.key, key)).limit(1);
  const windowStarted = existing ? new Date(existing.windowStartedAt).getTime() : 0;
  const withinWindow = now - windowStarted < LOGIN_WINDOW_MS;
  const attemptCount = withinWindow ? (existing?.attemptCount || 0) + 1 : 1;
  const windowStartedAt = new Date(withinWindow ? windowStarted : now).toISOString();
  const lockedUntil = attemptCount >= MAX_LOGIN_ATTEMPTS ? new Date(now + LOGIN_WINDOW_MS).toISOString() : null;
  await getDb().insert(adminAuthAttempts).values({ key, attemptCount, windowStartedAt, lockedUntil, updatedAt: new Date(now).toISOString() }).onConflictDoUpdate({
    target: adminAuthAttempts.key,
    set: { attemptCount, windowStartedAt, lockedUntil, updatedAt: new Date(now).toISOString() },
  });
}

export async function clearLoginFailures(request: Request) {
  await getDb().delete(adminAuthAttempts).where(eq(adminAuthAttempts.key, await attemptKey(request)));
}
