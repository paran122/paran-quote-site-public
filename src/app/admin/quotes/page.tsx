"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  QuoteItem,
  QuoteRow,
  QuoteDetail,
  STATUS_OPTIONS,
} from "@/components/admin/quotes/QuoteComponents";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("전체");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "로그인이 필요합니다" : "불러오기 실패");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setQuotes(data);
        else setError(data?.error || "응답 형식 오류");
      })
      .catch((err) => setError(err.message))
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
      } else {
        alert("상태 변경에 실패했습니다");
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = filter === "전체" ? quotes : quotes.filter((q) => q.status === filter);

  const statusCounts = quotes.reduce<Record<string, number>>((acc, q) => {
    const key = q.status || "접수대기";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          {loading ? "불러오는 중..." : error ? "조회 실패" : `총 ${quotes.length}건`}
        </p>
      </div>

      {/* 필터 탭 */}
      {!loading && !error && quotes.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {["전체", ...STATUS_OPTIONS].map((s) => {
            const count = s === "전체" ? quotes.length : (statusCounts[s] || 0);
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <div className="text-center py-12">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          {error.includes("로그인") && (
            <Link href="/admin/login" className="text-sm text-primary hover:underline">
              로그인 페이지로 이동
            </Link>
          )}
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-sm text-slate-400">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400">
            {quotes.length === 0 ? "아직 견적 요청이 없습니다" : "해당 상태의 견적이 없습니다"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
              >
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
      )}
    </div>
  );
}
