import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";
import { quoteLinkKey } from "@/lib/quote/link";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  // 관리자 조회는 서버 전용 키로 읽는다. 공개 키의 읽기 권한을 나중에 막아도 이 화면은 그대로 동작한다.
  const db = supabaseAdmin ?? supabase;
  if (!db) {
    return NextResponse.json([]);
  }

  const { data, error } = await db
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 고객에게 보내는 견적 바로보기 주소(사이트 주소를 뺀 경로)
  const seen = new Map<string, number>();
  for (const row of (data ?? []) as Array<{ quote_number?: string }>) {
    if (row.quote_number) seen.set(row.quote_number, (seen.get(row.quote_number) ?? 0) + 1);
  }
  const rows = (data ?? []).map((row: { quote_number?: string }) => {
    // 번호가 겹친 예전 접수는 링크를 만들지 않는다(조회도 거절함)
    const unique = row.quote_number ? seen.get(row.quote_number) === 1 : false;
    const linkKey = unique && row.quote_number ? quoteLinkKey(row.quote_number) : null;
    return { ...row, link_path: linkKey ? `/q/${linkKey}` : null };
  });

  return NextResponse.json(rows);
}
