"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Briefcase,
  ImageIcon,
  ClipboardList,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
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

/* ── 견적 관련 타입/상수 ── */
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

function formatDateTime(dateStr: string) {
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
      <span className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
        <MessageSquare className="w-3 h-3" />
        내부 메모
      </span>

      {/* 입력 */}
      <form onSubmit={handleSubmit} className="flex gap-1.5 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메모 입력 (예: 4/10 전화함, 견적서 발송)"
          className="flex-1 text-sm px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
        />
        <button
          type="submit"
          disabled={!input.trim() || submitting}
          className="px-2.5 py-1.5 bg-slate-900 text-white rounded-md text-xs hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* 목록 */}
      {loading ? (
        <p className="text-xs text-slate-400">불러오는 중...</p>
      ) : notes.length === 0 ? (
        <p className="text-xs text-slate-400">아직 메모가 없습니다</p>
      ) : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-start gap-2 text-sm bg-white border border-slate-100 rounded-md px-2.5 py-1.5 group"
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

/* ── 견적 요청 섹션 ── */
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
        const inquiry = isInquiry(q);
        return (
          <div
            key={q.id}
            className="border border-slate-100 rounded-lg overflow-hidden"
          >
            {/* 요약 행 */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : q.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <StatusBadge status={q.status || "접수대기"} />
                  <TypeBadge quote={q} />
                  <span className="text-xs text-slate-400">{q.quote_number}</span>
                </div>
                <p className="text-sm font-medium text-slate-900 truncate">
                  {inquiry ? q.contact_name : `${q.organization} - ${q.event_name}`}
                </p>
                <p className="text-xs text-slate-500">
                  {inquiry ? q.phone : `${q.contact_name} · ${formatDateTime(q.created_at)}`}
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
              <div className="border-t border-slate-100 px-3 py-3 space-y-3 bg-slate-50/30">
                {/* 연락처 */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-400">담당자</span>
                    <p className="text-slate-900">{q.contact_name}</p>
                  </div>
                  {!inquiry && (
                    <div>
                      <span className="text-xs text-slate-400">소속</span>
                      <p className="text-slate-900">{q.organization}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-slate-400">전화</span>
                    <p className="text-slate-900">{q.phone}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">이메일</span>
                    <p className="text-slate-900 truncate">{q.email}</p>
                  </div>
                  {q.department && (
                    <div>
                      <span className="text-xs text-slate-400">부서</span>
                      <p className="text-slate-900">{q.department}</p>
                    </div>
                  )}
                </div>

                {/* 행사 정보 (견적일 때만) */}
                {!inquiry && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-slate-400">행사명</span>
                      <p className="text-slate-900">{q.event_name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">행사일</span>
                      <p className="text-slate-900">{formatEventDate(q.event_date)}</p>
                    </div>
                    {q.event_venue && (
                      <div>
                        <span className="text-xs text-slate-400">장소</span>
                        <p className="text-slate-900">{q.event_venue}</p>
                      </div>
                    )}
                    {q.event_type && (
                      <div>
                        <span className="text-xs text-slate-400">행사유형</span>
                        <p className="text-slate-900">{q.event_type}</p>
                      </div>
                    )}
                    {q.attendees && (
                      <div>
                        <span className="text-xs text-slate-400">참석인원</span>
                        <p className="text-slate-900">{q.attendees}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 견적 항목 (견적일 때만) */}
                {!inquiry && q.cart_items.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 mb-1 block">견적 항목</span>
                    <div className="bg-white rounded-md p-2.5 space-y-1 border border-slate-100">
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
                      <div className="border-t border-slate-100 pt-1 mt-1 flex justify-between font-medium text-sm">
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
                    <span className="text-xs text-slate-400">고객 메모</span>
                    <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{q.memo}</p>
                  </div>
                )}

                {/* 내부 메모 */}
                <NotesSection quoteId={q.id} />

                {/* 상태 변경 */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">상태 변경:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {STATUS_OPTIONS.map((s) => {
                      const isCurrent = (q.status || "접수대기") === s;
                      return (
                        <button
                          key={s}
                          onClick={() => !isCurrent && handleStatusChange(q.id, s)}
                          disabled={isCurrent || updatingId === q.id}
                          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                            isCurrent
                              ? "bg-slate-900 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
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
