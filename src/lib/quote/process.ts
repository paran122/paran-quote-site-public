import {
  sendQuoteNotification,
  type QuoteEmailData,
} from "@/lib/email/send-notification";
import { quoteLinkUrl } from "@/lib/quote/link";

/** 행사일 미입력 시 메일·알림톡에 표시할 값 */
const NO_DATE_LABEL = "-";

export interface QuoteAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface QuoteCartItem {
  name: string;
  price: number;
  qty?: number;
  quantity?: number;
  unit?: string;
  type?: string;
  id?: string;
  emoji?: string;
  category?: string;
  options?: Record<string, unknown>;
  discountRate?: number;
  includedServices?: string[];
}

export interface QuoteInput {
  quote_number: string;
  contact_name: string;
  organization: string;
  phone: string;
  email: string;
  department?: string;
  event_name: string;
  event_date?: string;
  event_venue?: string;
  event_type?: string;
  attendees?: string;
  memo?: string;
  cart_items: QuoteCartItem[];
  total_amount: number;
  discount_amount?: number;
  user_id?: string;
  attachments?: QuoteAttachment[];
  /** 메일·알림톡에 적을 합계(만 원). total_amount 를 원 단위로 저장하는 접수만 넘긴다. */
  total_amount_man?: number;
  /** 접수가 들어온 사이트 주소. 있으면 견적 바로보기 링크를 만들어 메일·알림톡에 넣는다. */
  site_url?: string;
}

export type QuoteResult =
  | {
      ok: true;
      email: { admin: boolean; customer: boolean };
      alimtalk: { success: boolean };
      /** 견적 바로보기 주소(만들 수 없으면 null) */
      link: string | null;
    }
  | { ok: false; status: number; error: string };

/** 알림톡에 적는 요청 요약: 첫 품목 이름(괄호 속 수량 설명 제외) + "외 N건" */
function summarizeItems(items: QuoteCartItem[]): string {
  if (items.length === 0) return "-";
  const first = items[0].name.replace(/\s*\([^)]*\)\s*$/, "").trim() || items[0].name;
  return items.length > 1 ? `${first} 외 ${items.length - 1}건` : first;
}

/**
 * 접수 한 건을 저장하고 메일·알림톡을 보낸다.
 * `/api/quote`(기존 견적·문의 양식)와 `/api/store/quote`(서비스 장바구니)가 같이 쓴다.
 * 저장이 성공하면 메일·알림톡이 실패해도 성공으로 돌려준다.
 */
export async function saveAndNotifyQuote(data: QuoteInput): Promise<QuoteResult> {
  // DB insert – 서버용 클라이언트 (auth persistence 비활성)
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { ok: false, status: 500, error: "Supabase not configured" };
  }
  const db = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "paran_quote_site" },
  });
  const { error: dbError } = await db.from("quotes").insert({
    quote_number: data.quote_number,
    contact_name: data.contact_name,
    organization: data.organization,
    phone: data.phone,
    email: data.email,
    department: data.department,
    event_name: data.event_name,
    event_date: data.event_date || null,
    event_venue: data.event_venue,
    event_type: data.event_type,
    attendees: data.attendees,
    memo: data.memo,
    cart_items: data.cart_items,
    total_amount: data.total_amount,
    discount_amount: data.discount_amount,
    user_id: data.user_id,
    attachments: data.attachments || [],
  });

  if (dbError) {
    console.error("[quote] DB insert failed:", dbError);
    return { ok: false, status: 500, error: "견적 저장에 실패했습니다" };
  }

  // 이메일 발송 (DB 저장 성공 후, 이메일 실패해도 성공 반환)
  const isInquiry = data.event_name === "문의" || data.event_type === "문의";

  // 첨부파일 signed URL 생성 (7일 유효 — 이메일에서 다운로드용)
  let emailAttachments: QuoteAttachment[] | undefined;
  if (data.attachments && data.attachments.length > 0) {
    try {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (url && serviceKey) {
        const serviceDb = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const paths = data.attachments.map((a) => a.url);
        const { data: signedData } = await serviceDb.storage
          .from("contact-attachments")
          .createSignedUrls(paths, 7 * 24 * 60 * 60); // 7일

        if (signedData) {
          const urlMap: Record<string, string> = {};
          for (const item of signedData) {
            if (item.signedUrl && item.path) urlMap[item.path] = item.signedUrl;
          }
          emailAttachments = data.attachments.map((a) => ({
            ...a,
            url: urlMap[a.url] || a.url,
          }));
        }
      }
    } catch (err) {
      console.error("[quote] Failed to generate signed URLs for email:", err);
      // signed URL 실패해도 파일명만이라도 이메일에 표시
      emailAttachments = data.attachments;
    }
  }

  const linkUrl = quoteLinkUrl(data.site_url, data.quote_number);
  const totalMan = data.total_amount_man ?? data.total_amount;

  const emailData: QuoteEmailData = {
    quoteNumber: data.quote_number,
    contactName: data.contact_name,
    organization: data.organization,
    phone: data.phone,
    email: data.email,
    department: data.department,
    eventName: data.event_name,
    eventDate: data.event_date || NO_DATE_LABEL,
    eventVenue: data.event_venue,
    eventType: data.event_type,
    attendees: data.attendees,
    memo: data.memo,
    cartItems: data.cart_items,
    totalAmount: totalMan,
    discountAmount: data.discount_amount,
    type: isInquiry ? "inquiry" : "quote",
    attachments: emailAttachments,
    linkUrl,
  };

  // 알림톡 발송 (실패해도 성공 반환 — 이메일과 동일 정책)
  const sendAlimtalk = async (): Promise<{ success: boolean }> => {
    if (isInquiry) {
      const { sendInquiryAlimtalk } = await import("@/lib/alimtalk");
      return sendInquiryAlimtalk({
        phone: data.phone,
        contactName: data.contact_name,
        quoteNumber: data.quote_number,
        linkUrl,
        eventName: data.event_name,
      });
    }
    const { sendQuoteAlimtalk } = await import("@/lib/alimtalk");
    return sendQuoteAlimtalk({
      phone: data.phone,
      contactName: data.contact_name,
      quoteNumber: data.quote_number,
      organization: data.organization,
      eventType: data.event_type || data.event_name,
      eventDate: data.event_date || NO_DATE_LABEL,
      totalAmount: totalMan,
      linkUrl,
      eventName: data.event_name,
      requestSummary: summarizeItems(data.cart_items),
    });
  };

  // 메일과 알림톡을 동시에 보낸다. 순차로 기다리면 지연이 더해져
  // 서버리스 함수 제한에 걸리고, 저장은 됐는데 사용자에게는 오류로 보인다.
  const [emailSettled, alimtalkSettled] = await Promise.allSettled([
    sendQuoteNotification(emailData),
    sendAlimtalk(),
  ]);

  if (emailSettled.status === "rejected") {
    console.error("[quote] Email send error:", emailSettled.reason);
  }
  if (alimtalkSettled.status === "rejected") {
    console.error("[quote] Alimtalk send error:", alimtalkSettled.reason);
  }

  return {
    ok: true,
    link: linkUrl,
    email:
      emailSettled.status === "fulfilled"
        ? emailSettled.value
        : { admin: false, customer: false },
    alimtalk:
      alimtalkSettled.status === "fulfilled"
        ? alimtalkSettled.value
        : { success: false },
  };
}
