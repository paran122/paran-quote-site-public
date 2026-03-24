"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";

interface QuoteItem {
  id: string;
  quote_number: string;
  contact_name: string;
  organization: string;
  phone: string;
  email: string;
  department: string | null;
  event_name: string;
  event_date: string;
  event_venue: string | null;
  event_type: string | null;
  attendees: string | null;
  memo: string | null;
  cart_items: Array<{ name: string; price: number; qty?: number; quantity?: number }>;
  total_amount: number;
  discount_amount: number | null;
  status: string;
  created_at: string;
}

interface QuoteNote {
  id: string;
  quote_id: string;
  content: string;
  created_at: string;
}

const STATUS_OPTIONS = ["접수대기", "진행중", "완료", "취소"] as const;

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  "접수대기": { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  "접수": { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  "진행중": { bg: "bg-blue-50", text: "text-blue-700", icon: Loader2 },
  "완료": { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
  "취소": { bg: "bg-slate-100", text: "text-slate-500", icon: XCircle },
};

function isInquiry(q: QuoteItem) {
  return q.event_name === "문의" || q.event_type === "문의";
}

function TypeBadge({ quote }: { quote: QuoteItem }) {
  if (isInquiry(quote)) {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 font-medium">
        문의
      </span>
    );
  }
  return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 font-medium">
      견적
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE["접수대기"];
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatNoteDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── 메모 컴포넌트 ── */
function NotesSection({ quoteId }: { quoteId: string }) {
  const [notes, setNotes] = useState<QuoteNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = useCallback(() => {
    fetch(`/api/admin/quotes/${quoteId}/notes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { if (Array.isArray(data)) setNotes(data); })
      .finally(() => setLoading(false));
  }, [quoteId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setInput("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(noteId: string) {
    const res = await fetch(`/api/admin/quotes/${quoteId}/notes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }

  return (
    <div>
      <span className="text-sm text-slate-400 mb-1.5 flex items-center gap-1">
        <MessageSquare className="w-3.5 h-3.5" />
        내부 메모
      </span>

      <form onSubmit={handleSubmit} className="flex gap-1.5 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메모 입력 (예: 4/10 전화함, 견적서 발송)"
          className="flex-1 text-sm px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
        <button
          type="submit"
          disabled={!input.trim() || submitting}
          className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {loading ? (
        <p className="text-xs text-slate-400">불러오는 중...</p>
      ) : notes.length === 0 ? (
        <p className="text-xs text-slate-400">아직 메모가 없습니다</p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-start gap-2 text-sm bg-slate-50 border border-slate-100 rounded-md px-3 py-2 group"
            >
              <p className="flex-1 text-slate-700">{note.content}</p>
              <span className="text-xs text-slate-400 shrink-0 mt-0.5">
                {formatNoteDate(note.created_at)}
              </span>
              <button
                onClick={() => handleDelete(note.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500 transition-all shrink-0"
                title="삭제"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
            const inquiry = isInquiry(q);
            return (
              <div
                key={q.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
              >
                {/* 요약 행 */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <StatusBadge status={q.status || "접수대기"} />
                      <TypeBadge quote={q} />
                      <span className="text-xs text-slate-400">{q.quote_number}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {inquiry ? q.contact_name : `${q.organization} - ${q.event_name}`}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {inquiry ? q.phone : `${q.contact_name} · ${formatDate(q.created_at)}`}
                    </p>
                  </div>
                  {!inquiry && (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {q.total_amount.toLocaleString("ko-KR")}원
                      </p>
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* 상세 내용 */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 py-4 space-y-4">
                    {/* 연락처 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">담당자</span>
                        <p className="text-slate-900">{q.contact_name}</p>
                      </div>
                      {!inquiry && (
                        <div>
                          <span className="text-slate-400">소속</span>
                          <p className="text-slate-900">{q.organization}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400">전화</span>
                        <p className="text-slate-900">{q.phone}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">이메일</span>
                        <p className="text-slate-900">{q.email}</p>
                      </div>
                      {q.department && (
                        <div>
                          <span className="text-slate-400">부서</span>
                          <p className="text-slate-900">{q.department}</p>
                        </div>
                      )}
                    </div>

                    {/* 행사 정보 (견적일 때만) */}
                    {!inquiry && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">행사명</span>
                          <p className="text-slate-900">{q.event_name}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">행사일</span>
                          <p className="text-slate-900">{formatEventDate(q.event_date)}</p>
                        </div>
                        {q.event_venue && (
                          <div>
                            <span className="text-slate-400">장소</span>
                            <p className="text-slate-900">{q.event_venue}</p>
                          </div>
                        )}
                        {q.event_type && (
                          <div>
                            <span className="text-slate-400">행사유형</span>
                            <p className="text-slate-900">{q.event_type}</p>
                          </div>
                        )}
                        {q.attendees && (
                          <div>
                            <span className="text-slate-400">참석인원</span>
                            <p className="text-slate-900">{q.attendees}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 견적 항목 (견적일 때만) */}
                    {!inquiry && q.cart_items.length > 0 && (
                      <div>
                        <span className="text-sm text-slate-400 mb-1 block">견적 항목</span>
                        <div className="bg-slate-50 rounded-md p-3 space-y-1">
                          {q.cart_items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-slate-700">{item.name}</span>
                              <span className="text-slate-900">
                                {item.price.toLocaleString("ko-KR")}원
                                {(item.qty || item.quantity) && (
                                  <span className="text-slate-400 ml-1">
                                    x{item.qty || item.quantity}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-slate-200 pt-1 mt-1 flex justify-between font-medium text-sm">
                            <span>합계</span>
                            <span>{q.total_amount.toLocaleString("ko-KR")}원</span>
                          </div>
                          {q.discount_amount && q.discount_amount > 0 && (
                            <div className="flex justify-between text-sm text-red-500">
                              <span>할인</span>
                              <span>-{q.discount_amount.toLocaleString("ko-KR")}원</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 고객 메모 */}
                    {q.memo && (
                      <div>
                        <span className="text-sm text-slate-400">고객 메모</span>
                        <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{q.memo}</p>
                      </div>
                    )}

                    {/* 내부 메모 */}
                    <NotesSection quoteId={q.id} />

                    {/* 상태 변경 */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-sm text-slate-500">상태:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {STATUS_OPTIONS.map((s) => {
                          const isCurrent = (q.status || "접수대기") === s;
                          return (
                            <button
                              key={s}
                              onClick={() => !isCurrent && handleStatusChange(q.id, s)}
                              disabled={isCurrent || updatingId === q.id}
                              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                                isCurrent
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              } disabled:opacity-50`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
