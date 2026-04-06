import type { QuoteEmailData, CartItemForEmail, EmailAttachment } from "./types";

function formatKRW(amount: number): string {
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000);
    const man = amount % 10000;
    if (man === 0) return `${eok}억원`;
    return `${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  }
  return `${amount.toLocaleString("ko-KR")}만원`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function isImageType(type: string): boolean {
  return type.startsWith("image/");
}

function fileIcon(type: string): string {
  if (isImageType(type)) return "🖼";
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("excel") || type.includes("spreadsheet")) return "📊";
  if (type.includes("powerpoint") || type.includes("presentation")) return "📑";
  return "📎";
}

function buildAttachmentSection(attachments: EmailAttachment[]): string {
  if (!attachments || attachments.length === 0) return "";

  const imageFiles = attachments.filter((a) => isImageType(a.type));
  const docFiles = attachments.filter((a) => !isImageType(a.type));

  let html = `
          <div style="margin:20px 0 0">
            <h2 style="margin:0 0 12px;font-size:15px;color:#1d4ed8;font-weight:700">첨부 파일 (${attachments.length}개)</h2>`;

  // 이미지 미리보기
  if (imageFiles.length > 0) {
    html += `<div style="margin-bottom:12px">`;
    for (const img of imageFiles) {
      const isSignedUrl = img.url.startsWith("http");
      html += `
            <div style="margin-bottom:8px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
              ${isSignedUrl ? `<img src="${img.url}" alt="${img.name}" style="max-width:100%;max-height:300px;display:block" />` : ""}
              <div style="padding:8px 12px;background:#f8fafc;display:flex;align-items:center">
                <span style="font-size:13px;color:#334155">${img.name}</span>
                <span style="font-size:12px;color:#94a3b8;margin-left:8px">${formatFileSize(img.size)}</span>
                ${isSignedUrl ? `<a href="${img.url}" style="margin-left:auto;font-size:12px;color:#1d4ed8;text-decoration:none;font-weight:600">다운로드</a>` : ""}
              </div>
            </div>`;
    }
    html += `</div>`;
  }

  // 문서 파일 목록
  if (docFiles.length > 0) {
    html += `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">`;
    for (const doc of docFiles) {
      const isSignedUrl = doc.url.startsWith("http");
      html += `
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">
                  ${fileIcon(doc.type)} ${doc.name}
                  <span style="font-size:12px;color:#94a3b8;margin-left:6px">${formatFileSize(doc.size)}</span>
                </td>
                <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:right">
                  ${isSignedUrl ? `<a href="${doc.url}" style="font-size:12px;color:#1d4ed8;text-decoration:none;font-weight:600;background:#eff6ff;padding:4px 10px;border-radius:4px">다운로드</a>` : `<span style="font-size:12px;color:#94a3b8">관리자 페이지에서 확인</span>`}
                </td>
              </tr>`;
    }
    html += `</table>`;
  }

  html += `
            <p style="margin:8px 0 0;font-size:11px;color:#94a3b8">* 다운로드 링크는 7일간 유효합니다. 이후에는 관리자 페이지에서 확인해주세요.</p>
          </div>`;

  return html;
}

