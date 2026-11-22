import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { STATUS_REASON_MARK, isQuoteAdminRequest, preflight, withCors } from "@/lib/intranet-auth";
import { quoteLinkKey } from "@/lib/quote/link";
import { editableQuote, originalQuote, toPublicQuote, totalWon, type QuoteRow } from "@/lib/quote/view";
import { loadViewedMap } from "@/lib/quote/viewed";
import { decide, loadAcceptedMap } from "@/lib/quote/accepted";

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function GET(request: NextRequest) {
  const authed = await isQuoteAdminRequest(request);
  if (!authed) {
    return withCors(request, NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 }));
  }
  // 관리자 조회는 서버 전용 키로 읽는다. 공개 키의 읽기 권한을 나중에 막아도 이 화면은 그대로 동작한다.
  const db = supabaseAdmin ?? supabase;
  if (!db) {
    return withCors(request, NextResponse.json([]));
  }

  const { data, error } = await db
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return withCors(request, NextResponse.json({ error: error.message }, { status: 500 }));
  }

  // 상태를 바꾼 이유(내부 메모 표에 표시를 붙여 남긴 것). 못 읽어도 목록은 그대로 준다.
  const reasons = new Map<string, string>();
  try {
    const { data: marks } = await db
      .from("quote_notes")
      .select("quote_id, content, created_at")
      .like("content", `${STATUS_REASON_MARK}%`)
      .order("created_at", { ascending: true });
    for (const m of (marks ?? []) as Array<{ quote_id: string; content: string }>) {
      const text = m.content.slice(STATUS_REASON_MARK.length);
      const cut = text.indexOf(": ");
      reasons.set(m.quote_id, cut >= 0 ? text.slice(cut + 2) : text);
    }
  } catch {
    /* 메모 표를 못 읽으면 이유 없이 준다 */
  }

  // 고객이 견적 링크를 열어 본 기록
  const viewedMap = await loadViewedMap();
  // 고객이 '이 견적으로 진행'을 누른 기록(가장 최근 것)
  const acceptedMap = await loadAcceptedMap();

  // 고객에게 보내는 견적 바로보기 주소(사이트 주소를 뺀 경로)
  const seen = new Map<string, number>();
  for (const row of (data ?? []) as Array<{ quote_number?: string }>) {
    if (row.quote_number) seen.set(row.quote_number, (seen.get(row.quote_number) ?? 0) + 1);
  }
  const rows = (data ?? []).map((row: { quote_number?: string }) => {
    // 번호가 겹친 예전 접수는 링크를 만들지 않는다(조회도 거절함)
    const unique = row.quote_number ? seen.get(row.quote_number) === 1 : false;
    const linkKey = unique && row.quote_number ? quoteLinkKey(row.quote_number) : null;
    // 금액·수정 화면 첫 값·고객 화면 모양은 여기서 계산해 준다(인트라넷이 계산식을 따로 갖지 않게).
    // 한 건이 깨져 있어도 목록 전체가 막히지 않도록 그 건만 비우고 이유를 적는다.
    let total_won: number | null = null;
    let editable: ReturnType<typeof editableQuote> | null = null;
    let view: ReturnType<typeof toPublicQuote> | null = null;
    let original: ReturnType<typeof originalQuote> | null = null;
    let view_error: string | null = null;
    // 승인 기록 + 지금 차수에도 유효한지(견적을 고치면 지난 승인은 무효) + 유효기간
    const acceptedRow = acceptedMap.get((row as { id?: string }).id ?? "") ?? null;
    let accepted: (typeof acceptedRow & { current: boolean }) | null = null;
    let valid_until: string | null = null;
    let expired = false;
    try {
      const full = row as unknown as QuoteRow;
      total_won = totalWon(full);
      editable = editableQuote(full);
      view = toPublicQuote(full);
      original = originalQuote(full);
      const decision = decide(full, view, acceptedRow);
      accepted = acceptedRow ? { ...acceptedRow, current: !!decision.accepted } : null;
      valid_until = decision.validUntil;
      expired = decision.expired;
    } catch (e) {
      editable = null;
      view = null;
      original = null;
      view_error = e instanceof Error ? e.message : String(e);
    }
    return {
      ...row,
      link_path: linkKey ? `/q/${linkKey}` : null,
      status_reason: reasons.get((row as { id?: string }).id ?? "") ?? null,
      viewed: viewedMap.get((row as { id?: string }).id ?? "") ?? null,
      accepted,
      valid_until,
      expired,
      total_won,
      editable,
      view,
      original,
      view_error,
      // 2 = 이 응답에 계산값(total_won·editable·view·original)이 있고, PUT 이 dryRun 을 안다
      api_version: 2,
    };
  });

  return withCors(request, NextResponse.json(rows));
}
