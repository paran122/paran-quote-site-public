import {
  sendEmail,
  RESEND_API_KEY,
  FROM_EMAIL,
  ADMIN_EMAIL,
  TEST_ADMIN_EMAIL,
  isTestSubmission,
} from "@/lib/email/resend";
import { escapeHtml } from "@/lib/email/templates/layout";

// 고객이 견적 링크에서 한 일을 담당자에게 알리는 짧은 메일(내부용).
// 시험 접수([TEST])는 단체 메일함 대신 시험용 주소로만 간다.

interface StaffNotice {
  eventName: string;
  quoteNumber: string;
  organization: string;
  contactName: string;
  /** 0 = 접수 때 그대로 */
  rev: number;
  /** 합계(원). 없으면 줄을 뺀다 */
  total?: number | null;
  linkUrl: string | null;
}

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;
const revText = (rev: number) => (rev > 0 ? `${rev}차 견적` : "접수 때 견적");

function html(title: string, lines: Array<[string, string]>, linkUrl: string | null): string {
  const rows = lines
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#64748b;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;color:#0f172a">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  // 직원이 열어 볼 때는 열람 횟수에 섞이지 않게 staff=1 을 붙인다
  const link = linkUrl
    ? `<p style="margin:20px 0 0"><a href="${escapeHtml(linkUrl)}?staff=1" style="color:#1d4ed8">고객이 보는 견적 화면 열기</a></p>`
    : "";
  return `<div style="font-family:'Malgun Gothic',sans-serif;font-size:14px;line-height:1.7;color:#0f172a;max-width:560px"><h2 style="font-size:18px;margin:0 0 14px">${escapeHtml(title)}</h2><table style="border-collapse:collapse">${rows}</table>${link}</div>`;
}

async function send(data: StaffNotice, subject: string, title: string, extra: Array<[string, string]>): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  const lines: Array<[string, string]> = [
    ["접수번호", data.quoteNumber],
    ["행사", data.eventName],
    ["기관·담당자", `${data.organization} · ${data.contactName}`],
    ["견적", revText(data.rev) + (typeof data.total === "number" && data.total > 0 ? ` · 합계 ${won(data.total)}` : "")],
    ...extra,
  ];
  try {
    const result = await sendEmail({
      from: FROM_EMAIL,
      to: isTestSubmission(data.eventName) ? TEST_ADMIN_EMAIL : ADMIN_EMAIL,
      subject,
      html: html(title, lines, data.linkUrl),
    });
    return result.success;
  } catch (e) {
    console.error("[quote] 담당자 알림 실패:", e);
    return false;
  }
}

/** 고객이 '이 견적으로 진행'을 눌렀다 */
export function notifyStaffAccepted(data: StaffNotice & { acceptedBy: string; at: string }): Promise<boolean> {
  return send(
    data,
    `[견적 승인] ${data.organization} · ${data.eventName} (${data.quoteNumber})`,
    "고객이 견적 진행을 요청했습니다",
    [
      ["승인한 사람", data.acceptedBy],
      ["승인 시각", new Date(data.at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })],
    ]
  );
}

/** 고객이 견적 링크를 처음 열어 봤다 */
export function notifyStaffFirstView(data: StaffNotice): Promise<boolean> {
  return send(
    data,
    `[견적 열람] ${data.organization} · ${data.eventName} (${data.quoteNumber})`,
    "고객이 견적을 처음 열어 봤습니다",
    []
  );
}
