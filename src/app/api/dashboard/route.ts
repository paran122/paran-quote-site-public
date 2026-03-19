import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ blog: 0, portfolio: 0, media: 0, quote: 0 });
  }

  const [blogRes, portfolioRes, mediaRes, quoteRes] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("portfolios").select("id", { count: "exact", head: true }),
    supabase.from("portfolio_media").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    blog: blogRes.count ?? 0,
    portfolio: portfolioRes.count ?? 0,
    media: mediaRes.count ?? 0,
    quote: quoteRes.count ?? 0,
  });
}
