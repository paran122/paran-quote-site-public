import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = (await request.json()) as { password: string };

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다" },
        { status: 401 },
      );
    }

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
