import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  STATUS_REASON_MARK,
  isProductionHost,
  isQuoteAdminRequest,
  preflight,
  withCors,
} from "@/lib/intranet-auth";
import { quoteLinkUrl, siteUrlFromRequest } from "@/lib/quote/link";
import {
  computeTotals,
  PROFIT_RATE,
  readRevisions,
  type QuoteRevision,
  type QuoteRow,
} from "@/lib/quote/view";
import { markRevisionSent, sendRevisionNotice, type RevisionSent } from "@/lib/quote/notify-revision";
import { sendEmail, RESEND_API_KEY, FROM_EMAIL } from "@/lib/email/resend";
import { quoteDeclinedHtml, quoteDeclinedSubject } from "@/lib/email/templates/quote-declined";

export function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isQuoteAdminRequest(request);
  if (!authed) {
    return withCors(request, NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 }));
  }
  if (!supabaseAdmin) {
    return withCors(request, NextResponse.json({ error: "DB 미설정" }, { status: 500 }));
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status as string;
  const reasonRaw = typeof body.status_reason === "string" ? body.status_reason.trim() : "";
  if (reasonRaw.length > 200) {
    return withCors(request, NextResponse.json({ error: "이유는 200자 이하로 적어 주세요" }, { status: 400 }));
  }

  const VALID_STATUSES = ["접수대기", "진행중", "완료", "취소"];
  if (!VALID_STATUSES.includes(status)) {
    return withCors(request, NextResponse.json({ error: "유효하지 않은 상태입니다" }, { status: 400 }));
  }

  // 거절 안내(선택): 종료(취소)로 옮기면서 고객에게 사과 메일을 보낸다. 메일이 안 나가면 종료하지 않는다.
  const declineRaw = typeof body.decline_message === "string" ? body.decline_message.trim() : "";
  let declined = false;
  if (declineRaw) {
    const fail = (error: string, code: number) =>
      withCors(request, NextResponse.json({ error }, { status: code }));
    if (status !== "취소") return fail("거절 안내는 종료로 옮길 때만 보낼 수 있습니다", 400);
    if (declineRaw.length > 1000) return fail("안내 글은 1000자 이하로 적어 주세요", 400);
    const { data: found, error: loadError } = await supabaseAdmin
      .from("quotes")
      .select("quote_number, contact_name, event_name, email")
      .eq("id", id)
      .limit(1);
    if (loadError) return fail(loadError.message, 500);
    const target = (found?.[0] ?? null) as
      | { quote_number: string; contact_name: string; event_name: string; email: string | null }
      | null;
    if (!target) return fail("견적을 찾을 수 없습니다", 404);
    if (!isProductionHost(request) && !(target.event_name || "").trim().toUpperCase().startsWith("[TEST]")) {
      return fail("개발 주소에서는 [TEST] 시험 접수에만 고객 알림을 보낼 수 있습니다.", 409);
    }
    if (!target.email) return fail("고객 메일 주소가 없어 안내를 보낼 수 없습니다", 400);
    if (!RESEND_API_KEY) return fail("메일 발송 설정이 없어 안내를 보낼 수 없습니다", 500);
    const data = {
      contactName: target.contact_name,
      quoteNumber: target.quote_number,
      eventName: target.event_name,
      message: declineRaw,
    };
    const mail = await sendEmail({
      from: FROM_EMAIL,
      to: target.email,
      subject: quoteDeclinedSubject(data),
      html: quoteDeclinedHtml(data),
    });
    if (!mail.success) return fail("메일을 보내지 못해 종료하지 않았습니다. 잠시 뒤 다시 해 주세요.", 502);
    declined = true;
  }

  const { error } = await supabaseAdmin
    .from("quotes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return withCors(request, NextResponse.json({ error: error.message }, { status: 500 }));
  }

  // 상태 이유(내부용): 예전 이유는 지우고, 이번에 온 것이 있으면 새로 남긴다. 실패해도 상태 변경은 된 것으로 둔다.
  let status_reason: string | null = null;
  try {
    await supabaseAdmin.from("quote_notes").delete().eq("quote_id", id).like("content", `${STATUS_REASON_MARK}%`);
    // 사과 메일을 보냈으면 이유 뒤에 적어 둔다(내부용)
    const noteText = [reasonRaw, declined ? "고객에게 사과 메일 보냄" : ""].filter(Boolean).join(" · ");
    if (noteText) {
      const { error: noteError } = await supabaseAdmin
        .from("quote_notes")
        .insert({ quote_id: id, content: `${STATUS_REASON_MARK}${status}: ${noteText}` });
      if (!noteError) status_reason = noteText;
    }
  } catch (e) {
    console.error("[quote] 상태 이유 기록 실패:", e);
  }

  return withCors(request, NextResponse.json({ success: true, status_reason, declined }));
}

