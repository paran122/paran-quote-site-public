"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Portfolio, PortfolioMedia } from "@/types";
import { Check, Trash2, ChevronDown, ImageIcon, Loader2 } from "lucide-react";

interface MediaItem extends PortfolioMedia {
  selected: boolean;
}

export default function AdminPhotosPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [mediaByPortfolio, setMediaByPortfolio] = useState<
    Record<string, MediaItem[]>
  >({});
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "gallery" | "photo" | "video">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 데이터 로드
  useEffect(() => {
    async function load() {
      if (!supabase) return;
      try {
        const [pRes, mRes] = await Promise.all([
          supabase
            .from("portfolios")
            .select("*")
            .order("sort_order"),
          supabase
            .from("portfolio_media")
            .select("*")
            .order("sort_order"),
        ]);

        const portfolioRows = (pRes.data ?? []).map((r) => ({
          id: r.id as string,
          title: r.title as string,
          eventType: r.event_type as string,
          year: r.year as number,
          venue: r.venue as string,
          emoji: r.emoji as string,
          description: r.description as string | undefined,
          imageUrl: r.image_url as string | undefined,
          tags: r.tags as string[],
          gradientType: r.gradient_type as string,
          isVisible: r.is_visible as boolean,
          slug: r.slug as string | undefined,
          client: r.client as string | undefined,
          eventDate: r.event_date as string | undefined,
        }));

        const mediaRows = (mRes.data ?? []).map((r) => ({
          id: r.id as string,
          portfolioId: r.portfolio_id as string,
          eventSlug: r.event_slug as string,
          type: r.type as "gallery" | "photo" | "video",
          label: r.label as string,
          url: r.url as string,
          sortOrder: r.sort_order as number,
          session: r.session as number | null,
          selected: false,
        }));

        // 포트폴리오별로 그룹
        const grouped: Record<string, MediaItem[]> = {};
        for (const m of mediaRows) {
          if (!grouped[m.portfolioId]) grouped[m.portfolioId] = [];
          grouped[m.portfolioId].push(m);
        }

        setPortfolios(portfolioRows);
        setMediaByPortfolio(grouped);
        if (portfolioRows.length > 0) {
          setActivePortfolio(portfolioRows[0].id);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 사진 선택 토글
  const toggleSelect = useCallback(
    (mediaId: string) => {
      if (!activePortfolio) return;
      setMediaByPortfolio((prev) => {
        const items = prev[activePortfolio] ?? [];
        return {
          ...prev,
          [activePortfolio]: items.map((m) =>
            m.id === mediaId ? { ...m, selected: !m.selected } : m
          ),
        };
      });
    },
    [activePortfolio]
  );

  // 전체 선택/해제
  const selectAll = useCallback(
    (select: boolean) => {
      if (!activePortfolio) return;
      setMediaByPortfolio((prev) => {
        const items = prev[activePortfolio] ?? [];
        return {
          ...prev,
          [activePortfolio]: items.map((m) => {
            if (typeFilter !== "all" && m.type !== typeFilter) return m;
            return { ...m, selected: select };
          }),
        };
      });
    },
    [activePortfolio, typeFilter]
  );

  // 현재 보이는 미디어
  const currentMedia = activePortfolio
    ? (mediaByPortfolio[activePortfolio] ?? []).filter(
        (m) => typeFilter === "all" || m.type === typeFilter
      )
    : [];

  const selectedCount = currentMedia.filter((m) => m.selected).length;
  const totalSelected = Object.values(mediaByPortfolio)
    .flat()
    .filter((m) => m.selected).length;

  // 삭제 실행 (서버 API 경유 - service role key 사용)
  const handleDelete = async () => {
    setDeleting(true);
    setShowConfirm(false);

    try {
      // 모든 포트폴리오에서 선택된 항목 수집
      const toDelete: MediaItem[] = Object.values(mediaByPortfolio)
        .flat()
        .filter((m) => m.selected);

      if (toDelete.length === 0) return;

      const ids = toDelete.map((m) => m.id);
      const storagePaths = toDelete
        .map((m) => {
          const match = m.url.match(/\/storage\/v1\/object\/public\/portfolio\/(.+)/);
          return match ? match[1] : null;
        })
        .filter((p): p is string => p !== null);

      // 서버 API로 삭제 요청
      const res = await fetch("/api/admin/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, storagePaths }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "삭제 실패");
      }

      if (!result.success) {
        throw new Error(result.error || "삭제 처리 중 오류 발생");
      }

      // 상태 업데이트 - 삭제된 항목 제거
      const deletedIds = new Set(ids);
      setMediaByPortfolio((prev) => {
        const next: Record<string, MediaItem[]> = {};
        for (const [pid, items] of Object.entries(prev)) {
          next[pid] = items.filter((m) => !deletedIds.has(m.id));
        }
        return next;
      });

      alert(`${ids.length}장 삭제 완료!`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(`삭제 중 오류: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    } finally {
      setDeleting(false);
    }
  };

  // 현재 포트폴리오 정보
  const activePortfolioData = portfolios.find((p) => p.id === activePortfolio);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">사진 관리</h1>

      {/* 상단 컨트롤 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* 행사 선택 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[280px] justify-between"
          >
            <span className="truncate">
              {activePortfolioData
                ? `${activePortfolioData.title} (${
                    (mediaByPortfolio[activePortfolio!] ?? []).length
                  }장)`
                : "행사를 선택하세요"}
            </span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-[360px] bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-[400px] overflow-y-auto">
                {portfolios.map((p) => {
                  const count = (mediaByPortfolio[p.id] ?? []).length;
                  const selectedInPortfolio = (
                    mediaByPortfolio[p.id] ?? []
                  ).filter((m) => m.selected).length;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePortfolio(p.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between ${
                        p.id === activePortfolio ? "bg-blue-50" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium text-sm">{p.title}</div>
                        <div className="text-xs text-gray-500">
                          {p.year} / {p.venue}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          {count}장
                        </span>
                        {selectedInPortfolio > 0 && (
                          <span className="ml-2 text-xs text-red-500 font-medium">
                            {selectedInPortfolio}개 선택
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* 유형 필터 */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(
            [
              { key: "all", label: "전체" },
              { key: "gallery", label: "갤러리" },
              { key: "photo", label: "현장사진" },
              { key: "video", label: "영상" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                typeFilter === key
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 선택 도구 */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => selectAll(true)}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            전체 선택
          </button>
          <button
            onClick={() => selectAll(false)}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            선택 해제
          </button>
        </div>
      </div>

      {/* 선택 상태 바 */}
      {totalSelected > 0 && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-sm font-medium text-red-700">
            {totalSelected}개 선택됨
            {selectedCount !== totalSelected && (
              <span className="text-red-400 ml-1">
                (현재 행사: {selectedCount}개)
              </span>
            )}
          </span>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            선택 삭제
          </button>
        </div>
      )}

      {/* 사진 격자 */}
      {currentMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ImageIcon className="w-12 h-12 mb-3" />
          <p>
            {activePortfolio
              ? "이 행사에 등록된 미디어가 없습니다"
              : "행사를 선택하세요"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {currentMedia.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleSelect(m.id)}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                m.selected
                  ? "border-red-500 ring-2 ring-red-200"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              {/* 썸네일 */}
              {m.type === "video" ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-1">
                      <div className="w-0 h-0 border-l-[10px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                    </div>
                    <span className="text-white/60 text-xs">영상</span>
                  </div>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={m.url}
                  alt={m.label}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}

              {/* 선택 오버레이 */}
              <div
                className={`absolute inset-0 transition-all ${
                  m.selected
                    ? "bg-red-500/30"
                    : "bg-black/0 group-hover:bg-black/10"
                }`}
              />

              {/* 체크 표시 */}
              <div
                className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  m.selected
                    ? "bg-red-500 text-white"
                    : "bg-white/80 text-transparent group-hover:text-gray-400 border border-gray-300"
                }`}
              >
                <Check className="w-4 h-4" />
              </div>

              {/* 유형 배지 */}
              <div className="absolute bottom-1 right-1">
                <span
                  className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                    m.type === "gallery"
                      ? "bg-blue-500/80 text-white"
                      : m.type === "video"
                      ? "bg-purple-500/80 text-white"
                      : "bg-gray-500/80 text-white"
                  }`}
                >
                  {m.type === "gallery"
                    ? "갤러리"
                    : m.type === "video"
                    ? "영상"
                    : "사진"}
                </span>
              </div>

              {/* 세션 배지 */}
              {m.session && (
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-yellow-500/80 text-white font-medium">
                    {m.session}회차
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold">사진 삭제</h2>
            </div>
            <p className="text-gray-600 mb-2">
              선택한 <strong className="text-red-600">{totalSelected}장</strong>
              의 사진을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Storage 파일과 DB 레코드가 모두 삭제됩니다. 이 작업은 되돌릴 수
              없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
