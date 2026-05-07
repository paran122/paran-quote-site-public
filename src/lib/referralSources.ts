export const REFERRAL_SOURCES = [
  "네이버 검색",
  "구글 검색",
  "인스타그램",
  "블로그 / SNS",
  "광고",
  "지인 소개",
  "기타",
] as const;

export const REFERRAL_OTHER = "기타";

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export function buildReferralLine(
  referrals: string[],
  otherDetail?: string
): string | null {
  if (referrals.length === 0) return null;
  const parts = referrals.map((r) => {
    if (r === REFERRAL_OTHER && otherDetail?.trim()) {
      return `기타(${otherDetail.trim()})`;
    }
    return r;
  });
  return `[유입경로] ${parts.join(", ")}`;
}

export function prependReferralToMemo(
  referrals: string[],
  memo: string,
  otherDetail?: string
): string {
  const line = buildReferralLine(referrals, otherDetail);
  if (!line) return memo;
  return memo.trim() ? `${line}\n\n${memo}` : line;
}

/**
 * memo 첫 줄에 들어있는 [유입경로] 라인을 분리해서 반환.
 * - referral: "네이버 검색, 인스타그램" 같은 값 (없으면 null)
 * - body: 유입경로를 제외한 나머지 본문
 */
export function parseReferralFromMemo(
  memo: string | null | undefined
): { referral: string | null; body: string } {
  if (!memo) return { referral: null, body: "" };
  const trimmed = memo.trim();
  if (!trimmed.startsWith("[유입경로]")) {
    return { referral: null, body: trimmed };
  }
  const newlineIdx = trimmed.indexOf("\n");
  if (newlineIdx === -1) {
    return {
      referral: trimmed.replace(/^\[유입경로\]\s*/, "").trim(),
      body: "",
    };
  }
  const firstLine = trimmed.slice(0, newlineIdx);
  const rest = trimmed.slice(newlineIdx + 1).trim();
  return {
    referral: firstLine.replace(/^\[유입경로\]\s*/, "").trim(),
    body: rest,
  };
}
