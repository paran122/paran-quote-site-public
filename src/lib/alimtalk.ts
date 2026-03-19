import crypto from "crypto";

/* ── NCP SENS 알림톡 발송 ── */

const NCP_ACCESS_KEY = process.env.NCP_ACCESS_KEY ?? "";
const NCP_SECRET_KEY = process.env.NCP_SECRET_KEY ?? "";
const NCP_SERVICE_ID = process.env.NCP_SENS_SERVICE_ID ?? "";
const PLUS_FRIEND_ID = process.env.NCP_KAKAO_PLUS_FRIEND_ID ?? "@파란컴퍼니";

const BASE_URL = "https://sens.apigw.ntruss.com";

/** NCP API Gateway Signature v2 생성 */
function makeSignature(method: string, url: string, timestamp: string): string {
  const message = `${method} ${url}\n${timestamp}\n${NCP_ACCESS_KEY}`;
  return crypto
    .createHmac("sha256", NCP_SECRET_KEY)
    .update(message)
    .digest("base64");
}

/** 전화번호 정규화 (010-1234-5678 → 01012345678) */
function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

interface AlimtalkVariable {
  [key: string]: string;
}

interface SendAlimtalkParams {
  templateCode: string;
  to: string;
  variables: AlimtalkVariable;
}

/** 알림톡 단건 발송 */
export async function sendAlimtalk({
  templateCode,
  to,
  variables,
}: SendAlimtalkParams): Promise<{ success: boolean; error?: string }> {
  if (!NCP_ACCESS_KEY || !NCP_SECRET_KEY || !NCP_SERVICE_ID) {
    console.warn("[alimtalk] NCP credentials not configured, skipping");
    return { success: false, error: "NCP credentials not configured" };
  }

  const path = `/alimtalk/v2/services/${encodeURIComponent(NCP_SERVICE_ID)}/messages`;
  const timestamp = Date.now().toString();
  const signature = makeSignature("POST", path, timestamp);

  // 템플릿 내용에 변수 치환
  const content = buildContent(templateCode, variables);

  const body = {
    plusFriendId: PLUS_FRIEND_ID,
    templateCode,
    messages: [
      {
        countryCode: "82",
        to: normalizePhone(to),
        content,
      },
    ],
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": timestamp,
        "x-ncp-iam-access-key": NCP_ACCESS_KEY,
        "x-ncp-apigw-signature-v2": signature,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[alimtalk] Send failed:", res.status, text);
      return { success: false, error: `HTTP ${res.status}: ${text}` };
    }

    const data = await res.json();
    console.log("[alimtalk] Send success:", data);
    return { success: true };
  } catch (err) {
    console.error("[alimtalk] Send error:", err);
    return { success: false, error: String(err) };
  }
}

/* ── 템플릿별 내용 생성 ── */

function buildContent(templateCode: string, vars: AlimtalkVariable): string {
  if (templateCode === "ParanQuoteReceived") {
    return `안녕하세요, ${vars.고객명}님.
파란컴퍼니입니다.

요청하신 견적이 정상적으로 접수되었습니다.

■ 접수 정보
ㅇ 접수번호 : ${vars.접수번호}
ㅇ 기관/회사 : ${vars.기관명}
ㅇ 행사 유형 : ${vars.행사유형}
ㅇ 희망 일시 : ${vars.행사일시}
ㅇ 예상 견적 : ${vars.예상금액}

담당자가 확인 후 1영업일 이내에 연락드리겠습니다.
상세 견적서는 입력하신 이메일로 발송해 드립니다.

ㅇ 전화 문의 : 02-6342-2800
               (평일 09:00~18:00)

감사합니다.`;
  }

  if (templateCode === "ParanInquiryReceived") {
    return `안녕하세요, ${vars.고객명}님.
파란컴퍼니입니다.

문의가 정상적으로 접수되었습니다.

■ 접수번호 : ${vars.접수번호}

담당자가 확인 후 1영업일 이내에 연락드리겠습니다.

ㅇ 전화 문의 : 02-6342-2800
               (평일 09:00~18:00)

감사합니다.`;
  }

  return "";
}

/* ── 편의 함수: 견적 접수 알림톡 ── */

export async function sendQuoteAlimtalk(params: {
  phone: string;
  contactName: string;
  quoteNumber: string;
  organization: string;
  eventType: string;
  eventDate: string;
  totalAmount: number;
}) {
  const { formatPriceWon } = await import("@/lib/pricing");

  return sendAlimtalk({
    templateCode: "ParanQuoteReceived",
    to: params.phone,
    variables: {
      고객명: params.contactName,
      접수번호: params.quoteNumber,
      기관명: params.organization,
      행사유형: params.eventType,
      행사일시: params.eventDate,
      예상금액: formatPriceWon(params.totalAmount),
    },
  });
}

/* ── 편의 함수: 문의 접수 알림톡 ── */

export async function sendInquiryAlimtalk(params: {
  phone: string;
  contactName: string;
  quoteNumber: string;
}) {
  return sendAlimtalk({
    templateCode: "ParanInquiryReceived",
    to: params.phone,
    variables: {
      고객명: params.contactName,
      접수번호: params.quoteNumber,
    },
  });
}
