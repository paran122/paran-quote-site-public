import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyQuoteLinkKey } from "@/lib/quote/link";
import { toPublicQuote, type QuoteRow } from "@/lib/quote/view";

// 견적 바로보기 링크(/q/<키>)가 부르는 조회.
// 키의 서명이 맞을 때만 그 접수 한 건을, 연락처를 뺀 내용으로 돌려준다.

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const NOT_FOUND = "견적을 찾을 수 없습니다. 주소를 다시 확인해 주세요.";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }
  const linkKey = (body as { key?: unknown } | null)?.key;
  const quoteNumber = verifyQuoteLinkKey(linkKey);
  if (!quoteNumber) {
    return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "지금은 견적을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요." },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("quote_number", quoteNumber)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    console.error("[quote-view] load failed:", error.message);
    return NextResponse.json(
      { error: "지금은 견적을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요." },
      { status: 503 }
    );
  }
  const row = (data?.[0] ?? null) as QuoteRow | null;
  if (!row) {
    return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
  }

  return NextResponse.json(
    { quote: toPublicQuote(row) },
    { headers: { "Cache-Control": "no-store" } }
  );
}
