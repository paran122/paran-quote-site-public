import type { QuoteEmailData, CartItemForEmail } from "./types";

function formatKRW(amount: number): string {
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000);
    const man = amount % 10000;
    if (man === 0) return `${eok}억원`;
    return `${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  }
  return `${amount.toLocaleString("ko-KR")}만원`;
}

function buildItemSummary(items: CartItemForEmail[]): string {
  return items
    .map((item) => {
      const qty = item.qty ?? item.quantity ?? 1;
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center">${qty}${item.unit ? item.unit : "개"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right">${formatKRW(item.price * qty)}</td>
      </tr>`;
    })
    .join("");
}

export function customerConfirmSubject(data: QuoteEmailData): string {
  if (data.type === "inquiry") {
    return "[파란컴퍼니] 문의가 접수되었습니다";
  }
  return "[파란컴퍼니] 견적 요청이 접수되었습니다";
}

export function customerConfirmHtml(data: QuoteEmailData): string {
  if (data.type === "inquiry") {
    return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <tr><td style="background:#1d4ed8;padding:28px 32px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">문의가 접수되었습니다</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7">
            ${data.contactName}님, 안녕하세요.<br/>
            파란컴퍼니에 문의해 주셔서 감사합니다.
          </p>
          <div style="padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #1d4ed8;margin-bottom:20px">
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">문의 내용</div>
            <div style="font-size:14px;color:#334155;line-height:1.6;white-space:pre-wrap">${data.memo || "-"}</div>
          </div>
          <p style="margin:0;font-size:14px;color:#64748b;line-height:1.7">
            확인 후 빠른 시일 내에 회신 드리겠습니다.<br/>
            급한 건은 전화(02-6342-2801)로 연락 주시면 더 빠르게 도움드릴 수 있습니다.
          </p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:600">파란컴퍼니</p>
          <p style="margin:0;font-size:12px;color:#94a3b8">02-6342-2801 / info@parancompany.co.kr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  // 견적 접수 확인
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <tr><td style="background:#1d4ed8;padding:28px 32px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">견적 요청이 접수되었습니다</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7">
            ${data.contactName}님, 안녕하세요.<br/>
            파란컴퍼니에 견적을 요청해 주셔서 감사합니다.
          </p>

          <div style="padding:16px 20px;background:#eff6ff;border-radius:8px;margin-bottom:24px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#64748b">견적 번호</td>
                <td style="font-size:15px;color:#1d4ed8;font-weight:700;text-align:right">${data.quoteNumber}</td>
              </tr>
            </table>
          </div>

          ${data.cartItems.length > 0 ? `
          <h3 style="margin:0 0 12px;font-size:14px;color:#1e293b;font-weight:700">요청 항목</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px">
            <tr style="background:#f8fafc">
              <th style="padding:8px 12px;font-size:12px;color:#64748b;text-align:left;font-weight:600">항목</th>
              <th style="padding:8px 12px;font-size:12px;color:#64748b;text-align:center;font-weight:600">수량</th>
              <th style="padding:8px 12px;font-size:12px;color:#64748b;text-align:right;font-weight:600">금액</th>
            </tr>
            ${buildItemSummary(data.cartItems)}
          </table>
          <div style="text-align:right;margin-bottom:24px">
            <span style="font-size:13px;color:#64748b">총 금액: </span>
            <span style="font-size:18px;color:#1d4ed8;font-weight:800">${formatKRW(data.totalAmount)}</span>
          </div>` : ""}

          <div style="padding:20px;background:#f8fafc;border-radius:8px;text-align:center">
            <p style="margin:0 0 8px;font-size:15px;color:#1e293b;font-weight:600">1영업일 이내 담당자가 연락드리겠습니다</p>
            <p style="margin:0;font-size:13px;color:#64748b">
              급한 건은 전화(02-6342-2801)로 연락 주시면<br/>더 빠르게 도움드릴 수 있습니다.
            </p>
          </div>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-weight:600">파란컴퍼니</p>
          <p style="margin:0;font-size:12px;color:#94a3b8">02-6342-2801 / info@parancompany.co.kr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
