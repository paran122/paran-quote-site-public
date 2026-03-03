"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Minus,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  User,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/constants";
import { showToast } from "@/components/ui/Toast";

const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EVENT_TYPE_OPTIONS = [
  "컨퍼런스/세미나",
  "기업 행사",
  "학술대회",
  "문화/축제",
  "기타",
];

const ATTENDEE_OPTIONS = [
  "50명 이하",
  "50~100명",
  "100~300명",
  "300~500명",
  "500명 이상",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getSubtotal, getDiscount, clearCart } =
    useCartStore();
  // 패키지 포함 서비스 보기 토글
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  // 모바일 탭
  const [mobileTab, setMobileTab] = useState<"cart" | "form">("cart");

  // 폼 상태
  const [form, setForm] = useState({
    contactName: "",
    organization: "",
    phone: "",
    email: "",
    department: "",
    eventName: "",
    eventDate: "",
    attendees: "",
    eventType: "",
    eventVenue: "",
    memo: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = subtotal;

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  // 필드별 에러 메시지
  const getFieldError = (key: string): string | null => {
    const value = form[key as keyof typeof form];
    if (key === "contactName" && !value.trim()) return "담당자 성함을 입력해주세요";
    if (key === "organization" && !value.trim()) return "기관/회사명을 입력해주세요";
    if (key === "phone") {
      if (!value.trim()) return "연락처를 입력해주세요";
      if (!PHONE_REGEX.test(value.trim())) return "올바른 연락처 형식을 입력해주세요 (예: 010-0000-0000)";
    }
    if (key === "email") {
      if (!value.trim()) return "이메일을 입력해주세요";
      if (!EMAIL_REGEX.test(value.trim())) return "올바른 이메일 형식을 입력해주세요 (예: email@company.com)";
    }
    if (key === "eventName" && !value.trim()) return "행사명을 입력해주세요";
    if (key === "eventDate" && !value.trim()) return "행사일을 선택해주세요";
    return null;
  };

  const REQUIRED_FIELDS = ["contactName", "organization", "phone", "email", "eventName", "eventDate"] as const;

  const isValid =
    REQUIRED_FIELDS.every((key) => getFieldError(key) === null) &&
    agreed &&
    items.length > 0;

  const handleSubmit = async () => {
    // 제출 시 모든 필수 필드를 touched로 표시
    const allTouched: Record<string, boolean> = {};
    REQUIRED_FIELDS.forEach((key) => { allTouched[key] = true; });
    setTouched((prev) => ({ ...prev, ...allTouched }));

    if (!isValid || submitting) return;
    setSubmitting(true);

    const quoteNumber = `QT-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;

    try {
      const { submitQuoteViaApi } = await import("@/lib/queries");
      await submitQuoteViaApi({
        quote_number: quoteNumber,
        contact_name: form.contactName,
        organization: form.organization,
        phone: form.phone,
        email: form.email,
        department: form.department || undefined,
        event_name: form.eventName,
        event_date: form.eventDate,
        event_venue: form.eventVenue || undefined,
        event_type: form.eventType || undefined,
        attendees: form.attendees || undefined,
        memo: form.memo || undefined,
        cart_items: items,
        total_amount: total,
        discount_amount: discount > 0 ? discount : undefined,
        user_id: undefined,
      });
      clearCart();
      showToast("견적 요청이 완료되었습니다");
      router.push(`/checkout/complete?qn=${quoteNumber}`);
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 빈 장바구니
  if (items.length === 0) {
    return (
      <div className="pt-[56px] min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1120]">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-[10px] flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} className="text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            장바구니가 비어 있습니다
          </h2>
          <p className="text-[13px] text-slate-500 mb-6">
            서비스를 추가하고 견적을 요청해보세요
          </p>
          <Link href="/services" className="btn-primary btn-lg justify-center">
            서비스 둘러보기
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      {/* 페이지 헤더 */}
      <div className="max-w-content mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          장바구니 &amp; 견적 요청
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">
          서비스를 확인하고 견적을 요청하세요
        </p>
      </div>

      {/* 모바일 탭 (lg 이하) */}
      <div className="lg:hidden max-w-content mx-auto px-6 mb-4">
        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-[6px] p-1">
          <button
            onClick={() => setMobileTab("cart")}
            className={`flex-1 py-2.5 text-[13px] font-semibold rounded-[4px] transition-colors ${
              mobileTab === "cart"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            장바구니 ({items.length})
          </button>
          <button
            onClick={() => setMobileTab("form")}
            className={`flex-1 py-2.5 text-[13px] font-semibold rounded-[4px] transition-colors ${
              mobileTab === "form"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            정보 입력
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 - 좌우 배치 */}
      <div className="max-w-content mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── 왼쪽: 장바구니 ── */}
          <div
            className={`flex-1 min-w-0 ${
              mobileTab !== "cart" ? "hidden lg:block" : ""
            }`}
          >
            <div className="space-y-4">
              {items.map((item) => {
                const isPackage = item.type === "package";
                const isExpanded = expandedPkg === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[10px] p-5 ${
                      isPackage
                        ? "bg-primary-50 border border-primary/20"
                        : "bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {/* 상단 */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-[6px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-bold text-slate-400">{item.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* 뱃지 */}
                        <div className="flex items-center gap-2 mb-1">
                          {isPackage && (
                            <>
                              <span className="text-[11px] font-medium bg-primary-50 text-primary px-2 py-0.5 rounded-[4px]">
                                패키지
                              </span>
                              {item.discountRate && (
                                <span className="text-[11px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-[4px]">
                                  {item.discountRate}% 할인
                                </span>
                              )}
                            </>
                          )}
                          {item.category && !isPackage && (
                            <span className="text-[12px] text-slate-400">
                              {item.category}
                            </span>
                          )}
                        </div>

                        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h3>

                        {/* 옵션 표시 */}
                        {item.options && (
                          <p className="text-[12px] text-slate-400 mt-0.5">
                            {item.options.size && `${item.options.size}`}
                            {item.options.addon &&
                              ` · ${item.options.addon}`}
                          </p>
                        )}

                        {/* 패키지 포함 서비스 토글 */}
                        {isPackage && item.includedServices && (
                          <button
                            onClick={() =>
                              setExpandedPkg(isExpanded ? null : item.id)
                            }
                            className="flex items-center gap-1 text-[12px] text-slate-500 font-medium mt-2 hover:text-slate-700"
                          >
                            {isExpanded ? (
                              <>
                                포함 서비스 닫기
                                <ChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                포함 서비스 보기 ({item.includedServices.length}
                                개)
                                <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* 삭제 */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-[6px] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0"
                        aria-label="삭제"
                      >
                        <X size={16} className="text-slate-400" />
                      </button>
                    </div>

                    {/* 패키지 포함 서비스 목록 */}
                    {isPackage && isExpanded && item.includedServices && (
                      <div className="mt-3 pl-12 space-y-1">
                        {item.includedServices.map((name) => (
                          <p
                            key={name}
                            className="text-[12px] text-slate-500 flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 bg-primary rounded-full shrink-0" />
                            {name}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* 하단: 수량 + 가격 */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-[6px] border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors dark:text-slate-300"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-[13px] font-semibold font-num w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-[6px] border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors dark:text-slate-300"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-num text-lg font-bold text-slate-900 dark:text-white">
                        {formatPrice(item.price * item.quantity)}원
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 요약 */}
            <div className="mt-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-[10px] p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">서비스 소계</span>
                  <span className="font-num text-slate-700 dark:text-slate-200">
                    {formatPrice(subtotal)}원
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-slate-500">패키지 할인</span>
                    <span className="font-num text-red-500 font-semibold">
                      -{formatPrice(discount)}원
                    </span>
                  </div>
                )}
                <hr className="border-slate-100 dark:border-slate-700/50" />
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                    합계
                  </span>
                  <span className="font-num text-2xl font-extrabold text-primary">
                    {formatPrice(total)}원
                  </span>
                </div>
              </div>
            </div>

            {/* 서비스 더 추가하기 */}
            <Link
              href="/services"
              className="mt-4 block text-center text-[13px] text-slate-500 font-medium hover:text-slate-700"
            >
              + 서비스 더 추가하기
            </Link>
          </div>

          {/* ── 오른쪽: 견적 폼 ── */}
          <div
            className={`lg:w-[45%] shrink-0 ${
              mobileTab !== "form" ? "hidden lg:block" : ""
            }`}
          >
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-[10px] p-6 space-y-8">
              {/* 담당자 정보 */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white mb-4">
                  <User size={18} className="text-primary" />
                  담당자 정보
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      담당자 성함 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={(e) =>
                        updateField("contactName", e.target.value)
                      }
                      onBlur={() => markTouched("contactName")}
                      placeholder="홍길동"
                      className={`w-full border rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 ${
                        touched.contactName && getFieldError("contactName")
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : "border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white focus:border-slate-400 focus:ring-slate-200"
                      }`}
                    />
                    {touched.contactName && getFieldError("contactName") && (
                      <p className="text-[12px] text-red-500 mt-1">{getFieldError("contactName")}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      기관/회사명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(e) =>
                        updateField("organization", e.target.value)
                      }
                      onBlur={() => markTouched("organization")}
                      placeholder="파란컴퍼니"
                      className={`w-full border rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 ${
                        touched.organization && getFieldError("organization")
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : "border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white focus:border-slate-400 focus:ring-slate-200"
                      }`}
                    />
                    {touched.organization && getFieldError("organization") && (
                      <p className="text-[12px] text-red-500 mt-1">{getFieldError("organization")}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      onBlur={() => markTouched("phone")}
                      placeholder="010-0000-0000"
                      className={`w-full border rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 ${
                        touched.phone && getFieldError("phone")
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : "border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white focus:border-slate-400 focus:ring-slate-200"
                      }`}
                    />
                    {touched.phone && getFieldError("phone") && (
                      <p className="text-[12px] text-red-500 mt-1">{getFieldError("phone")}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onBlur={() => markTouched("email")}
                      placeholder="email@company.com"
                      className={`w-full border rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 ${
                        touched.email && getFieldError("email")
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : "border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white focus:border-slate-400 focus:ring-slate-200"
                      }`}
                    />
                    {touched.email && getFieldError("email") && (
                      <p className="text-[12px] text-red-500 mt-1">{getFieldError("email")}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      부서
                    </label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) =>
                        updateField("department", e.target.value)
                      }
                      placeholder="교육팀"
                      className="w-full border border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* 행사 정보 */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white mb-4">
                  <Calendar size={18} className="text-primary" />
                  행사 기본 정보
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      행사명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.eventName}
                      onChange={(e) =>
                        updateField("eventName", e.target.value)
                      }
                      onBlur={() => markTouched("eventName")}
                      placeholder="2026 상반기 교육 컨퍼런스"
                      className={`w-full border rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 ${
                        touched.eventName && getFieldError("eventName")
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : "border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white focus:border-slate-400 focus:ring-slate-200"
                      }`}
                    />
                    {touched.eventName && getFieldError("eventName") && (
                      <p className="text-[12px] text-red-500 mt-1">{getFieldError("eventName")}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      행사일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) =>
                        updateField("eventDate", e.target.value)
                      }
                      onBlur={() => markTouched("eventDate")}
                      className={`w-full border rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:ring-1 ${
                        touched.eventDate && getFieldError("eventDate")
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : "border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white focus:border-slate-400 focus:ring-slate-200"
                      }`}
                    />
                    {touched.eventDate && getFieldError("eventDate") && (
                      <p className="text-[12px] text-red-500 mt-1">{getFieldError("eventDate")}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      예상 인원
                    </label>
                    <select
                      value={form.attendees}
                      onChange={(e) =>
                        updateField("attendees", e.target.value)
                      }
                      className="w-full border border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] rounded-[6px] px-4 py-2.5 text-[13px] text-slate-600 dark:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                    >
                      <option value="">선택하세요</option>
                      {ATTENDEE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      행사 유형
                    </label>
                    <select
                      value={form.eventType}
                      onChange={(e) =>
                        updateField("eventType", e.target.value)
                      }
                      className="w-full border border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] rounded-[6px] px-4 py-2.5 text-[13px] text-slate-600 dark:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                    >
                      <option value="">선택하세요</option>
                      {EVENT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      행사 장소
                    </label>
                    <input
                      type="text"
                      value={form.eventVenue}
                      onChange={(e) =>
                        updateField("eventVenue", e.target.value)
                      }
                      placeholder="소노캄 고양"
                      className="w-full border border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white rounded-[6px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      추가 요청사항
                    </label>
                    <textarea
                      value={form.memo}
                      onChange={(e) => updateField("memo", e.target.value)}
                      rows={3}
                      placeholder="추가 요청사항을 적어주세요"
                      className="w-full border border-slate-200 dark:border-slate-700 dark:bg-[#0b1120] dark:text-white rounded-[6px] px-4 py-2.5 text-[13px] resize-none focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* 개인정보 동의 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[6px] p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                  />
                  <span className="text-[13px] text-slate-600 dark:text-slate-300">
                    개인정보 수집 · 이용에 동의합니다{" "}
                    <button
                      type="button"
                      className="text-slate-500 text-[12px] underline ml-1"
                    >
                      상세보기
                    </button>
                  </span>
                </label>
              </div>

              {/* 제출 */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className="btn-primary btn-lg w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FileText size={18} />
                {submitting ? "요청 중..." : "견적 요청하기"}
              </button>

              <p className="text-[12px] text-slate-400 text-center">
                평균 1시간 이내 견적 회신
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
