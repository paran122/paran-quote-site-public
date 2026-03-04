import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

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

    if (signature !== expectedSig) return false;

    const parsed = JSON.parse(payload) as { iat: number };
    const age = Date.now() - parsed.iat;
    if (age > 24 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
