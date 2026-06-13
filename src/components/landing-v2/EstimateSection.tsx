"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { Mic, GraduationCap, Store, PenTool, MonitorSmartphone, Boxes, Check, X, ChevronDown, Loader2, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { BorderBeam } from "@/components/ui/border-beam";
import { ESTIMATE_EVENT_TYPES, ESTIMATE_GROUPS, ESTIMATE_DESIGN_IDS, ESTIMATE_SCALES, ESTIMATE_INCLUDES, ESTIMATE_DETAIL, ESTIMATE_CHIPS, formatRangeText } from "@/lib/pricing";
import { REFERRAL_SOURCES, REFERRAL_OTHER, buildReferralLine } from "@/lib/referralSources";
import { formatPhoneNumber, KOREAN_PHONE_REGEX } from "@/lib/phoneFormat";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function isImageType(type: string): boolean {
  return type.startsWith("image/");
}

interface EstimateItem {
  name: string;
  price: number;
  unit: string;
  default?: boolean;
}

interface EventType {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  bg: string;
  iconBg: string;
  items: EstimateItem[];
}

const ICONS: Record<string, { icon: LucideIcon; bg: string; iconBg: string }> = {
  conference: { icon: Mic, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  education: { icon: GraduationCap, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  booth: { icon: Store, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  print: { icon: PenTool, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  digital: { icon: MonitorSmartphone, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  space: { icon: Boxes, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
};

const eventTypes: EventType[] = ESTIMATE_EVENT_TYPES.map((et) => ({
  ...et,
  icon: ICONS[et.id]?.icon ?? Mic,
  bg: ICONS[et.id]?.bg ?? "bg-gray-100/80",
  iconBg: ICONS[et.id]?.iconBg ?? "bg-gray-200/80",
}));

const PHONE_REGEX = KOREAN_PHONE_REGEX;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface OrderForm {
  organization: string;
  department: string;
  contactName: string;
  position: string;
  phone: string;
  email: string;
  eventDate: string;
  budgetRange: string;
  eventVenue: string;
  memo: string;
}

const INITIAL_FORM: OrderForm = {
  organization: "",
  department: "",
  contactName: "",
  position: "",
  phone: "",
  email: "",
  eventDate: "",
  budgetRange: "",
  eventVenue: "",
  memo: "",
};

const REQUIRED_FIELDS = ["organization", "contactName", "phone", "email"] as const;

function getFieldError(form: OrderForm, key: string): string | null {
  const value = form[key as keyof OrderForm];
  if (key === "organization" && !value.trim()) return "회사/기관명을 입력해주세요";
  if (key === "contactName" && !value.trim()) return "이름을 입력해주세요";
  if (key === "phone") {
    if (!value.trim()) return "연락처를 입력해주세요";
    if (!PHONE_REGEX.test(value.trim())) return "올바른 연락처 형식 (예: 010-1234-5678)";
  }
  if (key === "email") {
    if (!value.trim()) return "이메일을 입력해주세요";
    if (!EMAIL_REGEX.test(value.trim())) return "올바른 이메일 형식 (예: email@company.com)";
  }
  return null;
}

export default function Estimate() {
  const [selected, setSelected] = useState<string>("conference");
  /** 유형별 선택 규모 (기본 = 첫 밴드 = 최소 인원) */
  const [scaleSel, setScaleSel] = useState<Record<string, string>>({});
  const [showOrder, setShowOrder] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const estimateCardRef = useRef<HTMLDivElement>(null);

  // Order form state
  const [form, setForm] = useState<OrderForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [referralSources, setReferralSources] = useState<string[]>([]);
  const [referralOther, setReferralOther] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (key: keyof OrderForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleReferral = (source: string) => {
    setReferralSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setTouched({});
    setFiles([]);
    setReferralSources([]);
    setReferralOther("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (files.length + selected.length > MAX_FILES) {
      showToast(`최대 ${MAX_FILES}개까지 첨부 가능합니다.`);
      return;
    }
    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        showToast(`${file.name}: 10MB 이하 파일만 첨부 가능합니다.`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<UploadedFile[]> => {
    if (files.length === 0) return [];
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/contact/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "업로드 실패" }));
        throw new Error(err.error);
      }
      const data = await res.json();
      return data.files;
    } finally {
      setUploading(false);
    }
  };

  const handleOrderSubmit = async () => {
    // Mark all required fields as touched
    const allTouched: Record<string, boolean> = {};
    REQUIRED_FIELDS.forEach((key) => { allTouched[key] = true; });
    setTouched((prev) => ({ ...prev, ...allTouched }));

    // Validate
    const hasError = REQUIRED_FIELDS.some((key) => getFieldError(form, key) !== null);
    if (hasError || submitting) return;
    setSubmitting(true);

    const quoteNumber = `QT-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;

    // 간편 견적: 유형 + 규모 + 예상 범위를 단일 항목으로 전달
    const cartItems = [
      {
        name: scale ? `${active.name} · ${scale.label}` : active.name,
        price: scale?.min ?? 0,
        qty: 1,
        unit: "식",
      },
    ];

    // Combine referral, position, budgetRange, memo into one memo field
    const memoParts: string[] = [];
    if (rangeText) memoParts.push(`예상 견적 범위: ${rangeText}`);
    const referralLine = buildReferralLine(referralSources, referralOther);
    if (referralLine) memoParts.push(referralLine);
    if (form.position) memoParts.push(`직급/직책: ${form.position}`);
    if (form.budgetRange) memoParts.push(`예산 범위: ${form.budgetRange}`);
    if (form.memo) memoParts.push(form.memo);
    const combinedMemo = memoParts.join("\n") || undefined;

    try {
      let attachments: UploadedFile[] = [];
      if (files.length > 0) {
        attachments = await uploadFiles();
      }

      const { submitQuoteViaApi } = await import("@/lib/queries");
      await submitQuoteViaApi({
        quote_number: quoteNumber,
        contact_name: form.contactName,
        organization: form.organization,
        phone: form.phone,
        email: form.email,
        department: form.department || undefined,
        event_name: active.name,
        event_date: form.eventDate || new Date().toISOString().slice(0, 10),
        event_venue: form.eventVenue || undefined,
        event_type: active.name,
        memo: combinedMemo,
        cart_items: cartItems,
        total_amount: scale?.min ?? 0,
        attachments,
      });
      showToast("견적 요청이 완료되었습니다. 1영업일 내 연락드리겠습니다");
      setShowOrder(false);
      resetForm();
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const active = eventTypes.find((e) => e.id === selected)!;

  /** 행사형: 규모 밴드 + 예상 범위. 디자인형: 가격칩. */
  const isDesign = ESTIMATE_DESIGN_IDS.includes(active.id);
  const scales = ESTIMATE_SCALES[active.id];
  const scale = useMemo(() => {
    if (!scales) return null;
    const id = scaleSel[active.id] ?? scales[0].id;
    return scales.find((s) => s.id === id) ?? scales[0];
  }, [scales, scaleSel, active.id]);
  const rangeText = scale ? formatRangeText(scale) : "";
  const chips = ESTIMATE_CHIPS[active.id];

  return (
    <section id="estimate" className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-slate-200 px-4 py-10 md:px-12 md:py-24 lg:px-20">
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <BlurFade delay={0.1}>
          <div className="mb-1 font-[var(--font-inter)] text-xs font-extrabold tracking-[0.25em] text-blue-500/80 md:text-base">ESTIMATE</div>
          <div className="mb-2 h-[2px] w-8 rounded-full bg-blue-400 md:mb-4 md:w-10" />
          <h2 className="mb-2 text-xl font-bold text-gray-900 md:mb-4 md:text-5xl">견적 안내</h2>
          <p className="mb-6 text-xs text-gray-500 md:mb-14 md:text-base">행사 유형에 따른 예상 견적을 확인하세요</p>
        </BlurFade>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch lg:gap-6">
          {/* Left: Event Type Selector — 서비스 6종 (행사 3 + 디자인 3) */}
          {/* 모바일 = 가로 스크롤 필터 칩 (/work 모바일과 동일 패턴), 데스크탑 = 세로 카드 리스트 */}
          <div className="min-w-0 lg:hidden">
            <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide">
              <div className="flex gap-2 pb-1">
                {ESTIMATE_GROUPS.flatMap((group) =>
                  group.ids
                    .map((id) => eventTypes.find((e) => e.id === id))
                    .filter((e): e is EventType => !!e)
                ).map((event) => {
                  const isActive = selected === event.id;
                  const isDesignChip = ESTIMATE_DESIGN_IDS.includes(event.id);
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelected(event.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? isDesignChip
                            ? "bg-indigo-600 text-white"
                            : "bg-blue-600 text-white"
                          : "border border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      <event.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {event.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden flex-col gap-3 lg:flex">
            {ESTIMATE_GROUPS.map((group, gi) => (
              <div key={group.label} className={`flex flex-1 flex-col ${gi === 0 ? "relative" : ""}`}>
                <BlurFade delay={0.12 + gi * 0.1} className={gi === 0 ? "absolute -top-6 left-0" : ""}>
                  <p className="mb-1.5 px-1 text-xs font-semibold tracking-wider text-gray-400">
                    {group.label}
                  </p>
                </BlurFade>
                <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-2.5">
                  {group.ids
                    .map((id) => eventTypes.find((e) => e.id === id))
                    .filter((e): e is EventType => !!e)
                    .map((event, i) => (
                      <BlurFade key={event.id} delay={0.15 + gi * 0.1 + i * 0.04} className="flex">
                        <button
                          onClick={() => setSelected(event.id)}
                          className={`flex w-full items-center gap-4 rounded-xl ${event.bg} px-5 py-3.5 text-left transition-all ${
                            selected === event.id
                              ? "shadow-md ring-2 ring-blue-300"
                              : "hover:shadow-md"
                          }`}
                        >
                          <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${event.iconBg}`}>
                            <event.icon className="h-[18px] w-[18px] text-gray-700" strokeWidth={1.5} />
                          </span>
                          <div className="min-w-0">
                            <div className={`text-sm font-bold leading-tight ${selected === event.id ? "text-blue-600" : "text-gray-800"}`}>
                              {event.name}
                            </div>
                            <div className="truncate text-xs leading-tight text-gray-400">{event.desc}</div>
                          </div>
                        </button>
                      </BlurFade>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Estimate Detail */}
          <div ref={estimateCardRef} className="flex min-w-0 lg:min-h-[590px] xl:min-h-[500px] min-[1440px]:min-h-[468px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
              >
                {/* Header - Blue Gradient */}
                <div className="bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-4 py-3.5 md:px-8 md:py-4">
                  <div className="flex items-center gap-2.5 md:gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 md:h-11 md:w-11 md:rounded-xl">
                      <active.icon className="h-4 w-4 text-white md:h-5 md:w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white md:text-lg">{active.name}</h3>
                      <p className="text-[10px] text-blue-100/80 md:text-xs">{active.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Accordion + Items */}
                <div className="flex-1 px-4 py-4 md:px-8 md:py-4">
                  {!isDesign && scales && scale ? (
                    <>
                      {/* 규모 선택 */}
                      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-blue-500 md:text-xs">
                        {active.id === "booth" ? "부스 규모를 선택하세요" : "예상 인원을 선택하세요"}
                      </div>
                      <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:px-0 md:overflow-visible">
                        <div className="flex gap-2 pb-1 md:grid md:grid-cols-4 md:pb-0">
                          {scales.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setScaleSel((prev) => ({ ...prev, [active.id]: s.id }))}
                              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all md:whitespace-normal md:leading-tight md:rounded-xl md:px-1.5 md:py-2.5 md:text-[13px] ${
                                scale.id === s.id
                                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 예상 범위 */}
                      <div className="mt-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-4 text-center md:py-4">
                        <div className="text-[11px] font-semibold text-blue-100 md:text-xs">예상 견적 범위</div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={scale.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="mt-1 text-xl font-extrabold text-white md:text-3xl"
                          >
                            {rangeText}
                          </motion.div>
                        </AnimatePresence>
                        <div className="mt-2 text-[11px] text-blue-100/75 md:text-xs">
                          대행 용역비 기준(대관료·식음 등 실비 별도)
                        </div>
                      </div>

                      {/* 포함/제외 상세 (접이식) */}
                      <button
                        onClick={() => setShowDetail((v) => !v)}
                        className="mt-2.5 flex w-full items-center justify-between rounded-lg border border-blue-200 bg-blue-50/60 px-3.5 py-2.5 text-[12px] font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50 md:text-[13px]"
                      >
                        <span>무엇이 포함되고, 무엇이 별도인가요?</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <span className="text-[11px] font-medium text-blue-500">{showDetail ? "접기" : "펼쳐보기"}</span>
                          <motion.span animate={{ rotate: showDetail ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4 text-blue-500" />
                          </motion.span>
                        </span>
                      </button>
                      <AnimatePresence>
                        {showDetail && ESTIMATE_DETAIL[active.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 grid gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 sm:grid-cols-2 md:p-4">
                              <div>
                                <p className="mb-2 text-[11px] font-bold text-blue-600">견적에 포함</p>
                                <ul className="space-y-1.5">
                                  {ESTIMATE_DETAIL[active.id].included.map((t) => (
                                    <li key={t} className="flex items-start gap-1.5 text-[11px] leading-snug text-gray-600 md:text-[12px]">
                                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" strokeWidth={2.5} />
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="mb-2 text-[11px] font-bold text-gray-400">별도 · 실비 · 옵션</p>
                                <ul className="space-y-1.5">
                                  {ESTIMATE_DETAIL[active.id].excluded.map((t) => (
                                    <li key={t} className="flex items-start gap-1.5 text-[11px] leading-snug text-gray-500 md:text-[12px]">
                                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" strokeWidth={2.5} />
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700 md:text-xs">
                        실제 견적의 약 80%가 위 범위 안에서 결정됩니다. 프로그램 구성·장비 사양에 따라 달라지며,
                        행사 정보를 알려주시면 1영업일 내 항목별 상세 견적서를 보내드립니다.
                      </p>

                      {/* 견적 요청 */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowOrder(true)}
                        className="relative mt-2.5 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-sm font-bold text-white shadow-sm transition-shadow hover:shadow-md md:text-base"
                      >
                        이 조건으로 상세 견적 요청하기
                        <BorderBeam size={120} duration={8} colorFrom="#93c5fd" colorTo="#a5b4fc" borderWidth={1.5} />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      {/* 디자인: 품목 가격칩 */}
                      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-blue-500 md:text-xs">
                        품목별 기준 단가
                      </div>
                      <div className="space-y-2">
                        {(chips ?? []).map((c) => (
                          <div key={c.name} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Check className="h-4 w-4 text-blue-500" strokeWidth={2.5} />
                              {c.name}
                            </span>
                            <span className="text-sm font-bold text-blue-600">{c.text}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700 md:text-xs">
                        수정 3회 포함 기준이며, 수량·규격에 따라 조정됩니다. 품목·수량별 정확한 금액은 디자인
                        견적 계산기에서 바로 확인할 수 있습니다.
                      </p>
                    </>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={() => setShowOrder(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-6 py-5 md:px-8 md:py-6">
                <div
                  className="pointer-events-none absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white md:text-xl">상세 견적 요청</h3>
                    <p className="mt-1 text-xs text-blue-100/80 md:text-sm">선택하신 조건으로 상세 견적서를 요청합니다</p>
                  </div>
                  <button
                    onClick={() => setShowOrder(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/80 transition-all hover:bg-white/25 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[calc(90vh-88px)] overflow-y-auto">
                {/* Estimate Summary */}
                <div className="mx-6 mt-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 p-4 md:mx-8 md:mt-6 md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500">
                      <active.icon className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                    </span>
                    <span className="text-xs font-bold text-blue-600">{active.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    {scale && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">규모</span>
                        <span className="font-medium text-gray-700">{scale.label}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">포함 범위</span>
                      <span className="max-w-[70%] text-right font-medium text-gray-700">{ESTIMATE_INCLUDES[active.id] ?? active.desc}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-blue-200/60 pt-3">
                    <span className="text-sm font-bold text-gray-800">예상 견적 범위</span>
                    <span className="text-xl font-extrabold text-blue-600">{rangeText}</span>
                  </div>
                </div>

                {/* Order Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleOrderSubmit(); }} className="px-6 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6">
                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    {/* Left Column */}
                    <div className="space-y-5 md:space-y-6">
                      <div>
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                          <div className="h-5 w-1 rounded-full bg-blue-500" />
                          <h4 className="text-sm font-bold text-gray-900">회사 · 기관 정보</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">회사/기관명 <span className="text-red-400">*</span></label>
                            <input type="text" placeholder="(주)파란컴퍼니" value={form.organization} onChange={(e) => updateField("organization", e.target.value)} onBlur={() => handleBlur("organization")} className={`w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${touched.organization && getFieldError(form, "organization") ? "border-red-300" : "border-gray-200"}`} />
                            {touched.organization && getFieldError(form, "organization") && <p className="mt-1 text-xs text-red-400">{getFieldError(form, "organization")}</p>}
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">부서/소속</label>
                            <input type="text" placeholder="마케팅팀" value={form.department} onChange={(e) => updateField("department", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                          <div className="h-5 w-1 rounded-full bg-blue-500" />
                          <h4 className="text-sm font-bold text-gray-900">담당자 정보</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">이름 <span className="text-red-400">*</span></label>
                            <input type="text" placeholder="홍길동" value={form.contactName} onChange={(e) => updateField("contactName", e.target.value)} onBlur={() => handleBlur("contactName")} className={`w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${touched.contactName && getFieldError(form, "contactName") ? "border-red-300" : "border-gray-200"}`} />
                            {touched.contactName && getFieldError(form, "contactName") && <p className="mt-1 text-xs text-red-400">{getFieldError(form, "contactName")}</p>}
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">직급/직책</label>
                            <input type="text" placeholder="대리" value={form.position} onChange={(e) => updateField("position", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">연락처 <span className="text-red-400">*</span></label>
                            <input type="tel" inputMode="numeric" maxLength={14} placeholder="010-1234-5678" value={form.phone} onChange={(e) => updateField("phone", formatPhoneNumber(e.target.value))} onBlur={() => handleBlur("phone")} className={`w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${touched.phone && getFieldError(form, "phone") ? "border-red-300" : "border-gray-200"}`} />
                            {touched.phone && getFieldError(form, "phone") && <p className="mt-1 text-xs text-red-400">{getFieldError(form, "phone")}</p>}
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">이메일 <span className="text-red-400">*</span></label>
                            <input type="email" placeholder="example@email.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} onBlur={() => handleBlur("email")} className={`w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${touched.email && getFieldError(form, "email") ? "border-red-300" : "border-gray-200"}`} />
                            {touched.email && getFieldError(form, "email") && <p className="mt-1 text-xs text-red-400">{getFieldError(form, "email")}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5 md:space-y-6">
                      <div>
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                          <div className="h-5 w-1 rounded-full bg-indigo-500" />
                          <h4 className="text-sm font-bold text-gray-900">행사 정보</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-500">행사 예정일</label>
                              <input type="date" value={form.eventDate} onChange={(e) => updateField("eventDate", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-gray-500">예산 범위</label>
                              <select value={form.budgetRange} onChange={(e) => updateField("budgetRange", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-600 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100">
                                <option value="">선택해주세요</option>
                                <option value="~500">500만원 이하</option>
                                <option value="500~1000">500 ~ 1,000만원</option>
                                <option value="1000~3000">1,000 ~ 3,000만원</option>
                                <option value="3000~5000">3,000 ~ 5,000만원</option>
                                <option value="5000~1억">5,000만원 ~ 1억원</option>
                                <option value="1억~">1억원 이상</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">행사 장소</label>
                            <input type="text" placeholder="코엑스 3층 컨퍼런스홀" value={form.eventVenue} onChange={(e) => updateField("eventVenue", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                          <div className="h-5 w-1 rounded-full bg-indigo-500" />
                          <h4 className="text-sm font-bold text-gray-900">유입경로</h4>
                          <span className="text-[11px] text-gray-400">중복 선택 가능</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {REFERRAL_SOURCES.map((src) => {
                            const selected = referralSources.includes(src);
                            return (
                              <button
                                key={src}
                                type="button"
                                onClick={() => toggleReferral(src)}
                                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                  selected
                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                }`}
                              >
                                {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                                {src}
                              </button>
                            );
                          })}
                        </div>
                        {referralSources.includes(REFERRAL_OTHER) && (
                          <input
                            type="text"
                            placeholder="어떤 경로로 알게 되셨나요? (예: 박람회, 명함, 추천글 등)"
                            value={referralOther}
                            onChange={(e) => setReferralOther(e.target.value)}
                            maxLength={80}
                            className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                          />
                        )}
                      </div>

                      <div>
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                          <div className="h-5 w-1 rounded-full bg-indigo-500" />
                          <h4 className="text-sm font-bold text-gray-900">추가 요청사항</h4>
                        </div>
                        <textarea
                          rows={5}
                          placeholder="행사 목적, 참석자 규모, 특별 요청사항 등을 자유롭게 작성해주세요"
                          value={form.memo}
                          onChange={(e) => updateField("memo", e.target.value)}
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {/* 파일 첨부 */}
                      <div>
                        <div className="mb-3 flex items-center gap-2 md:mb-4">
                          <div className="h-5 w-1 rounded-full bg-indigo-500" />
                          <h4 className="text-sm font-bold text-gray-900">파일 첨부</h4>
                          <span className="text-[11px] text-gray-400">선택사항 (최대 {MAX_FILES}개, 10MB 이하)</span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.hwpx,.zip,.txt"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={files.length >= MAX_FILES}
                          className="flex items-center gap-1.5 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-40"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          파일 선택 (이미지, PDF, 문서)
                        </button>
                        {files.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {files.map((file, idx) => (
                              <div
                                key={`${file.name}-${idx}`}
                                className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2"
                              >
                                {isImageType(file.type) ? (
                                  <ImageIcon className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                                ) : (
                                  <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                )}
                                <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{file.name}</span>
                                <span className="shrink-0 text-xs text-gray-400">{formatFileSize(file.size)}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  className="shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-5 md:mt-8 md:pt-6">
                    <p className="flex-1 text-xs leading-relaxed text-gray-400">
                      접수 후 1영업일 이내 담당자가 연락드립니다.<br />
                      <span className="text-red-400">*</span> 표시는 필수 입력 항목입니다.
                    </p>
                    <motion.button
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-shadow hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 md:px-10 md:py-3.5"
                    >
                      {(submitting || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                      {uploading ? "파일 업로드 중..." : submitting ? "처리 중..." : "견적 요청하기"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
