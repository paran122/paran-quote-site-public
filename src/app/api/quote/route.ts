import { NextResponse } from "next/server";
import { z } from "zod/v4";
import {
  sendQuoteNotification,
  type QuoteEmailData,
} from "@/lib/email/send-notification";

// IP 기반 Rate Limiting (메모리 기반, 서버리스 환경에서도 동작)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 5; // 1분에 5회

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Zod 스키마
const CartItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  qty: z.number().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  type: z.string().optional(),
  id: z.string().optional(),
  emoji: z.string().optional(),
  category: z.string().optional(),
  options: z.record(z.string(), z.unknown()).optional(),
  discountRate: z.number().optional(),
  includedServices: z.array(z.string()).optional(),
});

const QuoteRequestSchema = z.object({
  quote_number: z.string(),
  contact_name: z.string().min(1),
  organization: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  department: z.string().optional(),
  event_name: z.string().min(1),
  event_date: z.string().min(1),
  event_venue: z.string().optional(),
  event_type: z.string().optional(),
  attendees: z.string().optional(),
  memo: z.string().optional(),
  cart_items: z.array(CartItemSchema),
  total_amount: z.number(),
  discount_amount: z.number().optional(),
  user_id: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
    type: z.string(),
  })).optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = QuoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "유효하지 않은 요청입니다", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // DB insert – 서버용 클라이언트 (auth persistence 비활성)
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
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
      event_date: data.event_date,
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
      console.error("[api/quote] DB insert failed:", dbError);
      return NextResponse.json(
        { error: "견적 저장에 실패했습니다" },
        { status: 500 }
      );
    }

    // 이메일 발송 (DB 저장 성공 후, 이메일 실패해도 성공 반환)
    const isInquiry =
      data.event_name === "문의" || data.event_type === "문의";

    // 첨부파일 signed URL 생성 (7일 유효 — 이메일에서 다운로드용)
    let emailAttachments: { name: string; url: string; size: number; type: string }[] | undefined;
    if (data.attachments && data.attachments.length > 0) {
      try {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (url && serviceKey) {
          const { createClient: createServiceClient } = await import("@supabase/supabase-js");
          const serviceDb = createServiceClient(url, serviceKey, {
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
        console.error("[api/quote] Failed to generate signed URLs for email:", err);
        // signed URL 실패해도 파일명만이라도 이메일에 표시
        emailAttachments = data.attachments;
      }
    }

    const emailData: QuoteEmailData = {
      quoteNumber: data.quote_number,
      contactName: data.contact_name,
      organization: data.organization,
      phone: data.phone,
      email: data.email,
      department: data.department,
      eventName: data.event_name,
      eventDate: data.event_date,
      eventVenue: data.event_venue,
      eventType: data.event_type,
      attendees: data.attendees,
      memo: data.memo,
      cartItems: data.cart_items,
      totalAmount: data.total_amount,
      discountAmount: data.discount_amount,
      type: isInquiry ? "inquiry" : "quote",
      attachments: emailAttachments,
    };

    const emailResult = await sendQuoteNotification(emailData);

    // 알림톡 발송 (실패해도 성공 반환 — 이메일과 동일 정책)
    let alimtalkResult = { success: false };
    try {
      if (isInquiry) {
        const { sendInquiryAlimtalk } = await import("@/lib/alimtalk");
        alimtalkResult = await sendInquiryAlimtalk({
          phone: data.phone,
          contactName: data.contact_name,
          quoteNumber: data.quote_number,
        });
      } else {
        const { sendQuoteAlimtalk } = await import("@/lib/alimtalk");
        alimtalkResult = await sendQuoteAlimtalk({
          phone: data.phone,
          contactName: data.contact_name,
          quoteNumber: data.quote_number,
          organization: data.organization,
          eventType: data.event_type || data.event_name,
          eventDate: data.event_date,
          totalAmount: data.total_amount,
        });
      }
    } catch (alimtalkErr) {
      console.error("[api/quote] Alimtalk send error:", alimtalkErr);
    }

    return NextResponse.json({ success: true, email: emailResult, alimtalk: alimtalkResult });
  } catch (err) {
    console.error("[api/quote] Unexpected error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
