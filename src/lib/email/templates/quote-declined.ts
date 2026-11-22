import { mailHeading, mailNote, mailShell } from "./layout";

// 일정·예산 등으로 맡지 못할 때 고객에게 보내는 사과 메일. 본문은 담당자가 인트라넷에서 적는다.

export interface QuoteDeclinedEmailData {
  contactName: string;
  quoteNumber: string;
  eventName: string;
  message: string;
}

export function quoteDeclinedSubject(data: QuoteDeclinedEmailData): string {
  return `[파란컴퍼니] 견적 요청에 대한 안내 (${data.quoteNumber})`;
}

export function quoteDeclinedHtml(data: QuoteDeclinedEmailData): string {
  return mailShell(data.quoteNumber, [
    mailHeading("이번 요청은 진행이 어렵습니다.", [`${data.contactName}님께 드리는 안내입니다.`, data.eventName]),
    mailNote("담당자가 남긴 말", data.message),
  ]);
}
