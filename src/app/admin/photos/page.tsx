"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Portfolio, PortfolioMedia } from "@/types";
import {
  ChevronDown,
  ImageIcon,
  Loader2,
  Check,
  ExternalLink,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface SelectableMedia extends PortfolioMedia {
  selected: boolean;
}

type ModalState =
  | { type: "thumbnail"; url: string }
  | { type: "delete" }
  | null;

export default function AdminWorkPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [mediaByPortfolio, setMediaByPortfolio] = useState<
    Record<string, SelectableMedia[]>
  >({});
  const [activePortfolio, setActivePortfolio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  // 데이터 로드
  useEffect(() => {
    async function load() {
      if (!supabase) return;
      try {
        const [pRes, mRes] = await Promise.all([
          supabase.from("portfolios").select("*").order("sort_order"),
          supabase
            .from("portfolio_media")
            .select("*")
            .in("type", ["gallery", "photo"])
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

        const mediaRows: SelectableMedia[] = (mRes.data ?? []).map((r) => ({
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

        const grouped: Record<string, SelectableMedia[]> = {};
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
    (e: React.MouseEvent, mediaId: string) => {
      e.stopPropagation();
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
          [activePortfolio]: items.map((m) => ({ ...m, selected: select })),
        };
      });
    },
    [activePortfolio]
  );

  // 썸네일 설정
  const handleSetThumbnail = useCallback(
    async (imageUrl: string) => {
      if (!activePortfolio) return;
      setSaving(true);
      setModal(null);

      try {
        const res = await fetch(`/api/admin/portfolio/${activePortfolio}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: imageUrl }),
        });

        if (!res.ok) {
          const text = await res.text();
          let errorMsg = "썸네일 설정 실패";
          try {
            const result = JSON.parse(text);
            errorMsg = result.error || errorMsg;
          } catch {
            // HTML 응답 등 JSON 파싱 실패
          }
          throw new Error(errorMsg);
        }

        setPortfolios((prev) =>
          prev.map((p) =>
            p.id === activePortfolio ? { ...p, imageUrl } : p
          )
        );
        alert("썸네일이 변경되었습니다.");
      } catch (err) {
        console.error("Thumbnail update failed:", err);
        alert(
          `썸네일 설정 중 오류: ${
            err instanceof Error ? err.message : "알 수 없는 오류"
          }`
        );
      } finally {
        setSaving(false);
      }
    },
    [activePortfolio]
  );

  // 사진 삭제
  const handleDelete = useCallback(async () => {
    setDeleting(true);
    setModal(null);

    try {
      const toDelete = Object.values(mediaByPortfolio)
        .flat()
        .filter((m) => m.selected);

      if (toDelete.length === 0) return;

      const ids = toDelete.map((m) => m.id);
      const storagePaths = toDelete
        .map((m) => {
          const match = m.url.match(
            /\/storage\/v1\/object\/public\/portfolio\/(.+)/
          );
          return match ? match[1] : null;
        })
        .filter((p): p is string => p !== null);

      const res = await fetch("/api/admin/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, storagePaths }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "삭제 실패");
      }

      const deletedIds = new Set(ids);
      setMediaByPortfolio((prev) => {
        const next: Record<string, SelectableMedia[]> = {};
        for (const [pid, items] of Object.entries(prev)) {
          next[pid] = items.filter((m) => !deletedIds.has(m.id));
        }
        return next;
      });

      alert(`${ids.length}장 삭제 완료!`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(
        `삭제 중 오류: ${
          err instanceof Error ? err.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setDeleting(false);
    }
  }, [mediaByPortfolio]);

  // 현재 포트폴리오
  const activePortfolioData = portfolios.find((p) => p.id === activePortfolio);
  const currentMedia = activePortfolio
    ? (mediaByPortfolio[activePortfolio] ?? [])
    : [];
  const selectedCount = currentMedia.filter((m) => m.selected).length;

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Work 페이지 관리</h1>
        <Link
          href="/work"
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="w-4 h-4" />
          /work 페이지 보기
        </Link>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        이미지 클릭으로 썸네일을 설정하고, 체크박스로 사진을 선택하여 삭제할 수
        있습니다.
      </p>

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
                ? `${activePortfolioData.title} (${currentMedia.length}장)`
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {count}장
                        </span>
                        {p.imageUrl && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                            썸네일 설정됨
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

        {/* 현재 썸네일 미리보기 */}
        {activePortfolioData?.imageUrl && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePortfolioData.imageUrl}
              alt="현재 썸네일"
              className="w-8 h-8 rounded object-cover"
            />
            <span className="text-sm text-green-700">현재 썸네일</span>
          </div>
        )}

        {/* 오른쪽 도구들 */}
        <div className="flex items-center gap-2 ml-auto">
          {currentMedia.length > 0 && (
            <>
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
            </>
          )}
          {activePortfolio && (
            <Link
              href={`/admin/portfolio/${activePortfolio}/media`}
              className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              사진 추가
            </Link>
          )}
        </div>
      </div>

      {/* 선택 삭제 바 */}
      {selectedCount > 0 && (
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-sm font-medium text-red-700">
            {selectedCount}개 선택됨
          </span>
          <button
            onClick={() => setModal({ type: "delete" })}
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

      {/* 이미지 그리드 */}
      {currentMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ImageIcon className="w-12 h-12 mb-3" />
          <p>
            {activePortfolio
              ? "이 행사에 등록된 이미지가 없습니다"
              : "행사를 선택하세요"}
          </p>
          {activePortfolio && (
            <Link
              href={`/admin/portfolio/${activePortfolio}/media`}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              사진 추가하러 가기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {currentMedia.map((m) => {
            const isCurrent = activePortfolioData?.imageUrl === m.url;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (isCurrent) return;
                  setModal({ type: "thumbnail", url: m.url });
                }}
                disabled={saving}
                className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  m.selected
                    ? "border-red-500 ring-2 ring-red-200"
                    : isCurrent
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-transparent hover:border-blue-300"
                } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.label}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                {/* 호버 오버레이 */}
                {!isCurrent && !m.selected && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/60 px-2 py-1 rounded transition-opacity">
                      썸네일로 설정
                    </span>
                  </div>
                )}

                {/* 선택 오버레이 */}
                {m.selected && (
                  <div className="absolute inset-0 bg-red-500/20" />
                )}

                {/* 체크박스 (선택용) */}
                <div
                  onClick={(e) => toggleSelect(e, m.id)}
                  className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    m.selected
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-transparent group-hover:text-gray-400 border border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>

                {/* 현재 썸네일 뱃지 */}
                {isCurrent && (
                  <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                    <Check className="w-3 h-3" />
                    썸네일
                  </div>
                )}

                {/* 유형 배지 */}
                <div className="absolute bottom-1 right-1">
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                      m.type === "gallery"
                        ? "bg-blue-500/80 text-white"
                        : "bg-gray-500/80 text-white"
                    }`}
                  >
                    {m.type === "gallery" ? "갤러리" : "사진"}
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
            );
          })}
        </div>
      )}

      {/* 썸네일 설정 확인 모달 */}
      {modal?.type === "thumbnail" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">썸네일 변경</h2>
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modal.url}
                alt="선택한 이미지"
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              이 이미지를 <strong>{activePortfolioData?.title}</strong>의
              썸네일로 설정하시겠습니까?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleSetThumbnail(modal.url)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                설정하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {modal?.type === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold">사진 삭제</h2>
            </div>
            <p className="text-gray-600 mb-2">
              선택한{" "}
              <strong className="text-red-600">{selectedCount}장</strong>의
              사진을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Storage 파일과 DB 레코드가 모두 삭제됩니다. 이 작업은 되돌릴 수
              없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(null)}
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
