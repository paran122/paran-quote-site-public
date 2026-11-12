import type { QuoteEmailData } from "./types";
import { parseReferralFromMemo } from "../../referralSources";
import {
  mailButton,
  mailHeading,
  mailLines,
  mailNote,
  mailShell,
  mailText,
  mailTotals,
} from "./layout";

// 접수 직후 고객에게 보내는 확인 메일(견적 요청 / 문의).

/** 금액 표기. 값은 만 원 단위 */
function formatKRW(amount: number): string {
  // 천 원 미만 단위가 있으면(서비스 사이트 접수 금액) 원 단위로 정확히 적는다
  const exactWon = Math.round(amount * 10000);
  if (exactWon % 1000 !== 0) return `${exactWon.toLocaleString("ko-KR")}원`;
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000);
    const man = amount % 10000;
    if (man === 0) return `${eok}억원`;
    return `${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  }
  return `${amount.toLocaleString("ko-KR")}만원`;
}

const CONTACT_NOTE = [
  "영업일 기준 1일 안에 담당자가 연락드립니다.",
  "급한 건은 02-6342-2800으로 전화 주시면 더 빨리 도와드릴 수 있습니다.",
];

export function customerConfirmSubject(data: QuoteEmailData): string {
  if (data.type === "inquiry") {
    return "[파란컴퍼니] 문의가 접수되었습니다";
  }
  return "[파란컴퍼니] 견적 요청이 접수되었습니다";
}

export function customerConfirmHtml(data: QuoteEmailData): string {
  if (data.type === "inquiry") {
    const { body } = parseReferralFromMemo(data.memo);
    return mailShell(data.quoteNumber, [
      mailHeading("문의를 접수했습니다.", [
        `${data.contactName}님, 파란컴퍼니에 문의해 주셔서 감사합니다.`,
      ]),
      mailNote("남기신 내용", body || ""),
      data.linkUrl
        ? mailButton(
            data.linkUrl,
            "접수 내용 보기",
            "견적이 준비되면 같은 주소에서 확인하실 수 있습니다."
          )
        : "",
      mailText(CONTACT_NOTE),
    ]);
  }

  const lines = data.cartItems.map((item) => {
    const qty = item.qty ?? item.quantity ?? 1;
    const amount = item.price * qty;
    return {
      name: item.name,
      qty: `${qty}${item.unit ? item.unit : "개"}`,
      amount: amount > 0 ? formatKRW(amount) : "상담 후 확정",
    };
  });

  return mailShell(data.quoteNumber, [
    mailHeading("견적 요청을 접수했습니다.", [
      `${data.contactName}님, 요청하신 내용입니다.`,
      data.eventName,
    ]),
    mailLines(lines, "금액"),
    lines.length > 0 && data.totalAmount > 0
      ? mailTotals([], formatKRW(data.totalAmount))
      : "",
    data.linkUrl
      ? mailButton(
          data.linkUrl,
          "견적 바로보기",
          "같은 주소에서 언제든 다시 볼 수 있습니다. 상담 중 견적이 바뀌면 그 주소에 반영됩니다."
        )
      : "",
    mailText(CONTACT_NOTE),
  ]);
}
