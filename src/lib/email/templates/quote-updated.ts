import type { QuoteRevision } from "../../quote/view";

// 담당자가 견적을 고친 뒤 고객에게 보내는 메일.

export interface QuoteUpdatedEmailData {
  contactName: string;
  quoteNumber: string;
  eventName: string;
  revision: QuoteRevision;
  linkUrl: string;
}

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function quoteUpdatedSubject(data: QuoteUpdatedEmailData): string {
  return `[파란컴퍼니] 견적이 수정되었습니다 (${data.revision.rev}차)`;
}

export function quoteUpdatedHtml(data: QuoteUpdatedEmailData): string {
  const r = data.revision;
  const rows = r.lines
    .map(
      (line) => `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">${escapeHtml(line.name)}${line.detail ? `<div style="font-size:12px;color:#94a3b8;margin-top:2px">${escapeHtml(line.detail)}</div>` : ""}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;white-space:nowrap">${line.qty}${escapeHtml(line.unit)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right;white-space:nowrap">${won(line.unitPrice * line.qty)}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <tr><td style="background:#1d4ed8;padding:28px 32px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">견적이 수정되었습니다</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7">
            ${escapeHtml(data.contactName)}님, 안녕하세요.<br/>
            상담 내용을 반영해 견적을 수정했습니다.
          </p>

          <div style="padding:16px 20px;background:#eff6ff;border-radius:8px;margin-bottom:24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#64748b">견적 번호</td>
                <td style="font-size:15px;color:#1d4ed8;font-weight:700;text-align:right">${escapeHtml(data.quoteNumber)} · ${r.rev}차</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#64748b;padding-top:6px">행사·작업명</td>
                <td style="font-size:14px;color:#334155;text-align:right;padding-top:6px">${escapeHtml(data.eventName)}</td>
              </tr>
            </table>
          </div>

          ${r.notice ? `
          <div style="padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #1d4ed8;margin-bottom:24px">
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">담당자 안내</div>
            <div style="font-size:14px;color:#334155;line-height:1.6;white-space:pre-wrap">${escapeHtml(r.notice)}</div>
          </div>` : ""}

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px">
            <tr style="background:#f8fafc">
              <th style="padding:8px 12px;font-size:12px;color:#64748b;text-align:left;font-weight:600">항목</th>
              <th style="padding:8px 12px;font-size:12px;color:#64748b;text-align:center;font-weight:600">수량</th>
              <th style="padding:8px 12px;font-size:12px;color:#64748b;text-align:right;font-weight:600">금액(공급가)</th>
            </tr>
            ${rows}
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <tr><td style="font-size:13px;color:#64748b;padding:2px 0">공급가</td><td style="font-size:14px;color:#334155;text-align:right">${won(r.supply)}</td></tr>
            <tr><td style="font-size:13px;color:#64748b;padding:2px 0">부가세 10%</td><td style="font-size:14px;color:#334155;text-align:right">${won(r.vat)}</td></tr>
            ${r.ship ? `<tr><td style="font-size:13px;color:#64748b;padding:2px 0">배송비 (실비)</td><td style="font-size:14px;color:#334155;text-align:right">${won(r.ship)}</td></tr>` : ""}
            <tr><td style="font-size:14px;color:#1e293b;font-weight:700;padding-top:8px">합계 (부가세 포함)</td><td style="font-size:18px;color:#1d4ed8;font-weight:800;text-align:right;padding-top:8px">${won(r.total)}</td></tr>
          </table>

          <div style="text-align:center;margin:0 0 24px">
            <a href="${data.linkUrl}" style="display:inline-block;padding:14px 28px;background:#1d4ed8;color:#fff;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px">견적 바로보기</a>
          </div>

          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;text-align:center">
            궁금한 점은 전화(02-6342-2800)로 연락 주세요.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:600">파란컴퍼니</p>
          <p style="margin:0;font-size:12px;color:#94a3b8">02-6342-2800 / info@parancompany.co.kr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
