"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Briefcase,
  ImageIcon,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import {
  QuoteItem,
  QuoteRow,
  QuoteDetail,
} from "@/components/admin/quotes/QuoteComponents";

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

/* ── 견적 요청 섹션 (대시보드 미리보기) ── */
function QuotesSection() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => { if (Array.isArray(data)) setQuotes(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-sm text-slate-400">불러오는 중...</div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8">
        <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400">아직 견적 요청이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {quotes.map((q) => {
        const isExpanded = expandedId === q.id;
        return (
          <div key={q.id} className="border border-slate-100 rounded-lg overflow-hidden">
            <QuoteRow
              quote={q}
              isExpanded={isExpanded}
              onToggle={() => setExpandedId(isExpanded ? null : q.id)}
            />
            {isExpanded && (
              <QuoteDetail
                quote={q}
                updatingId={updatingId}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── 메인 대시보드 ── */
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
        <StatCard label="견적 요청" value={loading ? "-" : counts.quote} icon={ClipboardList} href="/admin/quotes" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

      {/* 견적 요청 섹션 */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-500" />
            견적 요청
          </h2>
          <Link
            href="/admin/quotes"
            className="text-xs text-primary hover:underline"
          >
            전체보기
          </Link>
        </div>
        <QuotesSection />
      </div>
    </div>
  );
}
