"use client";

import { useState } from "react";
import { Plus, Trash2, Star } from "lucide-react";

interface Review {
  id: string;
  portfolio_id: string;
  reviewer_name: string;
  reviewer_role?: string;
  organization?: string;
  content: string;
  rating: number;
}

interface ReviewFormProps {
  portfolioId: string;
  reviews: Review[];
  onReviewsChange: (reviews: Review[]) => void;
}

export default function ReviewForm({ portfolioId, reviews, onReviewsChange }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [org, setOrg] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name || !content) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/portfolio/${portfolioId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer_name: name,
          reviewer_role: role || null,
          organization: org || null,
          content,
          rating,
        }),
      });

      if (!res.ok) throw new Error("저장 실패");
      const data = await res.json();
      onReviewsChange([...reviews, data]);

      setName("");
      setRole("");
      setOrg("");
      setContent("");
      setRating(5);
    } catch {
      alert("후기 추가에 실패했습니다");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("이 후기를 삭제하시겠습니까?")) return;

    try {
      await fetch(`/api/admin/portfolio/${portfolioId}/reviews`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      onReviewsChange(reviews.filter((r) => r.id !== reviewId));
    } catch {
      alert("삭제 실패");
    }
  }

  return (
    <div className="space-y-4">
      {/* 기존 후기 목록 */}
      {reviews.length > 0 && (
        <div className="space-y-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex items-start justify-between bg-white border border-slate-200 rounded-sm p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{review.reviewer_name}</span>
                  {review.organization && (
                    <span className="text-xs text-slate-400">{review.organization}</span>
                  )}
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{review.content}</p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="p-1 text-slate-400 hover:text-red-500 shrink-0 ml-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 새 후기 입력 */}
      <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-3">
        <p className="text-sm font-medium text-slate-700">후기 추가</p>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 *"
            className="text-sm border border-slate-200 rounded-sm px-3 py-1.5
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="직책"
            className="text-sm border border-slate-200 rounded-sm px-3 py-1.5
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
          <input
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="소속"
            className="text-sm border border-slate-200 rounded-sm px-3 py-1.5
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="후기 내용 *"
          rows={2}
          className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
            focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm text-slate-500 mr-1">평점</span>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className="p-0.5"
              >
                <Star
                  className={`w-4 h-4 ${
                    v <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !name || !content}
            className="btn-primary btn-sm disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {saving ? "추가 중..." : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}
