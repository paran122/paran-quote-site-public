import type { SupabaseClient } from "@supabase/supabase-js";
import { manFromWon, readRevisions, type QuoteRevision, type QuoteRow } from "@/lib/quote/view";
import { sendEmail, RESEND_API_KEY, FROM_EMAIL } from "@/lib/email/resend";
import { quoteUpdatedHtml, quoteUpdatedSubject } from "@/lib/email/templates/quote-updated";
import { sendQuoteUpdatedAlimtalk } from "@/lib/alimtalk";

/** 고객에게 실제로 나간 알림 기록. 내부용이며 고객 화면·메일에는 내보내지 않는다. */
export interface RevisionSent {
  at: string;
  email: boolean;
  alimtalk: boolean;
}

type NotifyRow = QuoteRow & { phone: string; email: string };

/** 고친 견적 안내(메일 + 알림톡)를 보낸다. 어느 쪽이 나갔는지 돌려준다. */
export async function sendRevisionNotice(
  row: NotifyRow,
  revision: QuoteRevision,
  link: string
): Promise<{ email: boolean; alimtalk: boolean }> {
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
      totalAmount: manFromWon(revision.total),
      linkUrl: link,
      eventName: row.event_name,
    }),
  ]);
  return {
    email: mail.status === "fulfilled" && mail.value.success,
    alimtalk: talk.status === "fulfilled" && talk.value.success,
  };
}

/**
 * 알림이 하나라도 나갔으면 그 차수에 발송 기록(sent)을 남긴다.
 * 그 사이 다른 차수가 저장됐을 수 있어 이력을 다시 읽어 해당 차수만 고친다.
 * 기록에 실패해도 알림은 이미 나갔으므로 오류로 올리지 않는다.
 */
export async function markRevisionSent(
  db: SupabaseClient<any, any, any>,
  id: string,
  rev: number,
  notified: { email: boolean; alimtalk: boolean }
): Promise<RevisionSent | null> {
  if (!notified.email && !notified.alimtalk) return null;
  const sent: RevisionSent = { at: new Date().toISOString(), ...notified };
  try {
    const { data } = await db.from("quotes").select("revisions").eq("id", id).limit(1);
    const history = readRevisions((data?.[0] ?? { revisions: null }) as Pick<QuoteRow, "revisions">);
    if (!history.some((r) => r.rev === rev)) return sent;
    await db
      .from("quotes")
      .update({ revisions: history.map((r) => (r.rev === rev ? { ...r, sent } : r)) })
      .eq("id", id);
  } catch (e) {
    console.error("[quote] sent 기록 실패:", e);
  }
  return sent;
}