function buildItemRows(items: CartItemForEmail[]): string {
  return items
    .map((item) => {
      const qty = item.qty ?? item.quantity ?? 1;
      const subtotal = item.price * qty;
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center">${qty}${item.unit ? item.unit : "개"}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right;font-weight:600">${formatKRW(subtotal)}</td>
        </tr>`;
    })
    .join("");
}

export function adminNotifySubject(data: QuoteEmailData): string {
  const label = data.type === "inquiry" ? "문의 접수" : "견적 접수";
  const org = data.organization && data.organization !== "문의" ? data.organization : "";
  const name = org || data.contactName;
  return `[${label}]-${name}`;
}

export function adminNotifyHtml(data: QuoteEmailData): string {
  if (data.type === "inquiry") {
    return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <tr><td style="background:#1d4ed8;padding:28px 32px">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">새 문의가 접수되었습니다</h1>
          <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px">${data.quoteNumber}</p>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8;width:100px">이름</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b;font-weight:600">${data.contactName}</td>
            </tr>
            ${data.organization && data.organization !== "문의" ? `<tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8">소속</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b;font-weight:600">${data.organization}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8">연락처</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8">이메일</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b">${data.email}</td>
            </tr>
          </table>
          <div style="margin:20px 0 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #1d4ed8">
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">문의 내용</div>
            <div style="font-size:14px;color:#334155;line-height:1.6;white-space:pre-wrap">${data.memo || "-"}</div>
          </div>
          ${data.attachments ? buildAttachmentSection(data.attachments) : ""}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center">파란컴퍼니 / 02-6342-2800 / info@parancompany.co.kr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  // 견적 접수 알림
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <tr><td style="background:#1d4ed8;padding:28px 32px">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">새 견적 요청이 접수되었습니다</h1>
          <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px">${data.quoteNumber}</p>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <h2 style="margin:0 0 16px;font-size:15px;color:#1d4ed8;font-weight:700">담당자 정보</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#94a3b8;width:100px">회사/기관</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b;font-weight:600">${data.organization}</td>
            </tr>
            ${data.department ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a3b8">부서</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${data.department}</td></tr>` : ""}
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#94a3b8">담당자</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b">${data.contactName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#94a3b8">연락처</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#94a3b8">이메일</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b">${data.email}</td>
            </tr>
          </table>

          <h2 style="margin:24px 0 16px;font-size:15px;color:#1d4ed8;font-weight:700">행사 정보</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#94a3b8;width:100px">행사명</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b;font-weight:600">${data.eventName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#94a3b8">행사일</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b">${data.eventDate}</td>
            </tr>
            ${data.eventVenue ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a3b8">장소</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${data.eventVenue}</td></tr>` : ""}
            ${data.eventType ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a3b8">행사 유형</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${data.eventType}</td></tr>` : ""}
            ${data.attendees ? `<tr><td style="padding:6px 0;font-size:13px;color:#94a3b8">예상 인원</td><td style="padding:6px 0;font-size:14px;color:#1e293b">${data.attendees}</td></tr>` : ""}
          </table>

          ${data.cartItems.length > 0 ? `
          <h2 style="margin:24px 0 16px;font-size:15px;color:#1d4ed8;font-weight:700">견적 항목</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <tr style="background:#f8fafc">
              <th style="padding:10px 12px;font-size:12px;color:#64748b;text-align:left;font-weight:600">항목</th>
              <th style="padding:10px 12px;font-size:12px;color:#64748b;text-align:center;font-weight:600">수량</th>
              <th style="padding:10px 12px;font-size:12px;color:#64748b;text-align:right;font-weight:600">금액</th>
            </tr>
            ${buildItemRows(data.cartItems)}
          </table>` : ""}

          ${data.discountAmount && data.discountAmount > 0 ? `
          <div style="margin-top:12px;text-align:right;font-size:14px;color:#ef4444">할인: -${formatKRW(data.discountAmount)}</div>` : ""}

          <div style="margin-top:16px;padding:16px;background:#1d4ed8;border-radius:8px;text-align:right">
            <span style="font-size:13px;color:#bfdbfe">총 금액</span>
            <span style="margin-left:16px;font-size:22px;color:#fff;font-weight:800">${formatKRW(data.totalAmount)}</span>
          </div>

          ${data.memo ? `
          <div style="margin:20px 0 0;padding:16px;background:#f8fafc;border-radius:8px;border-left:3px solid #1d4ed8">
            <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;font-weight:600">메모</div>
            <div style="font-size:14px;color:#334155;line-height:1.6;white-space:pre-wrap">${data.memo}</div>
          </div>` : ""}

          ${data.attachments ? buildAttachmentSection(data.attachments) : ""}
        </td></tr>
        <tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
          <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center">파란컴퍼니 / 02-6342-2800 / info@parancompany.co.kr</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
