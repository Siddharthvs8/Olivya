/**
 * Minimal single-admin auth: a password (ADMIN_PASSWORD) plus an HMAC-signed,
 * time-limited session cookie (signed with AUTH_SECRET). No third-party auth
 * service. Uses Web Crypto so it runs in both the Edge middleware and Node.
 */

const SECRET = process.env.AUTH_SECRET || "";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

export const isAuthConfigured = Boolean(SECRET && PASSWORD);
export const SESSION_COOKIE = "oliviya_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return toHex(sig);
}

/** Verify the submitted admin password. */
export function verifyPassword(password: string) {
  return isAuthConfigured && password === PASSWORD;
}

/** `${expiry}.${signature}` — valid for SESSION_MAX_AGE. */
export async function createSessionToken() {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  return `${exp}.${await sign(String(exp))}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token || !SECRET) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return (await sign(expStr)) === sig;
}