/* ── 견적 수정: 새 차수를 이력에 덧붙인다 ── */

const MAX_LINES = 60;
const MAX_AMOUNT = 10_000_000_000;
/** 합계 칸(INTEGER)에 들어가는 한도 */
const MAX_TOTAL = 2_000_000_000;
const DETAIL_MAX = 1000;

const RevisionSchema = z.object({
  lines: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        detail: z.string().trim().max(DETAIL_MAX),
        qty: z.number().positive().max(100000),
        unit: z.string().trim().max(10),
        // 할인 줄은 음수 단가로 넣는다
        unitPrice: z.number().int().min(-MAX_AMOUNT).max(MAX_AMOUNT),
        // 금액이 아직 정해지지 않은 줄(상담 후 확정). 0원 줄과 구분해 고객 화면에 글로 보인다.
        tbd: z.boolean().optional(),
      })
    )
    .min(1)
    .max(MAX_LINES),
  ship: z.number().int().min(0).max(100_000_000),
  notice: z.string().trim().max(2000),
  notify: z.boolean(),
  /** 내부용 수정 이유(선택). 고객에게는 보이지 않는다. */
  reason: z.string().trim().max(200).optional(),
  /** true 면 저장도 알림도 하지 않고, 같은 검사와 계산 결과만 돌려준다(수정 중 합계 미리보기) */
  dryRun: z.boolean().optional(),
});

