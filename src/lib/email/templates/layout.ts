// 고객에게 보내는 메일의 공통 짜임 (2026-11-13).
// 견적서처럼: 흰 바탕, 굵은 선과 가는 선으로만 나누고 카드·그림자·색 띠를 쓰지 않는다.
// 사이트 포인트 색(라임)은 합계와 버튼 두 곳에만 쓴다.
// 메일 프로그램에서 깨지지 않게 표와 인라인 스타일만 쓴다.

const FONT =
  "'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif";
const INK = "#15141a";
const MUTED = "#5b5866";
const LINE = "#e4e3e8";
const LIME = "#c3ff00";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 메일 전체 틀. corner: 오른쪽 위에 적는 값(접수번호) */
export function mailShell(corner: string, rows: string[]): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${FONT};color:${INK};word-break:keep-all;-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff"><tr><td align="center" style="padding:0 20px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
<tr><td style="padding:36px 0 18px;border-bottom:2px solid ${INK}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:17px;font-weight:800;letter-spacing:-0.02em;color:${INK}">파란컴퍼니</td><td style="font-size:13px;color:${MUTED};text-align:right">${escapeHtml(corner)}</td></tr></table></td></tr>
${rows.filter(Boolean).join("\n")}
<tr><td style="padding:44px 0 40px"><div style="border-top:1px solid ${LINE};padding-top:18px;font-size:13px;line-height:1.8;color:${MUTED}">파란컴퍼니 주식회사 · 02-6342-2800 (평일 09:00~18:00) · info@parancompany.co.kr</div></td></tr>
</table></td></tr></table>
</body>
</html>`;
}

/** 제목과 그 아래 한두 줄. suffix: 제목 옆에 옅게 붙는 말(예: 1차) */
export function mailHeading(title: string, lines: string[], suffix = ""): string {
  const tail = suffix
    ? ` <span style="color:${MUTED};font-weight:600">${escapeHtml(suffix)}</span>`
    : "";
  return `<tr><td style="padding:36px 0 0"><h1 style="margin:0;font-size:26px;line-height:1.3;font-weight:800;letter-spacing:-0.03em;color:${INK}">${escapeHtml(title)}${tail}</h1>
<p style="margin:14px 0 0;font-size:15px;line-height:1.75;color:${INK}">${lines.map(escapeHtml).join("<br/>")}</p></td></tr>`;
}

/** 작은 이름표 + 본문 글(담당자 안내, 남기신 문의 내용 등) */
export function mailNote(label: string, body: string): string {
  if (!body.trim()) return "";
  return `<tr><td style="padding:28px 0 0"><div style="font-size:13px;color:${MUTED};margin-bottom:6px">${escapeHtml(label)}</div><div style="font-size:16px;line-height:1.7;color:${INK};white-space:pre-wrap">${escapeHtml(body)}</div></td></tr>`;
}

export interface MailLine {
  name: string;
  detail?: string;
  qty: string;
  amount: string;
}

/** 품목 표. amountLabel: 금액 칸 머리말(공급가 / 금액) */
export function mailLines(lines: MailLine[], amountLabel: string): string {
  if (lines.length === 0) return "";
  const head = `padding:10px 0;border-bottom:1px solid ${LINE};font-size:12px;font-weight:600;color:${MUTED}`;
  const body = lines
    .map(
      (line) => `<tr><td style="padding:14px 0;border-bottom:1px solid ${LINE};vertical-align:top"><div style="font-size:15px;font-weight:600;color:${INK}">${escapeHtml(line.name)}</div>${line.detail ? `<div style="font-size:13px;color:${MUTED};margin-top:4px;line-height:1.55">${escapeHtml(line.detail)}</div>` : ""}</td><td style="padding:14px 0 14px 16px;border-bottom:1px solid ${LINE};font-size:14px;color:${MUTED};text-align:right;white-space:nowrap;vertical-align:top">${escapeHtml(line.qty)}</td><td style="padding:14px 0 14px 20px;border-bottom:1px solid ${LINE};font-size:15px;color:${INK};text-align:right;white-space:nowrap;vertical-align:top">${escapeHtml(line.amount)}</td></tr>`
    )
    .join("");
  return `<tr><td style="padding:36px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK}"><tr><th style="${head};text-align:left">항목</th><th style="${head};padding-left:16px;text-align:right">수량</th><th style="${head};padding-left:20px;text-align:right">${escapeHtml(amountLabel)}</th></tr>${body}</table></td></tr>`;
}

/** 합계 묶음. parts: 합계 위에 적는 내역(공급가·부가세·배송비). 합계 금액에만 라임 밑줄 */
export function mailTotals(parts: Array<[string, string]>, total: string): string {
  const partRows = parts
    .map(
      ([label, value], i) =>
        `<tr><td style="padding:4px 0${i === parts.length - 1 ? " 12px" : ""};font-size:14px;color:${MUTED}">${escapeHtml(label)}</td><td style="padding:4px 0${i === parts.length - 1 ? " 12px" : ""};font-size:14px;color:${INK};text-align:right">${escapeHtml(value)}</td></tr>`
    )
    .join("");
  return `<tr><td style="padding:18px 0 0"><table role="presentation" align="right" cellpadding="0" cellspacing="0" style="width:280px;max-width:100%">
${partRows}
<tr><td style="padding:14px 0 0;border-top:2px solid ${INK};font-size:15px;font-weight:700;color:${INK}">합계 <span style="font-weight:400;color:${MUTED};font-size:13px">부가세 포함</span></td><td style="padding:14px 0 0;border-top:2px solid ${INK};font-size:22px;font-weight:800;letter-spacing:-0.02em;color:${INK};text-align:right;white-space:nowrap"><span style="background:linear-gradient(transparent 58%,${LIME} 58%);padding:0 4px">${escapeHtml(total)}</span></td></tr></table></td></tr>`;
}

/** 버튼 하나와 그 아래 설명 */
export function mailButton(url: string, label: string, note: string): string {
  return `<tr><td style="padding:40px 0 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:15px 26px;background:${LIME};color:${INK};font-size:15px;font-weight:800;text-decoration:none;border-radius:6px">${escapeHtml(label)}</a>
<p style="margin:14px 0 0;font-size:13px;line-height:1.7;color:${MUTED}">${escapeHtml(note)}</p></td></tr>`;
}

/** 본문 문단 */
export function mailText(lines: string[]): string {
  return `<tr><td style="padding:32px 0 0;font-size:15px;line-height:1.75;color:${INK}">${lines.map(escapeHtml).join("<br/>")}</td></tr>`;
}
