"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Link2, ExternalLink, Pencil } from "lucide-react";
import {
  computeTotals,
  editableQuote,
  readRevisions,
  type QuoteLine,
  type QuoteRevision,
  type QuoteRow,
} from "@/lib/quote/view";

// 관리자 견적 수정: 품목·수량·단가를 고쳐 새 차수로 저장하고, 고객 링크에 바로 반영한다.

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface DraftLine {
  name: string;
  detail: string;
  qty: string;
  unit: string;
  unitPrice: string;
}

const toDraft = (line: QuoteLine): DraftLine => ({
  name: line.name,
  detail: line.detail,
  qty: String(line.qty),
  unit: line.unit,
  unitPrice: String(line.unitPrice),
});

const EMPTY_LINE: DraftLine = { name: "", detail: "", qty: "1", unit: "식", unitPrice: "0" };

const toNumber = (value: string) => {
  const n = Number(value.replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
};

export interface QuoteSaved {
  revision: QuoteRevision;
  total_amount: number;
}

export function QuoteLinkAndEdit({
  quote,
  linkPath,
  onSaved,
}: {
  quote: QuoteRow;
  linkPath: string | null;
  onSaved: (saved: QuoteSaved) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const revisions = readRevisions(quote);

  async function copyLink() {
    if (!linkPath) return;
    try {
      await navigator.clipboard.writeText(window.location.origin + linkPath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("아래 주소를 복사하세요", window.location.origin + linkPath);
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-xs text-slate-400 block">고객 견적 링크</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {linkPath ? (
          <>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Link2 className="w-3.5 h-3.5" />
              {copied ? "복사했습니다" : "링크 복사"}
            </button>
            <a
              href={linkPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              고객 화면 보기
            </a>
          </>
        ) : (
          <span className="text-xs text-slate-400">링크를 만들 수 없는 접수입니다</span>
        )}
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          {editing ? "수정 닫기" : "견적 수정"}
        </button>
      </div>

      {revisions.length > 0 && (
        <div className="bg-white rounded-md border border-slate-100 divide-y divide-slate-100">
          {[...revisions].reverse().map((r, i) => (
            <div key={r.rev} className="flex items-center justify-between px-2.5 py-1.5 text-sm">
              <span className="text-slate-700">
                {r.rev}차 견적
                {i === 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                    고객에게 보이는 견적
                  </span>
                )}
              </span>
              <span className="text-xs text-slate-400">{formatDate(r.at)}</span>
              <span className="text-slate-900 font-medium">{won(r.total)}</span>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <QuoteEditor
          quote={quote}
          onSaved={(saved) => {
            onSaved(saved);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

function QuoteEditor({
  quote,
  onSaved,
}: {
  quote: QuoteRow;
  onSaved: (saved: QuoteSaved) => void;
}) {
  const initial = useMemo(() => editableQuote(quote), [quote]);
  const [lines, setLines] = useState<DraftLine[]>(
    initial.lines.length ? initial.lines.map(toDraft) : [{ ...EMPTY_LINE }]
  );
  const [ship, setShip] = useState(String(initial.ship));
  const [notice, setNotice] = useState(initial.notice);
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const parsedLines: QuoteLine[] = lines.map((line) => ({
    name: line.name.trim(),
    detail: line.detail.trim(),
    qty: toNumber(line.qty),
    unit: line.unit.trim(),
    unitPrice: Math.round(toNumber(line.unitPrice)),
  }));
  const totals = computeTotals(parsedLines, Math.max(0, Math.round(toNumber(ship))));

  function update(index: number, patch: Partial<DraftLine>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  async function save() {
    if (saving) return;
    if (parsedLines.some((line) => !line.name || line.qty <= 0)) {
      setMessage("품목명과 수량을 확인해 주세요.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: parsedLines, ship: totals.ship, notice: notice.trim(), notify }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data?.error || "저장하지 못했습니다.");
        return;
      }
      if (notify) {
        const sent = [data?.notified?.email && "메일", data?.notified?.alimtalk && "알림톡"].filter(Boolean);
        alert(
          sent.length
            ? `${data.revision.rev}차 견적을 저장했습니다. 고객 알림 발송: ${sent.join(", ")}`
            : `${data.revision.rev}차 견적을 저장했습니다. 고객 알림은 발송되지 않았습니다.`
        );
      }
      onSaved({ revision: data.revision, total_amount: data.total_amount });
    } catch {
      setMessage("저장하지 못했습니다. 연결을 확인해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full text-sm px-2 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="bg-white rounded-md border border-slate-200 p-3 space-y-3">
      <p className="text-xs text-slate-500">
        {initial.rev > 0 ? `${initial.rev}차 견적을 고쳐 ${initial.rev + 1}차로 저장합니다.` : "접수 내용을 고쳐 1차 견적으로 저장합니다."}{" "}
        단가는 공급가(부가세 별도)로 넣습니다. 할인은 단가를 음수로 넣은 줄로 추가합니다.
      </p>

      <div className="space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="grid grid-cols-12 gap-1.5 items-start">
            <div className="col-span-12 sm:col-span-5 space-y-1">
              <input
                className={inputClass}
                value={line.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="품목명"
                maxLength={120}
                aria-label={`${i + 1}번 품목명`}
              />
              <input
                className={`${inputClass} text-xs`}
                value={line.detail}
                onChange={(e) => update(i, { detail: e.target.value })}
                placeholder="규격·내용 (선택)"
                maxLength={1000}
                aria-label={`${i + 1}번 규격·내용`}
              />
            </div>
            <input
              className={`${inputClass} col-span-3 sm:col-span-1 text-right`}
              value={line.qty}
              onChange={(e) => update(i, { qty: e.target.value })}
              inputMode="decimal"
              aria-label={`${i + 1}번 수량`}
            />
            <input
              className={`${inputClass} col-span-3 sm:col-span-1`}
              value={line.unit}
              onChange={(e) => update(i, { unit: e.target.value })}
              placeholder="단위"
              maxLength={10}
              aria-label={`${i + 1}번 단위`}
            />
            <input
              className={`${inputClass} col-span-6 sm:col-span-2 text-right`}
              value={line.unitPrice}
              onChange={(e) => update(i, { unitPrice: e.target.value })}
              inputMode="numeric"
              placeholder="단가(원)"
              aria-label={`${i + 1}번 단가`}
            />
            <div className="col-span-10 sm:col-span-2 text-right text-sm text-slate-900 py-1.5">
              {won(parsedLines[i].unitPrice * parsedLines[i].qty)}
            </div>
            <button
              type="button"
              onClick={() => setLines((prev) => (prev.length > 1 ? prev.filter((_, n) => n !== i) : prev))}
              disabled={lines.length <= 1}
              className="col-span-2 sm:col-span-1 justify-self-end p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30"
              title="줄 삭제"
              aria-label={`${i + 1}번 줄 삭제`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLines((prev) => [...prev, { ...EMPTY_LINE }])}
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          <Plus className="w-3.5 h-3.5" />줄 추가
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-500 space-y-1 block">
          배송비 (원, 부가세 없음)
          <input
            className={`${inputClass} text-right`}
            value={ship}
            onChange={(e) => setShip(e.target.value)}
            inputMode="numeric"
          />
        </label>
        <div className="text-sm space-y-0.5">
          <div className="flex justify-between text-slate-500"><span>공급가</span><span>{won(totals.supply)}</span></div>
          <div className="flex justify-between text-slate-500"><span>부가세 10%</span><span>{won(totals.vat)}</span></div>
          {totals.ship > 0 && (
            <div className="flex justify-between text-slate-500"><span>배송비</span><span>{won(totals.ship)}</span></div>
          )}
          <div className="flex justify-between font-semibold text-slate-900 border-t border-slate-100 pt-1">
            <span>합계 (부가세 포함)</span><span>{won(totals.total)}</span>
          </div>
        </div>
      </div>

      <label className="text-xs text-slate-500 space-y-1 block">
        고객에게 보이는 안내 글 (선택)
        <textarea
          className={`${inputClass} min-h-[72px]`}
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
          maxLength={2000}
          placeholder="예: 통화한 내용대로 현수막 크기를 5m로 바꾸고 설치비를 추가했습니다."
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="inline-flex items-center gap-1.5 text-sm text-slate-700">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          저장하면서 고객에게 알리기 (메일·알림톡)
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "저장하는 중..." : "새 차수로 저장"}
        </button>
      </div>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}