const MISSING_COLUMN_MESSAGE =
  "DB에 견적 이력 칸(revisions)이 아직 없습니다. 안내된 SQL을 먼저 실행해 주세요.";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isQuoteAdminRequest(request);
  if (!authed) {
    return withCors(request, NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 }));
  }
  if (!supabaseAdmin) {
    return withCors(request, NextResponse.json({ error: "DB 미설정" }, { status: 500 }));
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withCors(request, NextResponse.json({ error: "요청 형식이 올바르지 않습니다" }, { status: 400 }));
  }
  const parsed = RevisionSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const where =
      issue && issue.path[0] === "lines" && typeof issue.path[1] === "number"
        ? `${issue.path[1] + 1}번 줄 `
        : "";
    const field: Record<string, string> = {
      name: "품목명(1~120자)",
      detail: `규격·내용(${DETAIL_MAX}자 이하)`,
      qty: "수량(0보다 큰 수)",
      unit: "단위(10자 이하)",
      unitPrice: "단가(원 단위 정수)",
    };
    const key = String(issue?.path[issue.path.length - 1] ?? "");
    return withCors(request, NextResponse.json(
      { error: `입력값을 확인해 주세요: ${where}${field[key] ?? key}` },
      { status: 400 }
    ));
  }
  const input = {
    ...parsed.data,
    lines: parsed.data.lines.map(({ tbd, ...line }) =>
      tbd && line.unitPrice === 0 ? { ...line, tbd: true } : line
    ),
  };

  const notifyBlocked = (eventName: string) =>
    input.notify && !input.dryRun && !isProductionHost(request) && !eventName.trim().toUpperCase().startsWith("[TEST]");

  const { data: found, error: loadError } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("id", id)
    .limit(1);
  if (loadError) {
    return withCors(request, NextResponse.json({ error: loadError.message }, { status: 500 }));
  }
  const row = (found?.[0] ?? null) as (QuoteRow & { phone: string; email: string }) | null;
  if (!row) {
    return withCors(request, NextResponse.json({ error: "견적을 찾을 수 없습니다" }, { status: 404 }));
  }
  if (notifyBlocked(row.event_name || "")) {
    return withCors(request, NextResponse.json(
      { error: "개발 주소에서는 [TEST] 시험 접수에만 고객 알림을 보낼 수 있습니다. 알림을 끄고 저장하거나 운영 주소에서 진행해 주세요." },
      { status: 409 }
    ));
  }
  if (!("revisions" in row)) {
    return withCors(request, NextResponse.json({ error: MISSING_COLUMN_MESSAGE }, { status: 409 }));
  }

  const history = readRevisions(row);
  const totals = computeTotals(input.lines, input.ship, PROFIT_RATE);
  if (totals.total < 0) {
    return withCors(request, NextResponse.json({ error: "합계가 0원보다 작을 수 없습니다" }, { status: 400 }));
  }
  if (totals.total > MAX_TOTAL) {
    return withCors(request, NextResponse.json({ error: "합계가 20억 원을 넘으면 저장할 수 없습니다" }, { status: 400 }));
  }
  const now = new Date().toISOString();
  const revision: QuoteRevision = {
    rev: (history.length ? history[history.length - 1].rev : 0) + 1,
    at: now,
    lines: input.lines,
    ship: input.ship,
    notice: input.notice,
    ...(input.reason ? { reason: input.reason } : {}),
    supply: totals.supply,
    profit: totals.profit ?? 0,
    vat: totals.vat,
    total: totals.total,
  };

  // 응답에만 줄 금액을 붙인다(합계 계산과 같은 식). 저장되는 이력 모양은 그대로.
  const revisionOut = {
    ...revision,
    lines: revision.lines.map((line) => ({ ...line, amount: Math.round(line.unitPrice * line.qty) })),
  };
  if (input.dryRun) {
    return withCors(request, NextResponse.json({
      success: true,
      dryRun: true,
      revision: revisionOut,
      total_amount: totals.total,
    }));
  }

  const { error: saveError } = await supabaseAdmin
    .from("quotes")
    .update({
      revisions: [...history, revision],
      // 합계 칸은 정수. 고친 견적은 원 단위로 저장한다(읽을 때 totalWon 이 구분)
      total_amount: totals.total,
      updated_at: now,
    })
    .eq("id", id);
  if (saveError) {
    const missing = /revisions/i.test(saveError.message);
    return withCors(request, NextResponse.json(
      { error: missing ? MISSING_COLUMN_MESSAGE : saveError.message },
      { status: missing ? 409 : 500 }
    ));
  }

  const link = quoteLinkUrl(siteUrlFromRequest(request), row.quote_number);
  let notified = { email: false, alimtalk: false };
  let sent: RevisionSent | null = null;
  if (input.notify && link) {
    notified = await sendRevisionNotice(row, revision, link);
    // 실제로 나간 알림만 그 차수에 기록한다(내부용)
    sent = await markRevisionSent(id, revision.rev, notified);
  }

  return withCors(request, NextResponse.json({
    success: true,
    revision: sent ? { ...revisionOut, sent } : revisionOut,
    total_amount: totals.total,
    notified,
  }));
}

/* ── 견적 삭제: 시험 접수·잘못 들어온 접수를 지운다. 되돌릴 수 없다. ── */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "DB 미설정" }, { status: 500 });
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }

  // 내부 메모를 먼저 지운다(견적에 딸린 기록)
  const { error: notesError } = await supabaseAdmin.from("quote_notes").delete().eq("quote_id", id);
  if (notesError) {
    return NextResponse.json({ error: notesError.message }, { status: 500 });
  }
  const { data, error } = await supabaseAdmin.from("quotes").delete().eq("id", id).select("id");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "이미 삭제됐거나 없는 견적입니다" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
