"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, BadgeCheck, UserRound, BookOpen } from "lucide-react";
import type { Lecturer } from "@/types";
import { catBadge, catLabel } from "@/lib/lecturerMeta";

const ALL = "전체";

function LecturerCard({ l }: { l: Lecturer }) {
  const badge = catBadge(l.category);
  return (
    <Link
      href={`/lecturers/${l.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-card transition hover:shadow-float"
    >
      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
        {l.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.coverUrl} alt={l.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <UserRound className="h-10 w-10 text-white/60" />
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge}`}>
          {catLabel(l.category)}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-teal-600">
          <BadgeCheck className="h-3 w-3" />
          협업
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-[15px] font-bold text-slate-900">{l.name}</h3>
        {l.lectureTitle ? (
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-slate-500">{l.lectureTitle}</p>
        ) : (
          <p className="mt-1 text-[12.5px] text-slate-400">강의 주제 준비 중</p>
        )}
        {(l.career?.[0] || l.books?.[0]) && (
          <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[12px] text-slate-500">
            {l.books?.length ? (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-300" />
                저서 {l.books.length}
              </span>
            ) : null}
            <span className="ml-auto line-clamp-1 truncate text-slate-400">{l.career?.[0] ?? ""}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function FilterGroup({
  title,
  options,
  active,
  onPick,
  counts,
}: {
  title: string;
  options: string[];
  active: string;
  onPick: (v: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="px-1.5 text-[12px] font-semibold text-slate-800">{title}</p>
      <div className="mt-1.5 ml-2 flex flex-col gap-px border-l border-slate-200 pl-3">
        {[ALL, ...options].map((opt) => {
          const on = active === opt;
          return (
            <button
              key={opt}
              onClick={() => onPick(opt)}
              className={
                on
                  ? "relative flex items-center justify-between rounded-md bg-primary-50 px-2.5 py-[7px] text-left text-[13px] font-medium text-primary-700 before:absolute before:-left-[13px] before:h-4 before:w-[2px] before:rounded-full before:bg-primary"
                  : "flex items-center justify-between rounded-md px-2.5 py-[7px] text-left text-[13px] text-slate-500 hover:bg-slate-100/60"
              }
            >
              <span>{opt}</span>
              {counts && counts[opt] != null ? (
                <span className="text-[11px] tabular-nums">{counts[opt]}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function LecturersClient({ lecturers }: { lecturers: Lecturer[] }) {
  const [cat, setCat] = useState(ALL);
  const [query, setQuery] = useState("");

  const cats = useMemo(
    () => Array.from(new Set(lecturers.map((l) => l.category).filter((c): c is string => !!c))).sort(),
    [lecturers]
  );
  const catCounts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: lecturers.length };
    for (const l of lecturers) if (l.category) c[l.category] = (c[l.category] ?? 0) + 1;
    return c;
  }, [lecturers]);

  const filtered = useMemo(() => {
    return lecturers.filter((l) => {
      if (cat !== ALL && l.category !== cat) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = [l.name, l.lectureTitle ?? "", l.category ?? "", (l.career ?? []).join(" ")].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [lecturers, cat, query]);

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-content px-5 py-9 md:px-8 md:py-12">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600">홈</Link>
            <span>/</span>
            <Link href="/guide" className="hover:text-slate-600">가이드</Link>
            <span>/</span>
            <span className="text-slate-600">강사 섭외</span>
          </nav>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">LECTURER POOL</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
                파란이 협업·검증한 강사 풀
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                교육·행사 현장에서 직접 검증한 강사 데이터. 분야별로 강사를 찾아 강의 주제·약력을 확인하고, 섭외·일정 조율까지 파란컴퍼니가 대행합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:w-72">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="강사명·주제·분야 검색"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="font-display text-xl font-bold tabular-nums text-slate-900">{lecturers.length}</span>{" "}
              <span className="text-slate-500">검증 강사</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <BadgeCheck className="h-4 w-4 text-teal-500" />전 강사 협업 검증
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto flex max-w-content gap-8 px-5 py-8 md:px-8">
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-[72px]">
            <FilterGroup title="분야" options={cats} active={cat} onPick={setCat} counts={catCounts} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {/* 모바일 분야 칩 */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden">
            {[ALL, ...cats].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  cat === c
                    ? "shrink-0 rounded-full bg-slate-900 px-3.5 py-1.5 text-[13px] font-medium text-white"
                    : "shrink-0 rounded-full bg-slate-100 px-3.5 py-1.5 text-[13px] font-medium text-slate-500"
                }
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{filtered.length}명</span> 강사
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <UserRound className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                {lecturers.length === 0 ? "강사 정보를 준비 중입니다." : "조건에 맞는 강사가 없습니다."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => (
                <LecturerCard key={l.id} l={l} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 리드 CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-content px-5 py-12 md:px-8">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#091041] px-8 py-9 text-center md:flex-row md:text-left">
            <div>
              <h3 className="font-display text-xl font-bold text-white md:text-2xl">강사 섭외, 파란이 매칭해드립니다</h3>
              <p className="mt-1.5 text-sm text-white/60">주제·예산·일정만 알려주시면 검증된 강사 풀에서 최적 후보를 골라 섭외·조율까지 대행합니다.</p>
            </div>
            <Link
              href="/#contact"
              className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-blue-500"
            >
              강사 추천 받기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
