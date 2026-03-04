"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReviewForm from "@/components/admin/portfolio/ReviewForm";

interface Review {
  id: string;
  portfolio_id: string;
  reviewer_name: string;
  reviewer_role?: string;
  organization?: string;
  content: string;
  rating: number;
}

export default function PortfolioReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/portfolio/${id}`).then((r) => r.json()),
      fetch(`/api/admin/portfolio/${id}/reviews`).then((r) => r.json()),
    ])
      .then(([pData, rData]) => {
        setTitle(pData?.title || "");
        if (Array.isArray(rData)) setReviews(rData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-sm text-slate-400 py-12 text-center">불러오는 중...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/portfolio")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          목록
        </button>
        <h2 className="text-sm font-medium text-slate-900">
          {title} - 후기 관리
        </h2>
      </div>

      <ReviewForm
        portfolioId={id}
        reviews={reviews}
        onReviewsChange={setReviews}
      />
    </div>
  );
}
