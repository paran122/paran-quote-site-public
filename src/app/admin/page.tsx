"use client";

import { useState, useEffect } from "react";
import { FileText, Briefcase, ImageIcon, ClipboardList } from "lucide-react";
import Link from "next/link";

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

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ blog: 0, portfolio: 0, media: 0, quote: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setCounts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="블로그 글" value={loading ? "-" : counts.blog} icon={FileText} href="/admin/blog" />
        <StatCard label="포트폴리오" value={loading ? "-" : counts.portfolio} icon={Briefcase} href="/admin/portfolio" />
        <StatCard label="미디어" value={loading ? "-" : counts.media} icon={ImageIcon} href="/admin/photos" />
        <StatCard label="견적 요청" value={loading ? "-" : counts.quote} icon={ClipboardList} href="/admin" />
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
