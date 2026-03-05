"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^[\d\-]{9,15}$/;

interface ContactForm {
  contactName: string;
  phone: string;
  email: string;
  message: string;
}

const INITIAL_FORM: ContactForm = { contactName: "", phone: "", email: "", message: "" };

function getFieldError(form: ContactForm, key: string): string | null {
  if (key === "contactName" && !form.contactName.trim()) return "이름을 입력해주세요";
  if (key === "phone") {
    if (!form.phone.trim()) return "연락처를 입력해주세요";
    if (!PHONE_REGEX.test(form.phone.replace(/\s/g, ""))) return "올바른 전화번호를 입력해주세요";
  }
  if (key === "email") {
    if (!form.email.trim()) return "이메일을 입력해주세요";
    if (!EMAIL_REGEX.test(form.email.trim())) return "올바른 이메일 형식 (예: email@company.com)";
  }
  if (key === "message" && !form.message.trim()) return "문의 내용을 입력해주세요";
  return null;
}

const REQUIRED_FIELDS = ["contactName", "phone", "email", "message"] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 모달 닫힐 때 폼 리셋
  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      setTouched({});
    }
  }, [isOpen]);

  const updateField = (key: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = async () => {
    const allTouched: Record<string, boolean> = {};
    REQUIRED_FIELDS.forEach((key) => { allTouched[key] = true; });
    setTouched((prev) => ({ ...prev, ...allTouched }));

    const hasError = REQUIRED_FIELDS.some((key) => getFieldError(form, key) !== null);
    if (hasError || submitting) return;
    setSubmitting(true);

    const quoteNumber = `IQ-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;

    try {
      const { submitQuoteViaApi } = await import("@/lib/queries");
      await submitQuoteViaApi({
        quote_number: quoteNumber,
        contact_name: form.contactName,
        organization: "문의",
        phone: form.phone,
        email: form.email,
        event_name: "문의",
        event_date: new Date().toISOString().slice(0, 10),
        event_type: "문의",
        memo: form.message,
        cart_items: [],
        total_amount: 0,
      });
      showToast("문의가 접수되었습니다");
      onClose();
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 모달 */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">문의하기</h2>
            <p className="mt-0.5 text-[13px] text-slate-400">
              무엇이든 문의하세요. 빠르게 답변 드리겠습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 폼 */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="px-6 py-5"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
                  이름 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  onBlur={() => handleBlur("contactName")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-300 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                    touched.contactName && getFieldError(form, "contactName")
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                />
                {touched.contactName && getFieldError(form, "contactName") && (
                  <p className="mt-1 text-[12px] text-red-400">{getFieldError(form, "contactName")}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
                  연락처 <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-300 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                    touched.phone && getFieldError(form, "phone")
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                />
                {touched.phone && getFieldError(form, "phone") && (
                  <p className="mt-1 text-[12px] text-red-400">{getFieldError(form, "phone")}</p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
                이메일 <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-300 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                  touched.email && getFieldError(form, "email")
                    ? "border-red-300"
                    : "border-slate-200"
                }`}
              />
              {touched.email && getFieldError(form, "email") && (
                <p className="mt-1 text-[12px] text-red-400">{getFieldError(form, "email")}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
              문의 내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="프로젝트에 대해 알려주세요"
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              onBlur={() => handleBlur("message")}
              className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-300 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 ${
                touched.message && getFieldError(form, "message")
                  ? "border-red-300"
                  : "border-slate-200"
              }`}
            />
            {touched.message && getFieldError(form, "message") && (
              <p className="mt-1 text-[12px] text-red-400">{getFieldError(form, "message")}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-[14px] font-semibold text-white shadow-lg shadow-blue-500/20 transition-opacity disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "처리 중..." : "문의 보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
