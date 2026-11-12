import type { QuoteRevision } from "../../quote/view";
import {
  mailButton,
  mailHeading,
  mailLines,
  mailNote,
  mailShell,
  mailTotals,
} from "./layout";

// 담당자가 견적을 고친 뒤 고객에게 보내는 메일.

export interface QuoteUpdatedEmailData {
  contactName: string;
  quoteNumber: string;
  eventName: string;
  revision: QuoteRevision;
  linkUrl: string;
}

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

export function quoteUpdatedSubject(data: QuoteUpdatedEmailData): string {
  return `[파란컴퍼니] 견적이 수정되었습니다 (${data.revision.rev}차)`;
}

export function quoteUpdatedHtml(data: QuoteUpdatedEmailData): string {
  const r = data.revision;
  const parts: Array<[string, string]> = [
    ["공급가", won(r.supply)],
    ["부가세 10%", won(r.vat)],
  ];
  if (r.ship) parts.push(["배송비 (실비)", won(r.ship)]);

  return mailShell(data.quoteNumber, [
    mailHeading(
      "견적을 수정했습니다.",
      [`${data.contactName}님, 상담 내용을 반영한 견적입니다.`, data.eventName],
      `${r.rev}차`
    ),
    mailNote("담당자가 남긴 말", r.notice),
    mailLines(
      r.lines.map((line) => ({
        name: line.name,
        detail: line.detail,
        qty: `${line.qty}${line.unit}`,
        amount: won(line.unitPrice * line.qty),
      })),
      "공급가"
    ),
    mailTotals(parts, won(r.total)),
    mailButton(
      data.linkUrl,
      "견적 바로보기",
      "같은 주소에서 언제든 다시 볼 수 있습니다. 견적이 또 바뀌면 그 주소에 반영됩니다."
    ),
  ]);
}
