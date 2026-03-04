import { createClient } from "@supabase/supabase-js";
import { FileText, Briefcase, ImageIcon, ClipboardList } from "lucide-react";
import Link from "next/link";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { db: { schema: "quote_site" } });
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
}

function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-card transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{label}</span>
        <Icon className="w-4.5 h-4.5 text-slate-400" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const db = getClient();

  let blogCount = 0;
  let portfolioCount = 0;
  let mediaCount = 0;
  let quoteCount = 0;

  if (db) {
    const [blogRes, portfolioRes, mediaRes, quoteRes] = await Promise.all([
      db.from("blog_posts").select("id", { count: "exact", head: true }),
      db.from("portfolios").select("id", { count: "exact", head: true }),
      db.from("portfolio_media").select("id", { count: "exact", head: true }),
      db.from("quotes").select("id", { count: "exact", head: true }),
    ]);
    blogCount = blogRes.count ?? 0;
    portfolioCount = portfolioRes.count ?? 0;
    mediaCount = mediaRes.count ?? 0;
    quoteCount = quoteRes.count ?? 0;
  }

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="블로그 글" value={blogCount} icon={FileText} href="/admin/blog" />
        <StatCard label="포트폴리오" value={portfolioCount} icon={Briefcase} href="/admin/portfolio" />
        <StatCard label="미디어" value={mediaCount} icon={ImageIcon} href="/admin/photos" />
        <StatCard label="견적 요청" value={quoteCount} icon={ClipboardList} href="/admin" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">빠른 작업</h2>
          <div className="space-y-2">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <FileText className="w-4 h-4 text-primary" />
              새 블로그 글 작성
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-primary" />
              새 포트폴리오 등록
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">관리 안내</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>블로그 글을 작성하면 SEO에 유리합니다.</li>
            <li>포트폴리오에 최신 행사를 등록하세요.</li>
            <li>사진은 WebP로 자동 최적화됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
