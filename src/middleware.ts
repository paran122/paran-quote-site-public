import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

/** 상수 시간 문자열 비교 (타이밍 공격 방지) */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) return false;

    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    const payload = atob(payloadB64);

    // HMAC-SHA256 검증
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
    const expectedSig = btoa(binary);

    if (!constantTimeEqual(signature, expectedSig)) return false;

    const parsed = JSON.parse(payload) as { iat: number };
    const age = Date.now() - parsed.iat;
    if (age > 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

/** 이전 카페24 사이트 URL 패턴 — 410 Gone 반환 (Google 크롤링 중단 유도) */
const LEGACY_PATH_PREFIXES = [
  "/portfolio/",  // /portfolio/44?sca=... (숫자 ID 기반 옛 포트폴리오)
  "/bbs/",        // /bbs/download.php 등 게시판
  "/qa",          // 이전 Q&A
  "/gallery",     // 이전 갤러리
  "/contact",     // 이전 문의
  "/shop",        // 이전 쇼핑
  "/notice",      // 이전 공지사항
  "/theme",       // 이전 테마 경로
  "/type-4",
  "/free",
];
const LEGACY_EXACT_PATHS = [
  "/about.php",
  "/service.php",
  "/service2.php",
  "/contact.php",
  "/portfolio.php",
  "/index.php",
];

function isLegacyUrl(pathname: string): boolean {
  if (LEGACY_EXACT_PATHS.includes(pathname)) return true;
  for (const prefix of LEGACY_PATH_PREFIXES) {
    if (pathname.startsWith(prefix)) return true;
  }
  // /portfolio 정확히 일치 (쿼리 파라미터 포함 접근)
  if (pathname === "/portfolio") return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 이전 카페24 URL → 410 Gone (영구 삭제됨)
  if (isLegacyUrl(pathname)) {
    return new NextResponse(null, { status: 410, statusText: "Gone" });
  }

  // /admin/login은 인증 불필요
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // /admin/* 및 /api/admin/* 경로 보호
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // /api/admin/auth는 로그인 API이므로 통과
    if (pathname === "/api/admin/auth") {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifyToken(token))) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    // 이전 카페24 URL → 410 Gone
    "/portfolio/:path*",
    "/bbs/:path*",
    "/qa/:path*",
    "/gallery/:path*",
    "/contact/:path*",
    "/shop/:path*",
    "/notice/:path*",
    "/theme/:path*",
    "/type-4/:path*",
    "/free/:path*",
    "/about.php",
    "/service.php",
    "/service2.php",
    "/contact.php",
    "/portfolio.php",
    "/index.php",
  ],
};
