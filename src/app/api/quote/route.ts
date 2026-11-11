import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { saveAndNotifyQuote } from "@/lib/quote/process";

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
  event_date: z.string().min(1).optional(),
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

    // 저장·메일·알림톡은 서비스 장바구니 접수(/api/store/quote)와 같은 함수를 쓴다
    const result = await saveAndNotifyQuote(parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, email: result.email, alimtalk: result.alimtalk });
  } catch (err) {
    console.error("[api/quote] Unexpected error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
