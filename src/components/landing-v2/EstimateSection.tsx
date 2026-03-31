"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { Mic, MessageSquare, PenTool, Check, Plus, Minus, X, ChevronDown, Loader2, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { BorderBeam } from "@/components/ui/border-beam";
import { ESTIMATE_EVENT_TYPES, formatPriceWon } from "@/lib/pricing";

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
  seminar: { icon: Mic, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  forum: { icon: MessageSquare, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
  editorial: { icon: PenTool, bg: "bg-white border border-gray-200", iconBg: "bg-gray-100" },
};

const eventTypes: EventType[] = ESTIMATE_EVENT_TYPES.map((et) => ({
  ...et,
  icon: ICONS[et.id]?.icon ?? Mic,
  bg: ICONS[et.id]?.bg ?? "bg-gray-100/80",
  iconBg: ICONS[et.id]?.iconBg ?? "bg-gray-200/80",
}));

const formatPrice = formatPriceWon;

interface CheckedState {
  [itemName: string]: { checked: boolean; qty: number };
}

function getDefaultChecked(items: EstimateItem[]): CheckedState {
  const state: CheckedState = {};
  for (const item of items) {
    state[item.name] = { checked: !!item.default, qty: 1 };
  }
  return state;
}

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;
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
  const [selected, setSelected] = useState<string>("seminar");
  const [checkedItems, setCheckedItems] = useState<CheckedState>(() =>
    getDefaultChecked(eventTypes[0].items)
  );
  const [showOrder, setShowOrder] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const estimateCardRef = useRef<HTMLDivElement>(null);

  // 견적내기 확장 시 카드 하단이 보이도록 스크롤
  useEffect(() => {
    if (expanded && estimateCardRef.current) {
      const timer = setTimeout(() => {
        const rect = estimateCardRef.current!.getBoundingClientRect();
        const bottomGap = rect.bottom - window.innerHeight;
        if (bottomGap > -60) {
          window.scrollBy({ top: bottomGap + 60, behavior: "smooth" });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  // Order form state
  const [form, setForm] = useState<OrderForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (key: keyof OrderForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setTouched({});
    setFiles([]);
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

    // Build cart items from checked estimate items
    const cartItems = active.items
      .filter((item) => checkedItems[item.name]?.checked)
      .map((item) => ({
        name: item.name,
        price: item.price,
        qty: checkedItems[item.name]?.qty ?? 1,
        unit: item.unit,
      }));

    // Combine position, budgetRange, memo into one memo field
    const memoParts: string[] = [];
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
        total_amount: total,
        attachments,
      });
      showToast("주문 요청이 완료되었습니다");
      setShowOrder(false);
      resetForm();
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const active = eventTypes.find((e) => e.id === selected)!;

  useEffect(() => {
    setCheckedItems(getDefaultChecked(active.items));
    setExpanded(false);
  }, [active]);

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: { ...prev[name], checked: !prev[name].checked },
    }));
  };

  const changeQty = (name: string, delta: number) => {
    setCheckedItems((prev) => {
      const current = prev[name].qty;
      const next = Math.max(1, current + delta);
      return { ...prev, [name]: { ...prev[name], qty: next } };
    });
  };

  const total = useMemo(() => {
    let sum = 0;
    for (const item of active.items) {
      const state = checkedItems[item.name];
      if (state?.checked) {
        sum += item.price * state.qty;
      }
    }
    return sum;
  }, [active, checkedItems]);

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

        <div className="grid items-end gap-4 lg:grid-cols-2 lg:gap-6">
          {/* Left: Event Type Selector */}
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-3 lg:self-end">
            {eventTypes.map((event, i) => (
              <BlurFade key={event.id} delay={0.15 + i * 0.05}>
                <button
                  onClick={() => setSelected(event.id)}
                  className={`flex h-14 w-full items-center gap-1.5 rounded-lg ${event.bg} px-2.5 text-left transition-all lg:h-auto lg:gap-4 lg:rounded-xl lg:px-5 lg:py-4 ${
                    selected === event.id
                      ? "shadow-md ring-2 ring-blue-300"
                      : "hover:shadow-md"
                  }`}
                >
                  <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md lg:h-10 lg:w-10 lg:rounded-lg ${event.iconBg}`}>
                    <event.icon className="h-3 w-3 text-gray-700 lg:h-5 lg:w-5" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <div className={`text-[11px] font-bold leading-tight lg:text-sm ${selected === event.id ? "text-blue-600" : "text-gray-800"}`}>
                      {event.name}
                    </div>
                    <div className="truncate text-[9px] leading-tight text-gray-400 lg:text-xs">{event.desc}</div>
                  </div>
                </button>
              </BlurFade>
            ))}
          </div>

          {/* Right: Estimate Detail */}
          <div ref={estimateCardRef} className="flex">
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
                <div className="bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] px-4 py-4 md:px-8 md:py-6">
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
                <div className="flex-1 px-4 py-4 md:px-8 md:py-5">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-blue-500 md:mb-4 md:text-xs">견적을 확인하세요</div>

                  {/* Accordion Toggle */}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5 transition-colors hover:bg-gray-100"
                  >
                    <span className="text-sm font-bold text-gray-700">견적내기</span>
                    <motion.span
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </motion.span>
                  </button>

                  {/* Expandable Items */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-700 md:text-xs">
                          아래 금액은 참고용 기본 단가이며, 실제 비용은 행사 규모·조건에 따라 달라집니다. 정확한 견적은 상담을 통해 안내드립니다.
                        </p>
                        <div className="space-y-2 pt-3">
                          {active.items.map((item) => {
                            const state = checkedItems[item.name];
                            const isChecked = state?.checked ?? false;
                            const qty = state?.qty ?? 1;
                            return (
                              <div
                                key={item.name}
                                className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                                  isChecked ? "bg-blue-50/60" : "bg-gray-50/30"
                                }`}
                              >
                                <button
                                  onClick={() => toggleItem(item.name)}
                                  className="flex items-center gap-2.5 text-left"
                                >
                                  <span
                                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded ${
                                      isChecked
                                        ? "bg-blue-500 text-white"
                                        : "border border-gray-300 bg-white"
                                    }`}
                                  >
                                    {isChecked && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                                  </span>
                                  <span className={`text-sm ${isChecked ? "font-medium text-gray-800" : "text-gray-500"}`}>
                                    {item.name}
                                  </span>
                                </button>

                                <div className="flex items-center gap-3">
                                  {isChecked && (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => changeQty(item.name, -1)}
                                        className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>
                                      <span className="w-6 text-center text-sm font-medium text-gray-700">
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() => changeQty(item.name, 1)}
                                        className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                      <span className="ml-0.5 text-xs text-gray-400">{item.unit}</span>
                                    </div>
                                  )}
                                  <span className={`min-w-[5rem] text-right text-sm font-semibold ${isChecked ? "text-blue-600" : "text-gray-400"}`}>
                                    {isChecked
                                      ? formatPrice(item.price * qty)
                                      : formatPrice(item.price)
                                    }
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Total */}
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-4">
                          <span className="text-sm font-semibold text-blue-100">총 예상 견적</span>
                          <span className="text-xl font-bold text-white">
                            {formatPrice(total)}~
                          </span>
                        </div>

                        {/* Order Button */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowOrder(true)}
                          className="relative mt-3 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3.5 text-base font-bold text-white shadow-sm transition-shadow hover:shadow-md"
                        >
                          견적내기
                          <BorderBeam size={120} duration={8} colorFrom="#93c5fd" colorTo="#a5b4fc" borderWidth={1.5} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA */}
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 md:px-8 md:py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-gray-400 md:text-xs">정확한 견적은 상담을 통해 안내드립니다</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="relative overflow-hidden rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-shadow hover:shadow-lg md:rounded-lg md:px-6 md:py-2.5 md:text-sm"
                    >
                      상담 요청하기
                      <BorderBeam size={80} duration={6} colorFrom="#93c5fd" colorTo="#a5b4fc" borderWidth={1} />
                    </motion.button>
                  </div>
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
                    <h3 className="text-lg font-bold text-white md:text-xl">주문 요청</h3>
                    <p className="mt-1 text-xs text-blue-100/80 md:text-sm">선택하신 견적으로 주문을 요청합니다</p>
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
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 md:grid-cols-2">
                    {active.items
                      .filter((item) => checkedItems[item.name]?.checked)
                      .map((item) => {
                        const qty = checkedItems[item.name]?.qty ?? 1;
                        return (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{item.name} x {qty}{item.unit}</span>
                            <span className="font-medium text-gray-700">{formatPrice(item.price * qty)}</span>
                          </div>
                        );
                      })}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-blue-200/60 pt-3">
                    <span className="text-sm font-bold text-gray-800">총 예상 견적</span>
                    <span className="text-xl font-extrabold text-blue-600">{formatPrice(total)}~</span>
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
                            <input type="tel" placeholder="010-1234-5678" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} onBlur={() => handleBlur("phone")} className={`w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${touched.phone && getFieldError(form, "phone") ? "border-red-300" : "border-gray-200"}`} />
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
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
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
                      {uploading ? "파일 업로드 중..." : submitting ? "처리 중..." : "주문 요청하기"}
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
