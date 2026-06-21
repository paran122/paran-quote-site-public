"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, LayoutGrid, BadgeCheck, Building2 } from "lucide-react";
import type { Venue } from "@/types";
import { VENUE_TYPE_BADGE, CAP_BUCKETS, capBucket, typeLabel } from "@/lib/venueMeta";

const ALL = "전체";

function VenueCard({ v }: { v: Venue }) {
  const badge = VENUE_TYPE_BADGE[v.venueType ?? "etc"] ?? VENUE_TYPE_BADGE.etc;
  return (
    <Link
      href={`/venues/${v.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-card transition hover:shadow-float"
    >
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-teal-200 to-sky-300">
        {v.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.coverUrl} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <Building2 className="h-9 w-9 text-white/50" />
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge}`}>
          {typeLabel(v.venueType)}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-teal-600">
          <BadgeCheck className="h-3 w-3" />
          답사
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-[15px] font-bold text-slate-900">{v.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-[12px] text-slate-400">
          <MapPin className="h-3 w-3" />
          {v.region ?? v.addressApprox ?? "—"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-[12px] text-slate-500">
          {v.maxCapacity ? (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-300" />
              <span className="font-semibold tabular-nums text-slate-700">{v.maxCapacity.toLocaleString("ko-KR")}</span>명
            </span>
          ) : null}
          {v.hallCount ? (
            <span className="flex items-center gap-1">
              <LayoutGrid className="h-3.5 w-3.5 text-slate-300" />
              <span className="tabular-nums">{v.hallCount}</span>홀
            </span>
          ) : null}
          {v.eventFit?.[0] ? <span className="ml-auto truncate text-teal-600">{v.eventFit.slice(0, 2).join("·")}</span> : null}
        </div>
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
                  ? "relative flex items-center justify-between rounded-md bg-teal-50/80 px-2.5 py-[7px] text-left text-[13px] font-medium text-teal-700 before:absolute before:-left-[13px] before:h-4 before:w-[2px] before:rounded-full before:bg-teal-500"
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

export default function VenuesClient({ venues }: { venues: Venue[] }) {
  const [region, setRegion] = useState(ALL);
  const [vtype, setVtype] = useState(ALL);
  const [cap, setCap] = useState(ALL);
  const [query, setQuery] = useState("");

  const regions = useMemo(
    () => Array.from(new Set(venues.map((v) => v.region).filter((r): r is string => !!r))).sort(),
    [venues]
  );
  const types = useMemo(
    () => Array.from(new Set(venues.map((v) => v.venueType ?? "etc"))).sort(),
    [venues]
  );

  const regionCounts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: venues.length };
    for (const v of venues) if (v.region) c[v.region] = (c[v.region] ?? 0) + 1;
    return c;
  }, [venues]);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (region !== ALL && v.region !== region) return false;
      if (vtype !== ALL && typeLabel(v.venueType) !== vtype) return false;
      if (cap !== ALL && capBucket(v.maxCapacity) !== cap) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!v.name.toLowerCase().includes(q) && !(v.region ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [venues, region, vtype, cap, query]);

  const typeOptions = types.map((t) => typeLabel(t));

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
            <span className="text-slate-600">행사장 추천</span>
          </nav>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-teal-500">VENUE DATABASE</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
                파란이 직접 답사·검증한 행사장
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                행사 대행 현장에서 쌓은 행사장 데이터. 지역·인원·행사 유형으로 후보를 좁히고, 문의 주시면 최적의 장소를 추천드립니다.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:w-72">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="시설명·지역 검색"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="font-display text-xl font-bold tabular-nums text-slate-900">{venues.length}</span>{" "}
              <span className="text-slate-500">답사 행사장</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <BadgeCheck className="h-4 w-4 text-teal-500" />전 시설 현장 검증
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto flex max-w-content gap-8 px-5 py-8 md:px-8">
        <aside className="hidden w-[240px] shrink-0 lg:block">
          <div className="sticky top-[72px]">
            <FilterGroup title="지역" options={regions} active={region} onPick={setRegion} counts={regionCounts} />
            <FilterGroup title="유형" options={typeOptions} active={vtype} onPick={setVtype} />
            <FilterGroup title="수용 인원" options={CAP_BUCKETS} active={cap} onPick={setCap} />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{filtered.length}개</span> 행사장
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                {venues.length === 0 ? "행사장 정보를 준비 중입니다." : "조건에 맞는 행사장이 없습니다."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VenueCard key={v.id} v={v} />
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
              <h3 className="font-display text-xl font-bold text-white md:text-2xl">조건에 맞는 행사장, 파란이 매칭해드립니다</h3>
              <p className="mt-1.5 text-sm text-white/60">인원·예산·일정만 알려주시면 답사 데이터에서 최적 후보를 골라드립니다.</p>
            </div>
            <Link
              href="/#contact"
              className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-blue-500"
            >
              행사장 추천 받기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
