import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { quoteLinkUrl, siteUrlFromRequest, verifyQuoteLinkKey } from "@/lib/quote/link";
import { toPublicQuote, type QuoteRow } from "@/lib/quote/view";
import { cleanName, decide, loadAccepted, recordAccepted } from "@/lib/quote/accepted";
import { notifyStaffAccepted } from "@/lib/quote/notify-staff";

// 견적 바로보기 화면(/q/<키>)의 '이 견적으로 진행' 버튼이 부르는 승인.
// 키의 서명이 맞고, 고객이 보고 있던 차수가 지금 차수와 같을 때만 받는다.
// 승인은 내부 메모 한 줄로 남고 담당자에게 메일로 알린다. 견적 상태(접수대기·진행중)는 바꾸지 않는다.

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;

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

const fail = (error: string, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error, ...extra }, { status, headers: { "Cache-Control": "no-store" } });

const NOT_FOUND = "견적을 찾을 수 없습니다. 주소를 다시 확인해 주세요.";
const UNAVAILABLE = "지금은 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) return fail("너무 많은 요청입니다. 잠시 후 다시 시도해주세요.", 429);

  let body: { key?: unknown; name?: unknown; rev?: unknown } | null;
  try {
    body = await request.json();
  } catch {
    return fail("요청 형식이 올바르지 않습니다.", 400);
  }
  const quoteNumber = verifyQuoteLinkKey(body?.key);
  if (!quoteNumber) return fail(NOT_FOUND, 404);
  const name = cleanName(body?.name);
  if (name.length < 2) return fail("승인하시는 분의 이름을 입력해 주세요.", 400);
  if (!supabaseAdmin) return fail(UNAVAILABLE, 503);

  const { data, error } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("quote_number", quoteNumber)
    .order("created_at", { ascending: true })
    .limit(2);
  if (error) {
    console.error("[quote-accept] load failed:", error.message);
    return fail(UNAVAILABLE, 503);
  }
  // 번호가 겹친 예전 접수는 조회와 마찬가지로 받지 않는다
  if ((data?.length ?? 0) !== 1) return fail(NOT_FOUND, 404);
  const row = data![0] as QuoteRow;

  const base = toPublicQuote(row);
  const before = decide(row, base, await loadAccepted(row.id));

  // 고객이 보고 있던 차수와 지금 차수가 다르면(그 사이 담당자가 고침) 승인하지 않고 새 견적을 보여 준다
  if (typeof body?.rev !== "number" || body.rev !== base.rev) {
    return fail("그 사이 견적이 바뀌었습니다. 바뀐 견적을 확인한 뒤 다시 눌러 주세요.", 409, {
      quote: { ...base, ...before },
    });
  }
  if (before.accepted) {
    // 이미 승인된 차수: 다시 기록하지 않고 지금 상태를 돌려준다(두 번 누름)
    return NextResponse.json({ quote: { ...base, ...before } }, { headers: { "Cache-Control": "no-store" } });
  }
  if (!before.canAccept) {
    return fail(
      before.expired
        ? "견적 유효기간이 지났습니다. 02-6342-2800으로 문의해 주세요."
        : "지금은 이 견적을 승인할 수 없습니다. 02-6342-2800으로 문의해 주세요.",
      409,
      { quote: { ...base, ...before } }
    );
  }

  const accepted = {
    rev: base.rev,
    name,
    at: new Date().toISOString(),
    total: base.totals?.total ?? 0,
  };
  if (!(await recordAccepted(row.id, accepted))) return fail(UNAVAILABLE, 503);

  await notifyStaffAccepted({
    eventName: row.event_name,
    quoteNumber: row.quote_number,
    organization: row.organization,
    contactName: row.contact_name,
    rev: base.rev,
    total: accepted.total,
    linkUrl: quoteLinkUrl(siteUrlFromRequest(request), row.quote_number),
    acceptedBy: name,
    at: accepted.at,
  });

  return NextResponse.json(
    { quote: { ...base, ...decide(row, base, accepted) } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
