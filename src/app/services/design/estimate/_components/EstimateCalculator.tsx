"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PRODUCTS,
  REFERRAL_OPTIONS,
  SET_DISCOUNT_MIN_ITEMS,
  SET_DISCOUNT_RATE,
  type ProductDef,
} from "../_config";

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

function optionSummary(product: ProductDef, vals: Record<string, number>): string {
  return product.fields
    .filter((f) => f.kind === "chips")
    .map((f) => {
      const choice = f.choices?.find((c) => c.value === vals[f.id]);
      return choice ? `${f.label} ${choice.label}` : null;
    })
    .filter(Boolean)
    .concat(
      product.fields
        .filter((f) => f.kind === "stepper")
        .map((f) => `${f.label} ${vals[f.id]}${f.unit ?? ""}`)
    )
    .join(" · ");
}

export default function EstimateCalculator() {
  const searchParams = useSearchParams();

  const [vals, setVals] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.key, { ...p.initial }]))
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);

  // ?expand=poster 프리필
  useEffect(() => {
    const expand = searchParams.get("expand");
    if (expand && PRODUCTS.some((p) => p.key === expand)) setOpen(expand);
  }, [searchParams]);

  const [form, setForm] = useState({
    organization: "",
    contactName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [referrals, setReferrals] = useState<Set<string>>(new Set());
  const [referralEtc, setReferralEtc] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  const toggleReferral = (r: string) =>
    setReferrals((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.size === 0) {
      setErrorMsg("견적에 포함할 디자인 항목을 1개 이상 선택해주세요.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");

    const picked = PRODUCTS.filter((p) => selected.has(p.key));
    const cartItems = picked.map((p) => ({
      name: `${p.name} 디자인`,
      price: priceOf(p),
      quantity: 1,
      category: "디자인",
      type: p.key,
      options: { summary: optionSummary(p, vals[p.key]) },
    }));

    const refList = Array.from(referrals);
    if (referralEtc.trim()) refList.push(`기타: ${referralEtc.trim()}`);

    const now = new Date();
    const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const quoteNumber = `DQ${ymd}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

    const memoParts = [];
    if (form.message.trim()) memoParts.push(form.message.trim());
    if (refList.length) memoParts.push(`유입경로: ${refList.join(", ")}`);

    const payload = {
      quote_number: quoteNumber,
      contact_name: form.contactName,
      organization: form.organization,
      phone: form.phone,
      email: form.email,
      event_name: "디자인 견적 문의",
      event_date: ymd,
      event_type: "디자인",
      memo: memoParts.join("\n"),
      cart_items: cartItems,
      total_amount: total,
      discount_amount: discount,
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "전송에 실패했습니다.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "전송에 실패했습니다.");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">견적 문의가 접수되었습니다</h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          입력하신 연락처로 1영업일 이내에 상세 견적과 함께 연락드리겠습니다.<br />
          예상 견적 합계는 <strong className="text-blue-600">{won(total)}</strong> 입니다. (VAT 포함, 수정 3회 기준)
        </p>
        <Link href="/services/design" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors">
          디자인 서비스로 돌아가기
        </Link>
      </div>
    );
  }

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

          {/* 문의 폼 */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mt-4 space-y-3">
            <h3 className="font-bold mb-1">견적 문의</h3>
            <input
              required
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              placeholder="기관/기업명 *"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-400 focus:outline-none"
            />
            <input
              required
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              placeholder="담당자명 *"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-400 focus:outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="메일주소 *"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-400 focus:outline-none"
            />
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="연락처 *"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-400 focus:outline-none"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="주요 요청 사항"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-400 focus:outline-none resize-none"
            />

            <div>
              <p className="text-xs text-slate-500 mb-2">어떻게 알게 되셨나요? (복수 선택)</p>
              <div className="flex flex-wrap gap-1.5">
                {REFERRAL_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleReferral(r)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${referrals.has(r) ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {referrals.has("기타") && (
                <input
                  value={referralEtc}
                  onChange={(e) => setReferralEtc(e.target.value)}
                  maxLength={80}
                  placeholder="어떤 경로로 알게 되셨는지 적어주세요"
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-blue-400 focus:outline-none"
                />
              )}
            </div>

            {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {status === "sending" ? "전송 중…" : "견적 문의 보내기"}
            </button>
            <p className="text-[11px] text-slate-400 text-center">제출 시 1영업일 내 상세 견적을 안내드립니다.</p>
          </form>
        </aside>
      </div>
    </div>
  );
}
