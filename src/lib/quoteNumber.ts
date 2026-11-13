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
  // 같은 초에 두 건이 들어와도 겹치지 않게 난수 2자리를 붙인다(견적 링크가 접수번호로 묶이므로 중복이면 안 된다)
  const tail = String(Math.floor(Math.random() * 100)).padStart(2, "0");
  return `${prefix}-${date}-${time}${tail}`;
}

/** 새 접수번호의 앞부분: 한국 시간 기준 연월일 6자리 (예: 261113) */
export function dailyNumberPrefix(now: Date = new Date()): string {
  return kstParts(now).date.slice(2);
}

/** 새 접수번호 모양: 날짜 6자리-그날 순번 (예: 261113-03). 견적·문의가 순번을 같이 쓴다. */
export const DAILY_NUMBER_PATTERN = /^\d{6}-(\d{2,4})$/;

/** 문의 접수번호 (예: IQ-20261014-14305207) */
export function createInquiryNumber(now: Date = new Date()): string {
  return build(PREFIX_INQUIRY, now);
}

/** 견적 접수번호 (예: QT-20261014-14305207) */
export function createQuoteNumber(now: Date = new Date()): string {
  return build(PREFIX_QUOTE, now);
}
