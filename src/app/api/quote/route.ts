import { NextResponse } from "next/server";
import { z } from "zod/v4";
import {
  sendQuoteNotification,
  type QuoteEmailData,
} from "@/lib/email/send-notification";

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
});

export async function POST(request: Request) {
  try {
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
      db: { schema: "quote_site" },
      auth: { persistSession: false, autoRefreshToken: false },
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
    });

    if (dbError) {
      console.error("[api/quote] DB insert failed:", dbError);
      return NextResponse.json(
        { error: "견적 저장에 실패했습니다", debug: dbError.message },
        { status: 500 }
      );
    }

    // 이메일 발송 (DB 저장 성공 후, 이메일 실패해도 성공 반환)
    const isInquiry =
      data.event_name === "문의" || data.event_type === "문의";

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
    };

    const emailResult = await sendQuoteNotification(emailData);

    return NextResponse.json({ success: true, email: emailResult });
  } catch (err) {
    console.error("[api/quote] Unexpected error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다", debug: String(err) },
      { status: 500 }
    );
  }
}
