"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ImageIcon, MessageSquare, Eye, EyeOff, Loader2 } from "lucide-react";

interface PortfolioRow {
  id: string;
  title: string;
  event_type: string;
  year: number;
  venue: string;
  is_visible: boolean;
  slug?: string;
}

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPortfolios(data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/portfolio/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPortfolios((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        alert("삭제에 실패했습니다");
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">총 {portfolios.length}개</p>
        <Link href="/admin/portfolio/new" className="btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5" />
          새 포트폴리오
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400">불러오는 중...</div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400 mb-3">등록된 포트폴리오가 없습니다</p>
          <Link href="/admin/portfolio/new" className="btn-primary btn-sm">
            첫 포트폴리오 등록
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-4 py-3 font-medium text-slate-500">행사명</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-20">유형</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-16">연도</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-16">공개</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-32">관리</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/portfolio/${p.id}/edit`}
                      className="text-slate-900 hover:text-primary font-medium"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">{p.venue}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.event_type}</td>
                  <td className="px-4 py-3 text-slate-500">{p.year}</td>
                  <td className="px-4 py-3">
                    {p.is_visible ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-300" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => router.push(`/admin/portfolio/${p.id}/edit`)}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="수정"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/portfolio/${p.id}/media`)}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="사진 관리"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/portfolio/${p.id}/reviews`)}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="후기 관리"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold">행사 삭제</h2>
            </div>
            <p className="text-gray-600 mb-2">
              <strong>&ldquo;{deleteTarget.title}&rdquo;</strong> 행사를
              삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              이 행사의 모든 사진과 후기가 함께 삭제됩니다. 이 작업은 되돌릴 수
              없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
