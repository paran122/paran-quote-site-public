import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { portfolioSchema } from "@/lib/validators/portfolio";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { db: { schema: "quote_site" } });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = getClient();
    const { data, error } = await db
      .from("portfolios")
      .select("*")
      .eq("id", params.id)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const parsed = portfolioSchema.partial().parse(body);

    const db = getClient();
    const { data, error } = await db
      .from("portfolios")
      .update(parsed)
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다" }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "수정 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = getClient();

    // 연관 미디어와 후기 먼저 삭제
    await db.from("portfolio_media").delete().eq("portfolio_id", params.id);
    await db.from("event_reviews").delete().eq("portfolio_id", params.id);

    const { error } = await db.from("portfolios").delete().eq("id", params.id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "삭제 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
