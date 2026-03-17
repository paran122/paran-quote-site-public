import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { portfolioSchema } from "@/lib/validators/portfolio";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET() {
  try {
    const db = getClient();
    const { data, error } = await db
      .from("portfolios")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = portfolioSchema.parse(body);

    const db = getClient();
    const { data, error } = await db
      .from("portfolios")
      .insert(parsed)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다", details: err }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
