"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

interface PortfolioData {
  id?: string;
  title: string;
  event_type: string;
  year: number;
  venue: string;
  description?: string | null;
  tags?: string[];
  gradient_type?: string;
  is_visible?: boolean;
  slug?: string | null;
  client?: string | null;
  event_date?: string | null;
  deliverables?: string[] | null;
}

interface PortfolioFormProps {
  portfolio?: PortfolioData;
}

export default function PortfolioForm({ portfolio }: PortfolioFormProps) {
  const router = useRouter();
  const isEdit = Boolean(portfolio?.id);

  const [title, setTitle] = useState(portfolio?.title ?? "");
  const [eventType, setEventType] = useState(portfolio?.event_type ?? "");
  const [year, setYear] = useState(portfolio?.year ?? new Date().getFullYear());
  const [venue, setVenue] = useState(portfolio?.venue ?? "");
  const [description, setDescription] = useState(portfolio?.description ?? "");
  const [client, setClient] = useState(portfolio?.client ?? "");
  const [eventDate, setEventDate] = useState(portfolio?.event_date ?? "");
  const [tagsInput, setTagsInput] = useState(portfolio?.tags?.join(", ") ?? "");
  const [deliverablesInput, setDeliverablesInput] = useState(
    portfolio?.deliverables?.join(", ") ?? "",
  );
  const [isVisible, setIsVisible] = useState(portfolio?.is_visible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const deliverables = deliverablesInput.split(",").map((t) => t.trim()).filter(Boolean);

    const body = {
      title,
      event_type: eventType,
      year,
      venue,
      description: description || null,
      client: client || null,
      event_date: eventDate || null,
      tags,
      deliverables: deliverables.length > 0 ? deliverables : null,
      is_visible: isVisible,
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w가-힣-]/g, ""),
    };

    try {
      const url = isEdit
        ? `/api/admin/portfolio/${portfolio!.id}`
        : "/api/admin/portfolio";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "저장 실패");
      }

      router.push("/admin/portfolio");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/portfolio")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">행사명 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">행사 유형 *</label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="세미나, 컨퍼런스, 포럼 등"
              required
              className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">연도 *</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={2000}
              max={2100}
              required
              className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">장소 *</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">행사일</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">고객사(클라이언트)</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="해군본부, 서울시청 등"
            className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
              focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">태그 (쉼표 구분)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="세미나, 해군, 국방"
            className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">납품물 (쉼표 구분)</label>
          <input
            type="text"
            value={deliverablesInput}
            onChange={(e) => setDeliverablesInput(e.target.value)}
            placeholder="현수막, 포스터, 리플렛, 무대 세팅"
            className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span className="text-sm text-slate-700">공개</span>
        </label>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving || !title || !eventType || !venue}
            className="btn-primary btn-md disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "저장 중..." : isEdit ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
