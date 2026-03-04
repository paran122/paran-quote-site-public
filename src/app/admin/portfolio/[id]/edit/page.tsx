"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PortfolioForm from "@/components/admin/portfolio/PortfolioForm";

interface PortfolioData {
  id: string;
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

export default function EditPortfolioPage() {
  const params = useParams();
  const id = params.id as string;
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/portfolio/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("포트폴리오를 찾을 수 없습니다");
        return res.json();
      })
      .then(setPortfolio)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-sm text-slate-400 py-12 text-center">불러오는 중...</div>;
  }

  if (error || !portfolio) {
    return (
      <div className="text-sm text-red-500 py-12 text-center">
        {error || "포트폴리오를 찾을 수 없습니다"}
      </div>
    );
  }

  return <PortfolioForm portfolio={portfolio} />;
}
