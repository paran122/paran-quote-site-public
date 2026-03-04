import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24; // 24시간

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not set");
  return secret;
}

function getPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD not set");
  return pw;
}

/** HMAC-SHA256 서명 생성 (Web Crypto API) */
async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const bytes = new Uint8Array(sig);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** 세션 토큰 생성 */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const payload = JSON.stringify({ role: "admin", iat: Date.now() });
  const signature = await sign(payload, secret);
  const token = btoa(payload) + "." + signature;
  return token;
}

/** 세션 토큰 검증 */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSecret();
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    const payload = atob(payloadB64);
    const expectedSig = await sign(payload, secret);
    if (signature !== expectedSig) return false;

    const parsed = JSON.parse(payload) as { iat: number };
    const age = Date.now() - parsed.iat;
    if (age > MAX_AGE * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

/** 비밀번호 확인 */
export function verifyPassword(input: string): boolean {
  const pw = getPassword();
  return input === pw;
}

/** 세션 쿠키 설정 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

/** 세션 쿠키 삭제 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** 현재 세션 검증 (서버 컴포넌트/API용) */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
