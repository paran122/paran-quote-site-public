import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { eventReviewSchema } from "@/lib/validators/portfolio";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { db: { schema: "paran_quote_site" } });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = getClient();
    const { data, error } = await db
      .from("event_reviews")
      .select("*")
      .eq("portfolio_id", params.id)
      .order("created_at");
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const parsed = eventReviewSchema.parse({
      ...body,
      portfolio_id: params.id,
    });

    const db = getClient();
    const { data, error } = await db
      .from("event_reviews")
      .insert(parsed)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다" }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { reviewId } = (await request.json()) as { reviewId: string };
    if (!reviewId) {
      return NextResponse.json({ error: "삭제할 후기 ID가 없습니다" }, { status: 400 });
    }

    const db = getClient();
    const { error } = await db
      .from("event_reviews")
      .delete()
      .eq("id", reviewId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "삭제 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
