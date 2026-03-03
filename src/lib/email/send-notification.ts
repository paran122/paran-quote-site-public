import { sendEmail, RESEND_API_KEY, FROM_EMAIL, ADMIN_EMAIL } from "./resend";
import { adminNotifySubject, adminNotifyHtml } from "./templates/admin-notify";
import {
  customerConfirmSubject,
  customerConfirmHtml,
} from "./templates/customer-confirm";
import type { QuoteEmailData } from "./templates/types";

export type { QuoteEmailData };

/**
 * 관리자 + 고객에게 이메일 발송 (각각 독립적으로 실행, 하나가 실패해도 다른 건 발송)
 * Resend API 키가 없으면 skip.
 */
export async function sendQuoteNotification(
  data: QuoteEmailData
): Promise<{ admin: boolean; customer: boolean }> {
  if (!RESEND_API_KEY) {
    console.warn(
      "[email] RESEND_API_KEY not configured. Skipping email notification."
    );
    return { admin: false, customer: false };
  }

  const results = { admin: false, customer: false };

  // 관리자 알림
  try {
    const result = await sendEmail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: adminNotifySubject(data),
      html: adminNotifyHtml(data),
    });
    results.admin = result.success;
  } catch (err) {
    console.error("[email] Failed to send admin notification:", err);
  }

  // 고객 확인 메일
  try {
    const result = await sendEmail({
      from: FROM_EMAIL,
      to: data.email,
      subject: customerConfirmSubject(data),
      html: customerConfirmHtml(data),
    });
    results.customer = result.success;
  } catch (err) {
    console.error("[email] Failed to send customer confirmation:", err);
  }

  return results;
}
