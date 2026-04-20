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

/**
 * 이전 카페24 → 현재 Next.js 사이트 URL 매핑
 *
 * [규칙] 새 페이지가 존재하면 → 301 리다이렉트 (SEO 파워 승계)
 *        대응 페이지 없으면  → 410 Gone (크롤링 중단)
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/about.php":    "/company",
  "/service.php":  "/services",
  "/service2.php": "/services",
  "/contact.php":  "/",         // 홈 문의 섹션으로
  "/index.php":    "/",
  "/portfolio.php": "/work",
};

/** 대응 페이지가 있는 prefix → 301 */
const LEGACY_REDIRECT_PREFIXES: [string, string][] = [
  ["/portfolio", "/work"],    // /portfolio, /portfolio?sca=... → /work
  ["/gallery",   "/work"],    // /gallery → /work
];

/** 대응 페이지 없음 → 410 Gone */
const LEGACY_GONE_PREFIXES = [
  "/bbs/",        // 게시판
  "/qa",          // Q&A
  "/contact",     // /contact.php는 위에서 301, /contact/...는 410
  "/shop",        // 쇼핑
  "/notice",      // 공지사항
  "/theme",       // 테마 경로
  "/type-4",
  "/free",
];

function getLegacyResponse(pathname: string, url: string): NextResponse | null {
  // 1) 정확한 경로 매칭 → 301
  const exactRedirect = LEGACY_REDIRECTS[pathname];
  if (exactRedirect) {
    return NextResponse.redirect(new URL(exactRedirect, url), 301);
  }

  // 2) prefix 매칭 → 301 (대응 페이지 있는 것)
  for (const [prefix, target] of LEGACY_REDIRECT_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/") || pathname.startsWith(prefix + "?")) {
      return NextResponse.redirect(new URL(target, url), 301);
    }
  }

  // 3) 대응 없는 레거시 → 410
  for (const prefix of LEGACY_GONE_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return new NextResponse(null, { status: 410, statusText: "Gone" });
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 이전 카페24 URL → 301 리다이렉트 또는 410 Gone
  const legacyResponse = getLegacyResponse(pathname, request.url);
  if (legacyResponse) return legacyResponse;

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
