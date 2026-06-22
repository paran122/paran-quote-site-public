"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Home,
  UserRound,
  Tag,
  Presentation,
  BookOpen,
  Camera,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Lecturer } from "@/types";
import { catBadge, catLabel } from "@/lib/lecturerMeta";

export default function LecturerDetailClient({
  lecturer: l,
  faq = [],
}: {
  lecturer: Lecturer;
  faq?: { q: string; a: string }[];
}) {
  const badge = catBadge(l.category);
  const gallery = l.images ?? [];
  const cover = l.coverUrl ?? gallery[0]?.url ?? null;
  const career = l.career ?? [];
  const books = l.books ?? [];
  const topics = (l.lectureTitle ?? "").split(",").map((t) => t.trim()).filter(Boolean);

  // 라이트박스
  const [lbIdx, setLbIdx] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const close = useCallback(() => setLbIdx(null), []);
  const go = useCallback(
    (d: number) => setLbIdx((i) => (i == null ? i : (i + d + gallery.length) % gallery.length)),
    [gallery.length]
  );
  useEffect(() => {
    if (lbIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lbIdx, close, go]);

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[960px] px-6 py-8">
        {/* 브레드크럼 */}
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-slate-400">
          <Link href="/" className="transition-colors hover:text-slate-600"><Home size={13} /></Link>
          <span>/</span>
          <Link href="/guide" className="transition-colors hover:text-slate-600">가이드</Link>
          <span>/</span>
          <Link href="/lecturers" className="transition-colors hover:text-slate-600">명사 정보</Link>
          <span>/</span>
          <span className="text-slate-600">{l.name}</span>
        </nav>

        {/* 헤더 */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge}`}>{catLabel(l.category)}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{l.name}</h1>
        </div>

        {/* 히어로 */}
        <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[10px] bg-slate-100">
          {cover ? (
            <button type="button" onClick={() => gallery.length && setLbIdx(0)} className="h-full w-full cursor-zoom-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={l.name} className="h-full w-full object-cover" />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center"><UserRound className="h-8 w-8 text-slate-300" /></div>
          )}
          {gallery.length > 0 && (
            <button
              type="button"
              onClick={() => setLbIdx(0)}
              className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-[12px] font-medium text-white"
            >
              <Camera size={13} />{gallery.length}
            </button>
          )}
        </div>

        {/* 한눈에 보기 */}
        <div className="mb-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-subtle sm:p-6">
          <h2 className="mb-4 text-[14px] font-semibold text-slate-800">한눈에 보기</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Fact icon={<Tag size={15} />} label="분야" value={catLabel(l.category)} />
            <Fact icon={<Presentation size={15} />} label="추천 강의" value={l.lectureTitle ?? "—"} />
            <Fact icon={<UserRound size={15} />} label="약력" value={career.length ? `${career.length}건` : "—"} />
            <Fact icon={<BookOpen size={15} />} label="강의 이력" value={books.length ? `${books.length}건` : "—"} />
          </div>
        </div>

        {/* 강의 주제 — 문장 형태 */}
        {topics.length > 0 && (
          <section className="mb-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-subtle sm:p-6">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">강의 주제</h2>
            <p className="text-[15px] leading-[1.7] text-slate-600">{topics.join(", ")}</p>
          </section>
        )}

        {/* 강의 소개 */}
        {l.bio && (
          <section className="mb-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-subtle sm:p-6">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">강의 소개</h2>
            <p className="whitespace-pre-line text-[16px] leading-[1.8] text-slate-600">{l.bio}</p>
          </section>
        )}

        {/* 주요 약력 */}
        {career.length > 0 && (
          <section className="mb-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-subtle sm:p-6">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">주요 약력</h2>
            <ul className="space-y-2.5">
              {career.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 강의 이력 (books 컬럼 재활용) */}
        {books.length > 0 && (
          <section className="mb-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-subtle sm:p-6">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">강의 이력</h2>
            <ul className="space-y-2.5">
              {books.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] text-slate-600">
                  <span className="mt-0.5 shrink-0 text-slate-400"><BookOpen size={15} /></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 자주 묻는 질문 (화면 표시 + JSON-LD FAQPage와 동일) */}
        {faq.length > 0 && (
          <section className="mb-5 rounded-[12px] border border-slate-200 bg-white p-5 shadow-subtle sm:p-6">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">자주 묻는 질문</h2>
            <div className="divide-y divide-slate-100 overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50/40">
              {faq.map((f, i) => (
                <div key={i} className="px-4 py-3.5">
                  <p className="text-[14px] font-semibold text-slate-800">Q. {f.q}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 하단 CTA */}
        <div className="mt-2 flex flex-col items-start justify-between gap-3 border-t border-slate-200 py-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[15px] font-semibold text-slate-800">{l.name} 강사 섭외를 고려 중이신가요?</p>
            <p className="mt-0.5 text-[13px] text-slate-400">섭외·일정 조율·행사 운영까지 파란컴퍼니가 함께합니다.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/lecturers" className="btn-ghost btn-md">목록으로</Link>
            <Link href="/#contact" className="btn-primary btn-md">강의 문의하기</Link>
          </div>
        </div>

        {/* 내부 링크 배너 */}
        <Link
          href="/lecturers"
          className="group mb-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">다른 분야 강사도 찾고 계신가요?</p>
            <p className="mt-1 text-[13px] text-slate-500">분야별 강사 정보를 둘러보세요</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            강사 목록<ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {/* 라이트박스 */}
      {lbIdx != null && gallery[lbIdx] && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-slate-950/95 backdrop-blur-md" onClick={close}>
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="max-w-[55%] truncate text-[13px] font-medium">{gallery[lbIdx].caption ?? l.name}</span>
            <span className="text-[13px] font-medium tabular-nums">{lbIdx + 1} / {gallery.length}</span>
            <button type="button" onClick={close} className="rounded-full p-1 hover:bg-white/10" aria-label="닫기"><X className="h-6 w-6" /></button>
          </div>
          <div
            className="flex flex-1 items-center justify-center px-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current == null || gallery.length < 2) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }}
          >
            {gallery.length > 1 && (
              <button type="button" onClick={() => go(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 hover:bg-black/60" aria-label="이전"><ChevronLeft className="h-5 w-5 text-white" /></button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[lbIdx].url} alt={gallery[lbIdx].caption ?? l.name} className="mx-2 max-h-[78vh] max-w-full rounded-[8px] object-contain" />
            {gallery.length > 1 && (
              <button type="button" onClick={() => go(1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 hover:bg-black/60" aria-label="다음"><ChevronRight className="h-5 w-5 text-white" /></button>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="scrollbar-hide flex gap-1.5 overflow-x-auto px-4 py-3" onClick={(e) => e.stopPropagation()}>
              {gallery.map((img, i) => (
                <button key={i} type="button" onClick={() => setLbIdx(i)} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className={`h-12 w-16 rounded-[6px] object-cover transition-opacity ${i === lbIdx ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        <p className="truncate text-[13px] text-slate-700">{value}</p>
      </div>
    </div>
  );
}
