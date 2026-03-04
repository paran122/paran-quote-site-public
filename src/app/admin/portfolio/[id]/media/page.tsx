"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MediaUploader from "@/components/admin/portfolio/MediaUploader";

interface MediaItem {
  id: string;
  portfolio_id: string;
  event_slug: string;
  type: string;
  label: string;
  url: string;
  sort_order: number;
}

interface PortfolioInfo {
  id: string;
  title: string;
  slug?: string;
}

export default function PortfolioMediaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/portfolio/${id}`).then((r) => r.json()),
      fetch(`/api/admin/portfolio/${id}/media`).then((r) => r.json()),
    ])
      .then(([pData, mData]) => {
        setPortfolio(pData);
        if (Array.isArray(mData)) setMedia(mData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-sm text-slate-400 py-12 text-center">불러오는 중...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/portfolio")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          목록
        </button>
        {portfolio && (
          <h2 className="text-sm font-medium text-slate-900">
            {portfolio.title} - 사진 관리
          </h2>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <MediaUploader
          portfolioId={id}
          eventSlug={portfolio?.slug || id}
          media={media}
          onMediaChange={setMedia}
        />
      </div>
    </div>
  );
}
