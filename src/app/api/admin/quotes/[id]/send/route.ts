import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isProductionHost, isQuoteAdminRequest, preflight, withCors } from "@/lib/intranet-auth";
import { quoteLinkUrl, siteUrlFromRequest } from "@/lib/quote/link";
import { latestRevision, type QuoteRow } from "@/lib/quote/view";
import { markRevisionSent, sendRevisionNotice } from "@/lib/quote/notify-revision";

/**
 * 내부에만 저장해 둔 최신 차수를 나중에 고객에게 보낸다.
 * 새 차수를 만들지 않고, 수정 안내 메일·알림톡을 보낸 뒤 그 차수에 발송 기록을 남긴다.
 */
export function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const json = (body: unknown, status = 200) =>
    withCors(request, NextResponse.json(body, { status }));

  if (!(await isQuoteAdminRequest(request))) {
    return json({ error: "인증이 필요합니다" }, 401);
  }
  if (!supabaseAdmin) {
    return json({ error: "DB 미설정" }, 500);
  }
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return json({ error: "잘못된 요청입니다" }, 400);
  }

  const { data: found, error } = await supabaseAdmin.from("quotes").select("*").eq("id", id).limit(1);
  if (error) {
    return json({ error: error.message }, 500);
  }
  const row = (found?.[0] ?? null) as (QuoteRow & { phone: string; email: string }) | null;
  if (!row) {
    return json({ error: "견적을 찾을 수 없습니다" }, 404);
  }
  const revision = latestRevision(row);
  if (!revision) {
    return json({ error: "보낼 수정 견적이 없습니다. 견적을 먼저 저장해 주세요." }, 400);
  }
  if (!isProductionHost(request) && !(row.event_name || "").trim().toUpperCase().startsWith("[TEST]")) {
    return json(
      { error: "개발 주소에서는 [TEST] 시험 접수에만 고객 알림을 보낼 수 있습니다." },
      409
    );
  }
  const link = quoteLinkUrl(siteUrlFromRequest(request), row.quote_number);
  if (!link) {
    return json({ error: "견적 바로보기 주소를 만들 수 없어 보내지 못했습니다." }, 500);
  }

  const notified = await sendRevisionNotice(row, revision, link);
  const sent = await markRevisionSent(supabaseAdmin, id, revision.rev, notified);
  return json({ success: notified.email || notified.alimtalk, rev: revision.rev, notified, sent });
}
