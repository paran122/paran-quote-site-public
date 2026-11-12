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

/** 알림톡 버튼(웹링크). 카카오에 등록한 템플릿의 버튼과 이름·주소 형식이 같아야 한다. */
interface AlimtalkButton {
  type: "WL";
  name: string;
  linkMobile: string;
  linkPc: string;
}

interface SendAlimtalkParams {
  templateCode: string;
  to: string;
  variables: AlimtalkVariable;
  buttons?: AlimtalkButton[];
}

/**
 * 견적 바로보기 버튼이 달린 새 템플릿을 쓸지.
 * 카카오 심사가 끝난 뒤 Netlify 환경값 NCP_ALIMTALK_LINK_TEMPLATES=on 으로 켠다.
 * 꺼져 있거나 새 템플릿 발송이 실패하면 기존 템플릿으로 보낸다.
 */
const LINK_TEMPLATES_ON = process.env.NCP_ALIMTALK_LINK_TEMPLATES === "on";
function linkButton(url: string, name = "견적 바로보기"): AlimtalkButton[] {
  return [{ type: "WL", name, linkMobile: url, linkPc: url }];
}

/** 알림톡 단건 발송 */
export async function sendAlimtalk({
  templateCode,
  to,
  variables,
  buttons,
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
        ...(buttons && buttons.length > 0 ? { buttons } : {}),
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
      // 응답이 늦어도 접수 응답이 막히지 않도록 상한을 둔다
      signal: AbortSignal.timeout(4000),
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

  // 아래 세 템플릿은 2026-11-13 카카오에 등록한 문구와 글자·줄바꿈까지 같아야 발송된다
  if (templateCode === "ParanQuoteReceived2") {
    return `안녕하세요, ${vars.고객명}님. 파란컴퍼니입니다.
홈페이지에서 요청하신 견적을 잘 받았습니다.

▪ 행사·작업명: ${vars.행사명}
▪ 요청 내용: ${vars.요청내용}
▪ 견적 금액: ${vars.견적금액}
▪ 접수번호: ${vars.접수번호}

아래 버튼에서 견적을 다시 볼 수 있습니다.
견적이 바뀌면 같은 버튼에서 바로 보입니다.

영업일 기준 하루 안에 연락드리겠습니다.

문의 02-6342-2800 (평일 09:00~18:00)
파란컴퍼니 드림`;
  }

  if (templateCode === "ParanQuoteUpdated") {
    return `안녕하세요, ${vars.고객명}님. 파란컴퍼니입니다.
상담한 내용대로 견적을 고쳤습니다.

▪ 행사·작업명: ${vars.행사명}
▪ 고친 견적 금액: ${vars.견적금액}
▪ 수정 횟수: ${vars.수정횟수}번째
▪ 접수번호: ${vars.접수번호}

아래 버튼에서 고친 견적을 볼 수 있습니다.

문의 02-6342-2800 (평일 09:00~18:00)
파란컴퍼니 드림`;
  }

  if (templateCode === "ParanInquiryReceived2") {
    return `안녕하세요, ${vars.고객명}님. 파란컴퍼니입니다.
홈페이지에 남기신 상담 요청을 잘 받았습니다.

▪ 행사·작업명: ${vars.행사명}
▪ 접수번호: ${vars.접수번호}

아래 버튼에서 남기신 내용을 볼 수 있습니다.
견적이 준비되면 같은 버튼에서 보입니다.

영업일 기준 하루 안에 연락드리겠습니다.

문의 02-6342-2800 (평일 09:00~18:00)
파란컴퍼니 드림`;
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
  /** 견적 바로보기 주소. 새 템플릿이 켜져 있을 때만 쓴다. */
  linkUrl?: string | null;
  /** 고객이 적은 행사·작업명 (새 템플릿용) */
  eventName?: string;
  /** 요청한 구성 요약, 예: "포스터 외 2건" (새 템플릿용) */
  requestSummary?: string;
}) {
  const { formatPriceWon } = await import("@/lib/pricing");

  if (LINK_TEMPLATES_ON && params.linkUrl) {
    const sent = await sendAlimtalk({
      templateCode: "ParanQuoteReceived2",
      to: params.phone,
      variables: {
        고객명: params.contactName,
        행사명: params.eventName || "-",
        요청내용: params.requestSummary || "-",
        견적금액: formatPriceWon(params.totalAmount),
        접수번호: params.quoteNumber,
      },
      buttons: linkButton(params.linkUrl),
    });
    if (sent.success) return sent;
    console.warn("[alimtalk] link template failed, falling back:", sent.error);
  }

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
  /** 접수 내용 보기 주소. 새 템플릿이 켜져 있을 때만 쓴다. */
  linkUrl?: string | null;
  /** 고객이 적은 행사·작업명 (새 템플릿용) */
  eventName?: string;
}) {
  if (LINK_TEMPLATES_ON && params.linkUrl) {
    const sent = await sendAlimtalk({
      templateCode: "ParanInquiryReceived2",
      to: params.phone,
      variables: {
        고객명: params.contactName,
        행사명: params.eventName || "-",
        접수번호: params.quoteNumber,
      },
      buttons: linkButton(params.linkUrl, "접수 내용 보기"),
    });
    if (sent.success) return sent;
    console.warn("[alimtalk] link template failed, falling back:", sent.error);
  }

  return sendAlimtalk({
    templateCode: "ParanInquiryReceived",
    to: params.phone,
    variables: {
      고객명: params.contactName,
      접수번호: params.quoteNumber,
    },
  });
}

/* ── 편의 함수: 견적 수정 알림톡 (새 템플릿이 켜져 있을 때만 발송) ── */

export async function sendQuoteUpdatedAlimtalk(params: {
  phone: string;
  contactName: string;
  quoteNumber: string;
  rev: number;
  /** 만 원 단위 */
  totalAmount: number;
  linkUrl: string;
  eventName: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!LINK_TEMPLATES_ON) {
    return { success: false, error: "link templates are off" };
  }
  const { formatPriceWon } = await import("@/lib/pricing");
  return sendAlimtalk({
    templateCode: "ParanQuoteUpdated",
    to: params.phone,
    variables: {
      고객명: params.contactName,
      행사명: params.eventName || "-",
      견적금액: formatPriceWon(params.totalAmount),
      수정횟수: String(params.rev),
      접수번호: params.quoteNumber,
    },
    buttons: linkButton(params.linkUrl),
  });
}
