import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

interface IndexNowRequestBody {
  urls: string[];
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  if (!INDEXNOW_KEY) {
    return NextResponse.json({ error: "INDEXNOW_KEY가 설정되지 않았습니다" }, { status: 500 });
  }

  try {
    const body = (await request.json()) as IndexNowRequestBody;
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "urls 배열이 필요합니다." },
        { status: 400 }
      );
    }

    if (urls.length > 10000) {
      return NextResponse.json(
        { error: "한 번에 최대 10,000개 URL까지 제출 가능합니다." },
        { status: 400 }
      );
    }

    // 상대 경로를 절대 URL로 변환
    const absoluteUrls = urls.map((url) =>
      url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`
    );

    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: absoluteUrls,
    };

    // IndexNow API에 제출 (Bing 엔드포인트 — Naver, Yandex 등과 자동 공유)
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      submitted: absoluteUrls.length,
      urls: absoluteUrls,
    });
  } catch {
    return NextResponse.json(
      { error: "IndexNow 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "IndexNow",
    configured: !!INDEXNOW_KEY,
    usage:
      'POST /api/indexnow with { "urls": ["/blog/slug", "/work"] }',
  });
}
