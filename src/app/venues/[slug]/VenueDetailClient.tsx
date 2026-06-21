"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  BadgeCheck,
  MessageSquareText,
  Link as LinkIcon,
  Building2,
  Camera,
  Images,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Venue, Portfolio } from "@/types";
import {
  VENUE_TYPE_BADGE,
  CAP_MODE_LABEL,
  CAP_MODE_ORDER,
  typeLabel,
  facilityLabel,
} from "@/lib/venueMeta";

export default function VenueDetailClient({
  venue: v,
  related,
}: {
  venue: Venue;
  related: Portfolio[];
}) {
  const badge = VENUE_TYPE_BADGE[v.venueType ?? "etc"] ?? VENUE_TYPE_BADGE.etc;
  const gallery = v.images ?? [];
  const cover = v.coverUrl ?? gallery[0]?.url ?? null;
  const halls = v.halls ?? [];
  const modes = CAP_MODE_ORDER.filter((m) =>
    halls.some((h) => h.capacity_modes && h.capacity_modes[m] != null)
  );
  const mapUrl = v.addressApprox
    ? `https://map.kakao.com/?q=${encodeURIComponent(v.addressApprox)}`
    : null;

  // ── 라이트박스 ──
  const [lbIdx, setLbIdx] = useState<number | null>(null);
  const close = useCallback(() => setLbIdx(null), []);
  const go = useCallback(
    (d: number) =>
      setLbIdx((i) => (i == null ? i : (i + d + gallery.length) % gallery.length)),
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
    return () => document.removeEventListener("keydown", onKey);
  }, [lbIdx, close, go]);

  const sectionH = (icon: React.ReactNode, title: string, badgeText?: string) => (
    <h2 className="flex items-center gap-2 border-b border-slate-100 pb-2.5 font-display text-base font-bold text-slate-900">
      <span className="text-teal-500">{icon}</span>
      {title}
      {badgeText && (
        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-600">
          {badgeText}
        </span>
      )}
    </h2>
  );

  const card = "rounded-2xl border border-slate-200/80 bg-white p-5 shadow-subtle md:p-6";

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-[760px] px-4 py-6 md:px-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">홈</Link>
          <span>/</span>
          <Link href="/guide" className="hover:text-slate-600">가이드</Link>
          <span>/</span>
          <Link href="/venues" className="hover:text-slate-600">행사장 추천</Link>
          <span>/</span>
          <span className="text-slate-700">{v.name}</span>
        </nav>

        {/* Hero */}
        <div className="relative mt-4 overflow-hidden rounded-2xl">
          <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-teal-200 to-sky-300">
            {cover ? (
              <button
                type="button"
                onClick={() => gallery.length && setLbIdx(0)}
                className="h-full w-full cursor-zoom-in"
                aria-label="사진 크게 보기"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt={v.name} className="h-full w-full object-cover" />
              </button>
            ) : (
              <MapPin className="h-10 w-10 text-white/50" />
            )}
          </div>
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-teal-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <BadgeCheck className="h-3.5 w-3.5" />현장 답사 완료
          </span>
          {gallery.length > 0 && (
            <button
              type="button"
              onClick={() => setLbIdx(0)}
              className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-900/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur"
            >
              <Camera className="h-3.5 w-3.5" />{gallery.length}
            </button>
          )}
        </div>

        {/* Title block */}
        <div className="mt-4">
          <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge}`}>
            {typeLabel(v.venueType)}
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 md:text-3xl">{v.name}</h1>
          {v.tagline && <p className="mt-1.5 text-sm text-slate-500">{v.tagline}</p>}
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <span>수용 <b className="text-slate-700">{v.maxCapacity ? v.maxCapacity.toLocaleString() : "—"}</b>명</span>
            <span className="text-slate-300">·</span>
            <span>홀 <b className="text-slate-700">{v.hallCount ?? halls.length}</b></span>
            {v.region && (<><span className="text-slate-300">·</span><span>{v.region}</span></>)}
          </p>

          {/* Facts */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200/80 bg-white p-4 shadow-subtle">
            <div className="text-center">
              <p className="font-display text-lg font-bold tabular-nums text-slate-900">{v.maxCapacity ? v.maxCapacity.toLocaleString() : "—"}</p>
              <p className="text-[11px] text-slate-400">최대 수용</p>
            </div>
            <div className="border-x border-slate-100 text-center">
              <p className="font-display text-lg font-bold tabular-nums text-slate-900">{v.hallCount ?? halls.length}</p>
              <p className="text-[11px] text-slate-400">보유 홀</p>
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold tabular-nums text-slate-900">{gallery.length}</p>
              <p className="text-[11px] text-slate-400">현장 사진</p>
            </div>
          </div>

          {/* Address */}
          {v.addressApprox && (
            <a
              href={mapUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 shadow-subtle hover:border-teal-300"
            >
              <MapPin className="h-4 w-4 shrink-0 text-teal-500" />
              <span className="flex-1">{v.addressApprox}</span>
              <span className="text-xs font-semibold text-teal-600">지도 ›</span>
            </a>
          )}

          {/* 적합 행사 */}
          {v.eventFit?.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-teal-600">🎯 적합 행사</span>
              {v.eventFit.map((f) => (
                <span key={f} className="rounded-full border border-teal-200 bg-teal-50/60 px-2.5 py-1 text-[12px] font-medium text-teal-700">{f}</span>
              ))}
            </div>
          )}

          {/* CTA */}
          <Link
            href="/#contact"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"
          >
            <MessageSquareText className="h-4 w-4" />이 행사장으로 행사 문의
          </Link>
          <p className="mt-2 text-center text-[11px] text-slate-400">대관료·담당자 정보는 문의 시 안내드립니다</p>
        </div>

        {/* 시설 소개 */}
        {v.overview && (
          <section className={`mt-3 ${card}`}>
            {sectionH(<Building2 className="h-4 w-4" />, "시설 소개")}
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{v.overview}</p>
          </section>
        )}

        {/* 현장 사진 */}
        {gallery.length > 0 && (
          <section className={`mt-3 ${card}`}>
            {sectionH(<Images className="h-4 w-4" />, "현장 사진", `${gallery.length}`)}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {gallery.map((img, i) => (
                <button key={i} type="button" onClick={() => setLbIdx(i)} className="cursor-zoom-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption ?? `${v.name} 현장 사진 ${i + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── 홀별 안내 divider ── */}
        {halls.length > 0 && (
          <div className="mt-6 mb-1 rounded-lg border-l-[3px] border-teal-500 bg-teal-50/60 px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-sm font-bold text-teal-700">
              <Building2 className="h-4 w-4" />홀별 안내
            </span>
          </div>
        )}

        {/* 홀 안내 표 */}
        {modes.length > 0 && (
          <section className={`mt-2 ${card}`}>
            {sectionH(<Building2 className="h-4 w-4" />, "홀 안내", `${halls.length}개`)}
            <p className="mt-2 text-xs text-slate-400">홀별 수용 인원을 비교해 보세요.</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-[12px] text-slate-500">
                  <tr className="border-b border-slate-100">
                    <th className="px-2 py-2 text-left font-semibold">홀</th>
                    {modes.map((m) => (
                      <th key={m} className="px-2 py-2 text-right font-semibold">{CAP_MODE_LABEL[m]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {halls.map((h, i) => (
                    <tr key={i}>
                      <td className="px-2 py-2.5 font-medium text-slate-700">
                        {h.name}
                        {h.floor ? <span className="ml-1 text-[11px] text-slate-400">({h.floor})</span> : null}
                      </td>
                      {modes.map((m) => (
                        <td key={m} className="px-2 py-2.5 text-right tabular-nums text-slate-600">
                          {h.capacity_modes?.[m] != null ? h.capacity_modes[m].toLocaleString() : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 홀 상세 카드 */}
        {halls.some((h) => h.summary || (h.facilities?.length ?? 0) > 0 || (h.event_fit?.length ?? 0) > 0) && (
          <section className={`mt-3 ${card}`}>
            {sectionH(<Building2 className="h-4 w-4" />, "홀 상세 정보")}
            <div className="mt-3 space-y-3">
              {halls.map((h, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="font-display text-sm font-bold text-slate-800">
                    {h.name}
                    {h.max_capacity ? <span className="ml-2 text-xs font-medium text-slate-400">최대 {h.max_capacity.toLocaleString()}명</span> : null}
                  </p>
                  {h.summary && <p className="mt-1 text-[13px] text-slate-600">{h.summary}</p>}
                  {(h.facilities?.length ?? 0) > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {h.facilities!.map((f) => (
                        <span key={f} className="rounded-full bg-blue-50 px-2.5 py-1 text-[12px] font-medium text-blue-600">{facilityLabel(f)}</span>
                      ))}
                    </div>
                  )}
                  {(h.event_fit?.length ?? 0) > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {h.event_fit!.map((f) => (
                        <span key={f} className="rounded-full border border-teal-200 bg-teal-50/50 px-2.5 py-1 text-[12px] font-medium text-teal-700">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 보유 시설 */}
        {v.facilities?.length > 0 && (
          <section className={`mt-3 ${card}`}>
            {sectionH(<Building2 className="h-4 w-4" />, "보유 시설")}
            <div className="mt-3 flex flex-wrap gap-2">
              {v.facilities.map((f) => (
                <span key={f} className="rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-blue-600">{facilityLabel(f)}</span>
              ))}
            </div>
          </section>
        )}

        {/* 답사 코멘트 */}
        {(v.strengths?.length ?? 0) > 0 && (
          <section className={`mt-3 ${card}`}>
            {sectionH(<ShieldCheck className="h-4 w-4" />, "답사 코멘트", "답사 기반")}
            <ul className="mt-3 space-y-2">
              {v.strengths!.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[11px] font-bold text-teal-700">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 파란 진행 사례 */}
        {related.length > 0 && (
          <section className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 md:p-6">
            <p className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-blue-500">
              <LinkIcon className="h-3.5 w-3.5" />파란 진행 사례
            </p>
            <p className="mt-1.5 text-sm text-slate-600">파란컴퍼니가 이 행사장에서 직접 진행한 행사입니다.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug ?? p.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-blue-300"
                >
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-gradient-to-br from-slate-100 to-slate-200">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-slate-800">{p.title}</p>
                    <p className="text-[11px] text-slate-400">{[p.client, p.year].filter(Boolean).join(" · ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="mt-6 rounded-2xl bg-[#091041] p-6 text-center">
          <p className="font-display text-lg font-bold text-white">이 행사장으로 행사를 준비하시나요?</p>
          <p className="mt-1.5 text-sm text-white/60">파란컴퍼니가 답사부터 운영까지 함께합니다.</p>
          <Link
            href="/#contact"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500"
          >
            <MessageSquareText className="h-4 w-4" />행사 문의하기
          </Link>
        </div>
      </div>

      {/* 라이트박스 */}
      {lbIdx != null && gallery[lbIdx] && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="max-w-[60%] truncate text-sm font-semibold">{gallery[lbIdx].caption ?? v.name}</span>
            <span className="text-sm font-semibold">{lbIdx + 1} / {gallery.length}</span>
            <button type="button" onClick={close} className="rounded-full p-1 hover:bg-white/10" aria-label="닫기">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center px-2" onClick={(e) => e.stopPropagation()}>
            {gallery.length > 1 && (
              <button type="button" onClick={() => go(-1)} className="rounded-full p-2 text-white hover:bg-white/10" aria-label="이전">
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[lbIdx].url}
              alt={gallery[lbIdx].caption ?? v.name}
              className="max-h-[78vh] max-w-full rounded-lg object-contain"
            />
            {gallery.length > 1 && (
              <button type="button" onClick={() => go(1)} className="rounded-full p-2 text-white hover:bg-white/10" aria-label="다음">
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 py-3" onClick={(e) => e.stopPropagation()}>
              {gallery.map((img, i) => (
                <button key={i} type="button" onClick={() => setLbIdx(i)} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className={`h-14 w-14 rounded-md object-cover transition-opacity ${i === lbIdx ? "ring-2 ring-white" : "opacity-50 hover:opacity-90"}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
