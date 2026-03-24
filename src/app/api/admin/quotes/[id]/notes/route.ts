import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json([]);
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("quote_notes")
    .select("*")
    .eq("quote_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ error: "DB 미설정" }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json();
  const content = (body.content as string)?.trim();

  if (!content) {
    return NextResponse.json({ error: "내용을 입력해주세요" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("quote_notes")
    .insert({ quote_id: id, content })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ error: "DB 미설정" }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json();
  const noteId = body.noteId as string;

  if (!noteId) {
    return NextResponse.json({ error: "noteId가 필요합니다" }, { status: 400 });
  }

  const { error } = await supabase
    .from("quote_notes")
    .delete()
    .eq("id", noteId)
    .eq("quote_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
