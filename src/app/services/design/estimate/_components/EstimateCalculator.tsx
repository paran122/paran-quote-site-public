"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PRODUCTS,
  SET_DISCOUNT_MIN_ITEMS,
  SET_DISCOUNT_RATE,
  type ProductDef,
} from "../_config";

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

export default function EstimateCalculator() {
  const [vals, setVals] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.key, { ...p.initial }]))
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);

  // ?expand=poster 프리필 (useSearchParams는 CSR 베일아웃을 일으키므로 직접 파싱)
  useEffect(() => {
    const expand = new URLSearchParams(window.location.search).get("expand");
    if (expand && PRODUCTS.some((p) => p.key === expand)) setOpen(expand);
  }, []);

  const setField = (productKey: string, fieldId: string, value: number) =>
    setVals((prev) => ({ ...prev, [productKey]: { ...prev[productKey], [fieldId]: value } }));

  const priceOf = (p: ProductDef) => p.price(vals[p.key]);

  const { subtotal, discount, total } = useMemo(() => {
    const picked = PRODUCTS.filter((p) => selected.has(p.key));
    const sub = picked.reduce((sum, p) => sum + priceOf(p), 0);
    const disc =
      picked.length >= SET_DISCOUNT_MIN_ITEMS ? Math.round(sub * SET_DISCOUNT_RATE) : 0;
    return { subtotal: sub, discount: disc, total: sub - disc };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, vals]);

  const toggleSelect = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="mx-auto max-w-[1000px] px-5 md:px-8 py-12 md:py-16">
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        {/* 좌: 품목 선택 */}
        <div>
          <h2 className="text-xl font-bold mb-2">디자인 항목 선택</h2>
          <p className="text-sm text-slate-500 mb-6">필요한 항목의 옵션을 설정하고 견적에 담아보세요. 2개 이상 담으면 10% 할인이 적용됩니다.</p>

          <div className="space-y-3">
            {PRODUCTS.map((p) => {
              const isOpen = open === p.key;
              const isSelected = selected.has(p.key);
              return (
                <div
                  key={p.key}
                  className={`rounded-2xl border transition-colors ${isSelected ? "border-blue-400 bg-blue-50/30" : "border-slate-200 bg-white"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : p.key)}
                    aria-expanded={isOpen}
                    aria-label={`${p.name} 옵션 ${isOpen ? "접기" : "펼치기"}`}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <div>
                      <span className="font-bold">{p.name}</span>
                      <span className="ml-2 text-xs text-slate-400">{p.note}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-blue-600 font-num">{won(priceOf(p))}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                      <div className="space-y-4">
                        {p.fields.map((f) => (
                          <div key={f.id}>
                            <div className="text-xs font-medium text-slate-500 mb-2">
                              {f.label}
                              {f.display && <span className="ml-1 text-slate-300">(가격 영향 없음)</span>}
                            </div>
                            {f.kind === "chips" && f.choices && (
                              <div className="flex flex-wrap gap-2">
                                {f.choices.map((c) => {
                                  const active = vals[p.key][f.id] === c.value;
                                  return (
                                    <button
                                      key={c.label}
                                      type="button"
                                      onClick={() => setField(p.key, f.id, c.value)}
                                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                    >
                                      {c.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                            {f.kind === "stepper" && (
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  aria-label={`${f.label} 줄이기`}
                                  onClick={() => setField(p.key, f.id, Math.max(f.min ?? 1, vals[p.key][f.id] - (f.step ?? 1)))}
                                  className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                                >
                                  −
                                </button>
                                <span className="w-16 text-center font-semibold font-num">
                                  {vals[p.key][f.id]}{f.unit}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`${f.label} 늘리기`}
                                  onClick={() => setField(p.key, f.id, Math.min(f.max ?? 99, vals[p.key][f.id] + (f.step ?? 1)))}
                                  className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSelect(p.key)}
                        className={`mt-5 w-full py-3 rounded-xl text-sm font-bold transition-colors ${isSelected ? "bg-slate-200 text-slate-700 hover:bg-slate-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                      >
                        {isSelected ? "견적에서 빼기" : "견적에 담기"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 우: 견적 요약 + 문의 폼 */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold mb-4">견적 요약</h3>
            {selected.size === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">담은 항목이 없습니다.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {PRODUCTS.filter((p) => selected.has(p.key)).map((p) => (
                  <li key={p.key} className="flex justify-between text-sm">
                    <span className="text-slate-600">{p.name}</span>
                    <span className="font-medium font-num">{won(priceOf(p))}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>소계</span>
                <span className="font-num">{won(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>세트 할인 (10%)</span>
                  <span className="font-num">−{won(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1">
                <span>합계</span>
                <span className="text-blue-600 font-num">{won(total)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">VAT 포함 · 수정 3회 기준 · 실제 견적은 협의 후 확정</p>
          </div>

        </aside>
      </div>
    </div>
  );
}
