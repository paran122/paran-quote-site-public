/**
 * 접수번호 생성.
 *
 * 기존에는 `IQ-20260714-213`처럼 날짜 + 랜덤 3자리였는데,
 * 하루 999개 중에서 뽑다 보니 같은 날 접수가 겹치면 번호가 중복됐다.
 * (실제로 IQ-20260714-213 이 두 건 발생)
 *
 * 날짜·시각 모두 한국 시간(KST) 기준이다. UTC로 만들면 오전 9시 이전 접수가
 * 전날 번호를 받아 실제 접수일과 어긋난다.
 */

/** 문의 접수 */
const PREFIX_INQUIRY = "IQ";
/** 견적 요청 */
const PREFIX_QUOTE = "QT";

function kstParts(date: Date) {
  // UTC+9 로 옮긴 뒤 UTC 게터를 쓰면 실행 환경의 시간대와 무관하게 KST가 된다
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const p = (n: number, len = 2) => String(n).padStart(len, "0");
  return {
    date: `${kst.getUTCFullYear()}${p(kst.getUTCMonth() + 1)}${p(kst.getUTCDate())}`,
    time: `${p(kst.getUTCHours())}${p(kst.getUTCMinutes())}${p(kst.getUTCSeconds())}`,
  };
}

function build(prefix: string, now: Date): string {
  const { date, time } = kstParts(now);
  return `${prefix}-${date}-${time}`;
}

/** 문의 접수번호 (예: IQ-20261014-143052) */
export function createInquiryNumber(now: Date = new Date()): string {
  return build(PREFIX_INQUIRY, now);
}

/** 견적 접수번호 (예: QT-20261014-143052) */
export function createQuoteNumber(now: Date = new Date()): string {
  return build(PREFIX_QUOTE, now);
}
