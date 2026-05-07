/**
 * 한국 전화번호 자동 포맷팅
 * - 휴대폰 010-XXXX-XXXX
 * - 서울 02-XXX-XXXX 또는 02-XXXX-XXXX
 * - 지역번호 0XX-XXX-XXXX 또는 0XX-XXXX-XXXX (031, 032, 042, 051, 062 등)
 * - 인터넷전화 070-XXXX-XXXX, 0507-XXXX-XXXX
 * - 대표번호 1588-XXXX (15XX, 16XX, 17XX, 18XX, 19XX)
 */
export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  // 서울 (02)
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  // 대표번호 (15XX, 16XX, 17XX, 18XX, 19XX) - 8자리 4-4
  if (/^1[5-9]\d{2}/.test(digits)) {
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
  }

  // 0507, 0508 등 4자리 시작 인터넷전화
  if (/^050\d/.test(digits)) {
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  }

  // 그 외 3자리 시작 (010, 011, 070, 031, 032, 042 등)
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export const KOREAN_PHONE_REGEX = /^[\d-]{9,14}$/;
