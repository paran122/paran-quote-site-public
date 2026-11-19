import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";

/**
 * 인트라넷(다른 주소)에서 견적 관리 API를 부를 때의 두 번째 인증 경로.
 *
 * 사이트 관리 화면은 지금처럼 admin_session 쿠키로 들어온다.
 * 인트라넷은 같은 Supabase 로그인을 쓰므로, 로그인 토큰을
 * `Authorization: Bearer <access token>` 으로 보내면 서버가
 *   1) Supabase 에 물어 토큰이 진짜인지 확인하고
 *   2) 인트라넷 profiles 표에서 총괄관리자(role = admin)이며 사용 중인 계정인지 확인한다.
 * 둘 중 하나라도 아니면 거절한다.
 */

/** 인트라넷 운영 주소와 브랜치 미리보기 주소, 그리고 로컬 개발 주소 */
const INTRANET_ORIGIN =
  /^(https:\/\/([a-z0-9-]+--)?paranintranet\.netlify\.app|http:\/\/(localhost|127\.0\.0\.1)(:\d{2,5})?)$/;

export function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  return origin && INTRANET_ORIGIN.test(origin) ? origin : null;
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+([A-Za-z0-9._-]{20,4096})$/.exec(header);
  return match ? match[1] : null;
}

async function isIntranetAdmin(token: string): Promise<boolean> {
  if (!supabase || !supabaseAdmin) return false;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    const userId = data?.user?.id;
    if (error || !userId) return false;
    const { data: rows, error: profileError } = await supabaseAdmin
      .schema("public")
      .from("profiles")
      .select("role, is_active")
      .eq("id", userId)
      .limit(1);
    if (profileError) return false;
    const profile = (rows?.[0] ?? null) as { role?: string; is_active?: boolean | null } | null;
    return !!profile && profile.role === "admin" && profile.is_active !== false;
  } catch {
    return false;
  }
}

/** 사이트 관리자 쿠키이거나, 인트라넷 총괄관리자의 로그인 토큰이면 통과 */
export async function isQuoteAdminRequest(request: Request): Promise<boolean> {
  const token = bearerToken(request);
  if (token) return isIntranetAdmin(token);
  return isAuthenticated();
}

/** 허용한 주소에서 온 요청에만 CORS 머리글을 붙인다 */
export function withCors<T extends NextResponse>(request: Request, response: T): T {
  const origin = allowedOrigin(request);
  response.headers.append("Vary", "Origin");
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    response.headers.set("Access-Control-Max-Age", "600");
  }
  return response;
}

/** 브라우저가 먼저 보내는 확인 요청(OPTIONS) 응답 */
export function preflight(request: Request): NextResponse {
  const status = allowedOrigin(request) ? 204 : 403;
  return withCors(request, new NextResponse(null, { status }));
}

/** 운영 주소가 아닌 곳(개발·미리보기)에서는 시험 접수에만 고객 알림을 보낸다 */
export function isProductionHost(request: Request): boolean {
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];
  return host === "parancompany.co.kr" || host === "www.parancompany.co.kr";
}
