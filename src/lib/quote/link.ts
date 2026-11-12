import { createHmac, timingSafeEqual } from "crypto";

// 견적 바로보기 링크.
// 주소는 `/q/<접수번호>.<서명>` 이고, 서명은 서버만 아는 값으로 만든다.
// DB에 따로 저장하지 않으므로 접수번호만 알아서는 주소를 만들 수 없다.

const NUMBER_PATTERN = /^[A-Z]{2}-\d{8}-\d{3,8}$/;
const TOKEN_LENGTH = 32;

function secret(): string {
  return process.env.QUOTE_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function sign(quoteNumber: string, key: string): string {
  return createHmac("sha256", key)
    .update(`quote-link:v1:${quoteNumber}`)
    .digest("base64url")
    .slice(0, TOKEN_LENGTH);
}

/** `<접수번호>.<서명>` — 서버 비밀값이 없으면 null */
export function quoteLinkKey(quoteNumber: string): string | null {
  const key = secret();
  if (!key || !NUMBER_PATTERN.test(quoteNumber)) return null;
  return `${quoteNumber}.${sign(quoteNumber, key)}`;
}

/** 고객에게 보내는 전체 주소 */
export function quoteLinkUrl(siteUrl: string | undefined, quoteNumber: string): string | null {
  const linkKey = quoteLinkKey(quoteNumber);
  if (!siteUrl || !linkKey) return null;
  return `${siteUrl.replace(/\/+$/, "")}/q/${linkKey}`;
}

/** 주소의 키가 맞으면 접수번호를, 아니면 null 을 돌려준다 */
export function verifyQuoteLinkKey(linkKey: unknown): string | null {
  if (typeof linkKey !== "string" || linkKey.length > 80) return null;
  const dot = linkKey.lastIndexOf(".");
  if (dot < 1) return null;
  const quoteNumber = linkKey.slice(0, dot);
  const given = linkKey.slice(dot + 1);
  const key = secret();
  if (!key || !NUMBER_PATTERN.test(quoteNumber) || given.length !== TOKEN_LENGTH) return null;
  const expected = sign(quoteNumber, key);
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return quoteNumber;
}

/** 요청이 들어온 주소(미리보기·운영 어디서든 그 사이트 주소로 링크를 만든다) */
export function siteUrlFromRequest(request: Request): string | undefined {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host || !/^[a-z0-9.-]+(:\d+)?$/i.test(host)) return process.env.NEXT_PUBLIC_SITE_URL;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
