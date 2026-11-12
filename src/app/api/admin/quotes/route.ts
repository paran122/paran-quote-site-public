import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";
import { quoteLinkKey } from "@/lib/quote/link";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 고객에게 보내는 견적 바로보기 주소(사이트 주소를 뺀 경로)
  const rows = (data ?? []).map((row: { quote_number?: string }) => {
    const linkKey = row.quote_number ? quoteLinkKey(row.quote_number) : null;
    return { ...row, link_path: linkKey ? `/q/${linkKey}` : null };
  });

  return NextResponse.json(rows);
}
