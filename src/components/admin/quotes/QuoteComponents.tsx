"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ── 타입 ── */
export interface QuoteItem {
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

/* ── 상수 ── */
export const STATUS_OPTIONS = ["접수대기", "진행중", "완료", "취소"] as const;

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  "접수대기": { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  "접수": { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
  "진행중": { bg: "bg-blue-50", text: "text-blue-700", icon: Loader2 },
  "완료": { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
  "취소": { bg: "bg-slate-100", text: "text-slate-500", icon: XCircle },
};

/* ── 유틸 ── */
export function isInquiry(q: QuoteItem) {
  return q.event_name === "문의" || q.event_type === "문의";
}

export function formatDateTime(dateStr: string) {
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

/* ── 뱃지 컴포넌트 ── */
export function TypeBadge({ quote }: { quote: QuoteItem }) {
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

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE["접수대기"];
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

/* ── 내부 메모 ── */
export function NotesSection({ quoteId }: { quoteId: string }) {
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

/* ── 견적 상세 확장 패널 ── */
export function QuoteDetail({
  quote: q,
  updatingId,
  onStatusChange,
}: {
  quote: QuoteItem;
  updatingId: string | null;
  onStatusChange: (id: string, status: string) => void;
}) {
  const inquiry = isInquiry(q);

  return (
    <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/30">
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

      {/* 행사 정보 */}
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

      {/* 견적 항목 */}
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
                onClick={() => !isCurrent && onStatusChange(q.id, s)}
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
  );
}

/* ── 견적 요약 행 ── */
export function QuoteRow({
  quote: q,
  isExpanded,
  onToggle,
}: {
  quote: QuoteItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const inquiry = isInquiry(q);
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
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
  );
}
