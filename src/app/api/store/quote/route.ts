import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { saveAndNotifyQuote, type QuoteCartItem } from "@/lib/quote/process";
import { createInquiryNumber, createQuoteNumber } from "@/lib/quoteNumber";
import {
  normalizeStoreRequest,
  StoreInputError,
  type StoreItem,
  type StoreTotals,
} from "@/lib/store/normalize";

// 서비스 장바구니(메인·서비스 상세·장바구니·견적 요청 화면) 접수.
// 금액은 화면이 보낸 값을 믿지 않고 여기서 카탈로그로 다시 계산한다.

const MAX_BODY_BYTES = 64 * 1024;
const MAX_FILES = 5;

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 5;

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

// 첨부 경로는 /api/contact/upload 가 만든 형식만 받는다(다른 사람 파일 경로를 끼워 넣지 못하게)
const AttachmentsSchema = z
  .array(
    z.object({
      name: z.string().min(1).max(255),
      url: z.string().regex(/^\d{10,}_[a-z0-9]{1,12}\.[a-z0-9]{1,5}$/),
      size: z.number().nonnegative(),
      type: z.string().max(120),
    })
  )
  .max(MAX_FILES);

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

function toCartItem(item: StoreItem): QuoteCartItem {
  return {
    id: item.serviceId,
    name: item.counts ? `${item.name} (${item.counts})` : item.name,
    // 줄 금액(부가세 포함). 금액이 정해지지 않는 구성은 0으로 두고 메모에 '상담 후 확정'으로 적는다
    price: item.estimate?.price ?? 0,
    qty: 1,
    unit: "식",
    category: item.category,
    type: item.type,
    options: {
      ...(item.options ?? {}),
      _summary: item.summary ?? "",
      _counts: item.counts ?? "",
      _basis: item.estimate?.basis ?? "",
      _qty: item.qty ?? 1,
      _design: item.design ?? 1,
      _priceMode: item.priceMode ?? "quote",
    },
  };
}

function buildMemo(
  brief: string,
  budget: string,
  items: StoreItem[],
  totals: StoreTotals | undefined
): string {
  const parts: string[] = [];
  if (brief) parts.push(`[요청사항]\n${brief}`);
  if (budget && budget !== "미정") parts.push(`[예산] ${budget}`);
  if (items.length > 0) {
    const lines = items.map((item, i) => {
      const price = item.estimate
        ? `${item.estimate.label} (${item.estimate.basis})`
        : "상담 후 확정";
      return `${i + 1}. ${item.name} — ${item.summary || "기본 구성"} / ${item.counts || ""} / ${price}`;
    });
    if (totals) {
      const ship = totals.ship ? ` + 배송 ${won(totals.ship)}` : "";
      const cut = totals.cut ? ` − 만 원 미만 절사 ${won(totals.cut)}` : "";
      const unpriced = totals.unpriced ? ` · 금액 미정 ${totals.unpriced}건 제외` : "";
      lines.push(
        `합계 ${won(totals.total)} (공급가 ${won(totals.supply)} + 부가세 ${won(totals.vat)}${ship}${cut})${unpriced}`
      );
    }
    parts.push(`[선택 구성 · 부가세 포함]\n${lines.join("\n")}`);
  }
  return parts.join("\n\n");
}

export async function POST(request: Request) {
  try {
    // 다른 사이트에서 보낸 요청은 받지 않는다
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin) {
      let originHost = "";
      try {
        originHost = new URL(origin).host;
      } catch {
        return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 403 });
      }
      if (originHost !== host) {
        return NextResponse.json(
          { error: "다른 사이트에서 보낸 요청은 허용되지 않습니다." },
          { status: 403 }
        );
      }
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "요청 내용이 너무 큽니다." }, { status: 413 });
    }
    let body: unknown;
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
    }
    const input = body as Record<string, unknown>;

    const attachments = AttachmentsSchema.safeParse(input.attachments ?? []);
    if (!attachments.success) {
      return NextResponse.json({ error: "첨부 파일을 확인해 주세요." }, { status: 400 });
    }

    const store = normalizeStoreRequest(input);
    const items = store.items.filter((item) => item.serviceId !== "_totals");
    const totals = store.items.find((item) => item.serviceId === "_totals")?.totals;
    const consult = store.mode === "consult";
    const now = new Date();
    const number = consult ? createInquiryNumber(now) : createQuoteNumber(now);

    const result = await saveAndNotifyQuote({
      quote_number: number,
      contact_name: store.customer.name,
      organization: store.customer.organization,
      phone: store.customer.phone,
      email: store.customer.email,
      event_name: store.event.title,
      event_date: store.event.date || undefined,
      event_venue: store.event.location || undefined,
      event_type: consult ? "문의" : "서비스 견적",
      memo: buildMemo(store.event.brief, store.event.budget, items, totals),
      cart_items: items.map(toCartItem),
      total_amount: totals?.total ?? 0,
      attachments: attachments.data,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // 접수 완료 화면이 그대로 그리는 내용(화면은 이 응답을 브라우저에 보관한다)
    return NextResponse.json({
      request: {
        id: typeof input.id === "string" ? input.id : "",
        number,
        mode: store.mode,
        title: store.event.title,
        items: store.items,
        status: "received",
        createdAt: now.toISOString(),
      },
      email: result.email,
      alimtalk: result.alimtalk,
    });
  } catch (err) {
    if (err instanceof StoreInputError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[api/store/quote] Unexpected error:", err);
    return NextResponse.json(
      { error: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
