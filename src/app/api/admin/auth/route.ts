import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/admin-auth";

// 로그인 브루트포스 방지
const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15분

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const attempt = loginAttempts.get(ip);
    if (attempt && Date.now() < attempt.blockedUntil) {
      return NextResponse.json(
        { error: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요." },
        { status: 429 },
      );
    }

    const { password } = (await request.json()) as { password: string };

    if (!password || !verifyPassword(password)) {
      const current = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };
      current.count++;
      if (current.count >= MAX_ATTEMPTS) {
        current.blockedUntil = Date.now() + BLOCK_DURATION;
      }
      loginAttempts.set(ip, current);
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다" },
        { status: 401 },
      );
    }

    // 로그인 성공 시 카운터 리셋
    loginAttempts.delete(ip);

    const token = await createSessionToken();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "로그인 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
