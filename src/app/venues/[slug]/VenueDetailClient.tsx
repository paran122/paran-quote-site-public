"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  BadgeCheck,
  Building2,
  Users,
  Camera,
  Tag,
  ImageIcon,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Venue, Portfolio } from "@/types";
import {
  VENUE_TYPE_BADGE,
  CAP_MODE_LABEL,
  CAP_MODE_ORDER,
  PHOTO_CAT_ORDER,
  photoCatLabel,
  typeLabel,
  facilityLabel,
} from "@/lib/venueMeta";

type Pic = { idx: number; url: string; caption?: string | null; category?: string | null };

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
  // 사진: 공통(venue) + 홀별(카테고리 포함). flat index 유지(라이트박스)
  const commonPhotos: Pic[] = [];
  const hallPhotoMap = new Map<string, Pic[]>();
  gallery.forEach((img, idx) => {
    const pic: Pic = { idx, url: img.url, caption: img.caption, category: img.category };
    if (img.hall == null) commonPhotos.push(pic);
    else {
      if (!hallPhotoMap.has(img.hall)) hallPhotoMap.set(img.hall, []);
      hallPhotoMap.get(img.hall)!.push(pic);
    }
  });
  // 홀 사진을 카테고리(정면·무대·로비…) 순서로 그룹
  const hallPhotoGroups = (hallName: string) => {
    const hp = hallPhotoMap.get(hallName) ?? [];
    return PHOTO_CAT_ORDER
      .map((c) => ({ cat: c, items: hp.filter((p) => (p.category || "etc") === c) }))
      .filter((g) => g.items.length > 0);
  };

  // 대관료/가격 표시 여부
  const hasRental = halls.some((h) => h.rental_min != null || h.rental_max != null);
  const meal = v.mealPrices ?? {};
  const hasRoom = v.roomPriceMin != null || v.roomPriceMax != null;
  const hasMeal = ["breakfast", "lunch", "dinner"].some((k) => meal[`${k}_min`] != null || meal[`${k}_max`] != null);
  const hasFacilityPrice = hasRoom || hasMeal;
  const contacts = (v.contacts ?? []).filter((c) => c.phone || c.email || c.name);
  const hasContact = contacts.length > 0 || !!v.homepage;
  const [hallTab, setHallTab] = useState(0);

  // 라이트박스
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

  const hasHallDetail = halls.some(
    (h) => h.summary || (h.facilities?.length ?? 0) > 0 || (h.event_fit?.length ?? 0) > 0 || (hallPhotoMap.get(h.name)?.length ?? 0) > 0
  );

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[960px] px-6 py-8">
        {/* 브레드크럼 */}
        <nav className="mb-6 flex items-center gap-1.5 text-[12px] text-slate-400">
          <Link href="/" className="transition-colors hover:text-slate-600"><Home size={13} /></Link>
          <span>/</span>
          <Link href="/guide" className="transition-colors hover:text-slate-600">가이드</Link>
          <span>/</span>
          <Link href="/venues" className="transition-colors hover:text-slate-600">행사장 추천</Link>
          <span>/</span>
          <span className="text-slate-600">{v.name}</span>
        </nav>

        {/* 헤더 */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge}`}>{typeLabel(v.venueType)}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-600">
              <BadgeCheck size={12} />현장 답사 완료
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{v.name}</h1>
          {v.tagline && <p className="mt-2 text-[14px] text-slate-500">{v.tagline}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
            <span className="flex items-center gap-1"><Users size={14} />최대 {v.maxCapacity ? v.maxCapacity.toLocaleString() : "—"}명</span>
            <span className="flex items-center gap-1"><Building2 size={14} />홀 {v.hallCount ?? halls.length}개</span>
            {v.region && <span className="flex items-center gap-1"><MapPin size={14} />{v.region}</span>}
          </div>
        </div>

        {/* 히어로 */}
        <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[10px] bg-slate-100">
          {cover ? (
            <button type="button" onClick={() => gallery.length && setLbIdx(0)} className="h-full w-full cursor-zoom-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={v.name} className="h-full w-full object-cover" />
            </button>
          ) : (
            <div className="flex h-full w-full items-center justify-center"><MapPin className="h-8 w-8 text-slate-300" /></div>
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
        <div className="mb-8 rounded-[12px] bg-white p-5 shadow-subtle sm:p-6">
          <h2 className="mb-4 text-[14px] font-semibold text-slate-800">한눈에 보기</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Fact icon={<Users size={15} />} label="최대 수용" value={v.maxCapacity ? `${v.maxCapacity.toLocaleString()}명` : "—"} />
            <Fact icon={<Building2 size={15} />} label="보유 홀" value={`${v.hallCount ?? halls.length}개`} />
            <Fact icon={<MapPin size={15} />} label="지역" value={v.region ?? "—"} />
            <Fact icon={<Tag size={15} />} label="유형" value={typeLabel(v.venueType)} />
          </div>
          {v.addressApprox && (
            <a
              href={mapUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-[13px] text-slate-600 transition-colors hover:text-primary"
            >
              <MapPin size={14} className="shrink-0 text-slate-400" />
              <span className="flex-1">{v.addressApprox}</span>
              <span className="text-[12px] font-medium text-primary">카카오맵 ›</span>
            </a>
          )}
        </div>

        {/* 시설 소개 */}
        {v.overview && (
          <section className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">시설 소개</h2>
            <p className="whitespace-pre-line text-[16px] leading-[1.8] text-slate-600">{v.overview}</p>
          </section>
        )}

        {/* 행사장 공통 사진 */}
        {commonPhotos.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-[15px] font-semibold text-slate-800">
              행사장 공통 사진<span className="ml-1.5 text-[13px] font-normal text-slate-400">({commonPhotos.length}장)</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {commonPhotos.map((p) => (
                <button key={p.idx} type="button" onClick={() => setLbIdx(p.idx)} className="cursor-zoom-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption ?? v.name} className="aspect-square w-full rounded-[8px] object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 홀 안내 (수용 표) */}
        {modes.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-[15px] font-semibold text-slate-800">
              홀 안내<span className="ml-1.5 text-[13px] font-normal text-slate-400">({halls.length}개)</span>
            </h2>
            <div className="overflow-x-auto rounded-[10px] border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="border-b border-slate-100 bg-slate-50 text-[12px] text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">홀</th>
                    {modes.map((m) => (
                      <th key={m} className="px-3 py-2.5 text-right font-medium">{CAP_MODE_LABEL[m]}</th>
                    ))}
                    {hasRental && <th className="px-3 py-2.5 text-right font-medium">대관료</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {halls.map((h, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5 font-medium text-slate-700">
                        {h.name}
                        {h.floor ? <span className="ml-1 text-[11px] text-slate-400">({h.floor})</span> : null}
                      </td>
                      {modes.map((m) => (
                        <td key={m} className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                          {h.capacity_modes?.[m] != null ? h.capacity_modes[m].toLocaleString() : "—"}
                        </td>
                      ))}
                      {hasRental && (
                        <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                          {h.rental_min != null || h.rental_max != null ? wonRange(h.rental_min, h.rental_max) : "문의"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 부대시설 가격 */}
        {hasFacilityPrice && (
          <section className="mb-8">
            <h2 className="mb-1 text-[15px] font-semibold text-slate-800">부대시설 가격</h2>
            <p className="mb-3 text-[13px] text-slate-400">객실·식사 등 부대 가격입니다. 대관료는 위 홀 안내를 참고하세요.</p>
            <div className="divide-y divide-slate-50 overflow-hidden rounded-[10px] border border-slate-200 bg-white">
              {hasRoom && <PriceRow label="객실 (2인 1실/박)" value={wonRange(v.roomPriceMin, v.roomPriceMax)} />}
              {(["breakfast", "lunch", "dinner"] as const).map((k) => {
                const mn = meal[`${k}_min`];
                const mx = meal[`${k}_max`];
                if (mn == null && mx == null) return null;
                const lbl = { breakfast: "조식", lunch: "중식", dinner: "석식" }[k];
                return <PriceRow key={k} label={`식사 ${lbl} / 인`} value={wonRange(mn, mx)} />;
              })}
            </div>
          </section>
        )}

        {/* 홀 상세 — 인트라넷처럼 홀 탭 전환 */}
        {hasHallDetail && halls.length > 0 && (() => {
          const ti = halls[hallTab] ? hallTab : 0;
          const h = halls[ti];
          const photoGs = hallPhotoGroups(h.name);
          return (
            <section className="mb-8">
              <h2 className="mb-4 text-[15px] font-semibold text-slate-800">홀 상세 정보</h2>
              {halls.length > 1 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {halls.map((hx, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHallTab(i)}
                      className={
                        ti === i
                          ? "flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-[13px] font-medium text-white"
                          : "flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-200"
                      }
                    >
                      {hx.name}
                      {hx.max_capacity ? <span className="tabular-nums opacity-70">{hx.max_capacity.toLocaleString()}석</span> : null}
                    </button>
                  ))}
                </div>
              )}
              <div className="rounded-[10px] bg-white p-4 shadow-subtle">
                <p className="text-[14px] font-semibold text-slate-800">
                  {h.name}
                  {h.max_capacity ? <span className="ml-2 text-[12px] font-normal text-slate-400">최대 {h.max_capacity.toLocaleString()}명</span> : null}
                </p>
                {h.summary && <p className="mt-1 text-[13px] text-slate-600">{h.summary}</p>}
                {(h.facilities?.length ?? 0) > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {h.facilities!.map((f) => (
                      <span key={f} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-600">{facilityLabel(f)}</span>
                    ))}
                  </div>
                )}
                {(h.event_fit?.length ?? 0) > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {h.event_fit!.map((f) => (
                      <span key={f} className="rounded-full bg-primary-50 px-2.5 py-1 text-[12px] font-medium text-primary-700">{f}</span>
                    ))}
                  </div>
                )}
                {/* 홀별 사진 — 카테고리(정면·무대·로비…)별 */}
                {photoGs.length > 0 ? (
                  <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                    {photoGs.map((g) => (
                      <div key={g.cat}>
                        <p className="mb-1.5 text-[12px] font-medium text-slate-500">
                          {photoCatLabel(g.cat)}<span className="ml-1.5 text-[11px] text-slate-300">{g.items.length}</span>
                        </p>
                        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                          {g.items.map((p) => (
                            <button key={p.idx} type="button" onClick={() => setLbIdx(p.idx)} className="cursor-zoom-in">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.url} alt={p.caption ?? h.name} className="aspect-square w-full rounded-[6px] object-cover" loading="lazy" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 border-t border-slate-100 pt-3 text-[12px] text-slate-400">등록된 사진이 없습니다.</p>
                )}
              </div>
            </section>
          );
        })()}

        {/* 보유 시설 */}
        {v.facilities?.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">보유 시설</h2>
            <div className="flex flex-wrap gap-1.5">
              {v.facilities.map((f) => (
                <span key={f} className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-slate-600">{facilityLabel(f)}</span>
              ))}
            </div>
          </section>
        )}

        {/* 이런 행사에 적합 */}
        {v.eventFit?.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">이런 행사에 적합</h2>
            <div className="flex flex-wrap gap-1.5">
              {v.eventFit.map((f) => (
                <span key={f} className="rounded-full bg-primary-50 px-3 py-1.5 text-[13px] font-medium text-primary-700">{f}</span>
              ))}
            </div>
          </section>
        )}

        {/* 답사 코멘트 */}
        {(v.strengths?.length ?? 0) > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">
              답사 코멘트<span className="ml-1.5 text-[12px] font-normal text-slate-400">파란 현장 답사 기반</span>
            </h2>
            <ul className="space-y-2.5">
              {v.strengths!.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[14px] text-slate-600">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 파란 진행 사례 */}
        {related.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-1 text-[15px] font-semibold text-slate-800">파란 진행 사례</h2>
            <p className="mb-4 text-[13px] text-slate-400">파란컴퍼니가 이 행사장에서 직접 진행한 행사입니다.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/work/${p.slug ?? p.id}`} className="group block overflow-hidden rounded-xl border border-slate-100 bg-white transition-shadow hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-6 w-6 text-slate-300" /></div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 text-[14px] font-semibold leading-snug text-slate-800">{p.title}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{[p.client, p.year].filter(Boolean).join(" · ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 행사장 연락처 */}
        {hasContact && (
          <section className="mb-8">
            <h2 className="mb-3 text-[15px] font-semibold text-slate-800">행사장 연락처</h2>
            <div className="divide-y divide-slate-50 overflow-hidden rounded-[10px] border border-slate-200 bg-white">
              {contacts.map((c, i) => (
                <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-[13px]">
                  {(c.name || c.title) && (
                    <span className="font-medium text-slate-700">
                      {c.name}{c.title ? <span className="ml-1 text-[12px] font-normal text-slate-400">{c.title}</span> : null}
                    </span>
                  )}
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-slate-600 hover:text-primary"><Phone size={14} className="text-slate-400" />{c.phone}</a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-slate-600 hover:text-primary"><Mail size={14} className="text-slate-400" />{c.email}</a>
                  )}
                </div>
              ))}
              {v.homepage && (
                <a href={v.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-3 text-[13px] text-slate-600 hover:text-primary">
                  <Globe size={14} className="text-slate-400" /><span className="truncate">{v.homepage}</span>
                </a>
              )}
            </div>
            <p className="mt-2 text-[12px] text-slate-400">행사 진행은 파란컴퍼니가 답사·기획·운영까지 함께합니다.</p>
          </section>
        )}

        {/* 하단 CTA */}
        <div className="mt-2 flex flex-col items-start justify-between gap-3 border-t border-slate-200 py-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[15px] font-semibold text-slate-800">이 행사장으로 행사를 준비하시나요?</p>
            <p className="mt-0.5 text-[13px] text-slate-400">대관료·담당자 정보는 문의 시 안내드립니다.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/venues" className="btn-ghost btn-md">목록으로</Link>
            <Link href="/#contact" className="btn-primary btn-md">행사 문의하기</Link>
          </div>
        </div>

        {/* 내부 링크 배너 */}
        <Link
          href="/guide/venue"
          className="group mb-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-5 transition-all hover:border-blue-200 hover:bg-blue-50"
        >
          <div>
            <p className="text-[15px] font-semibold text-slate-800">행사장 고르는 기준이 궁금하신가요?</p>
            <p className="mt-1 text-[13px] text-slate-500">인원·예산·동선으로 알아보는 장소 선택 가이드</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-blue-600 transition-transform group-hover:translate-x-0.5">
            가이드<ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      {/* 라이트박스 */}
      {lbIdx != null && gallery[lbIdx] && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95" onClick={close}>
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="max-w-[55%] truncate text-[13px] font-medium">{gallery[lbIdx].caption ?? v.name}</span>
            <span className="text-[13px] font-medium tabular-nums">{lbIdx + 1} / {gallery.length}</span>
            <button type="button" onClick={close} className="rounded-full p-1 hover:bg-white/10" aria-label="닫기"><X className="h-6 w-6" /></button>
          </div>
          <div className="flex flex-1 items-center justify-center px-2" onClick={(e) => e.stopPropagation()}>
            {gallery.length > 1 && (
              <button type="button" onClick={() => go(-1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 hover:bg-black/60" aria-label="이전"><ChevronLeft className="h-5 w-5 text-white" /></button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[lbIdx].url} alt={gallery[lbIdx].caption ?? v.name} className="mx-2 max-h-[78vh] max-w-full rounded-[8px] object-contain" />
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

function wonRange(min?: number | null, max?: number | null): string {
  const f = (n: number) => Number(n).toLocaleString("ko-KR");
  if (min != null && max != null) return min === max ? `${f(min)}원` : `${f(min)}~${f(max)}원`;
  if (min != null) return `${f(min)}원~`;
  if (max != null) return `~${f(max)}원`;
  return "문의";
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-[13px]">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium tabular-nums text-slate-800">{value}</span>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <div>
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        <p className="text-[13px] text-slate-700">{value}</p>
      </div>
    </div>
  );
}
