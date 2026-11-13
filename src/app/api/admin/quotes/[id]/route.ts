import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";
import { quoteLinkUrl, siteUrlFromRequest } from "@/lib/quote/link";
import {
  computeTotals,
  manFromWon,
  readRevisions,
  type QuoteRevision,
  type QuoteRow,
} from "@/lib/quote/view";
import { sendEmail, RESEND_API_KEY, FROM_EMAIL } from "@/lib/email/resend";
import { quoteUpdatedHtml, quoteUpdatedSubject } from "@/lib/email/templates/quote-updated";
import { sendQuoteUpdatedAlimtalk } from "@/lib/alimtalk";

export async function PATCH(
  request: NextRequest,
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
  const body = await request.json();
  const status = body.status as string;

  const VALID_STATUSES = ["접수대기", "진행중", "완료", "취소"];
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "유효하지 않은 상태입니다" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("quotes")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
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
      })
    )
    .min(1)
    .max(MAX_LINES),
  ship: z.number().int().min(0).max(100_000_000),
  notice: z.string().trim().max(2000),
  notify: z.boolean(),
});

const MISSING_COLUMN_MESSAGE =
  "DB에 견적 이력 칸(revisions)이 아직 없습니다. 안내된 SQL을 먼저 실행해 주세요.";

export async function PUT(
  request: NextRequest,
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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다" }, { status: 400 });
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
    return NextResponse.json(
      { error: `입력값을 확인해 주세요: ${where}${field[key] ?? key}` },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const { data: found, error: loadError } = await supabaseAdmin
    .from("quotes")
    .select("*")
    .eq("id", id)
    .limit(1);
  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 500 });
  }
  const row = (found?.[0] ?? null) as (QuoteRow & { phone: string; email: string }) | null;
  if (!row) {
    return NextResponse.json({ error: "견적을 찾을 수 없습니다" }, { status: 404 });
  }
  if (!("revisions" in row)) {
    return NextResponse.json({ error: MISSING_COLUMN_MESSAGE }, { status: 409 });
  }

  const history = readRevisions(row);
  const totals = computeTotals(input.lines, input.ship);
  if (totals.total < 0) {
    return NextResponse.json({ error: "합계가 0원보다 작을 수 없습니다" }, { status: 400 });
  }
  if (totals.total > MAX_TOTAL) {
    return NextResponse.json({ error: "합계가 20억 원을 넘으면 저장할 수 없습니다" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const revision: QuoteRevision = {
    rev: (history.length ? history[history.length - 1].rev : 0) + 1,
    at: now,
    lines: input.lines,
    ship: input.ship,
    notice: input.notice,
    supply: totals.supply,
    vat: totals.vat,
    total: totals.total,
  };

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
    return NextResponse.json(
      { error: missing ? MISSING_COLUMN_MESSAGE : saveError.message },
      { status: missing ? 409 : 500 }
    );
  }

  const link = quoteLinkUrl(siteUrlFromRequest(request), row.quote_number);
  const notified = { email: false, alimtalk: false };
  if (input.notify && link) {
    const [mail, talk] = await Promise.allSettled([
      RESEND_API_KEY
        ? sendEmail({
            from: FROM_EMAIL,
            to: row.email,
            subject: quoteUpdatedSubject({
              contactName: row.contact_name,
              quoteNumber: row.quote_number,
              eventName: row.event_name,
              revision,
              linkUrl: link,
            }),
            html: quoteUpdatedHtml({
              contactName: row.contact_name,
              quoteNumber: row.quote_number,
              eventName: row.event_name,
              revision,
              linkUrl: link,
            }),
          })
        : Promise.resolve({ success: false }),
      sendQuoteUpdatedAlimtalk({
        phone: row.phone,
        contactName: row.contact_name,
        quoteNumber: row.quote_number,
        rev: revision.rev,
        totalAmount: manFromWon(totals.total),
        linkUrl: link,
        eventName: row.event_name,
      }),
    ]);
    notified.email = mail.status === "fulfilled" && mail.value.success;
    notified.alimtalk = talk.status === "fulfilled" && talk.value.success;
  }

  return NextResponse.json({
    success: true,
    revision,
    total_amount: totals.total,
    notified,
  });
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
