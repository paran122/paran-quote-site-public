"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { Phone, Mail, Printer, MapPin, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import AnimatedCheckbox from "@/components/ui/AnimatedCheckbox";

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

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

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
    if (!privacyAgreed) {
      showToast("개인정보 수집·이용에 동의해주세요.");
      return;
    }
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
      setForm(INITIAL_FORM);
      setTouched({});
      setPrivacyAgreed(false);
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Blue Gradient Header */}
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 px-4 pb-16 pt-6 text-center md:px-12 md:pb-40 md:pt-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <BlurFade delay={0.1}>
          <div className="mb-0.5 font-[var(--font-inter)] text-[9px] font-extrabold tracking-[0.25em] text-white/60 md:mb-1 md:text-base">CONTACT</div>
          <div className="mx-auto mb-1 h-[1.5px] w-6 rounded-full bg-white/40 md:mb-4 md:h-[2px] md:w-10" />
          <h2 className="text-lg font-bold text-white md:text-5xl">문의하기</h2>
          <p className="mx-auto mt-1 text-[9px] leading-relaxed text-blue-100/80 md:mt-4 md:max-w-md md:text-sm">
            무엇이든 문의하세요. 행사 기획부터 운영까지, 파란컴퍼니와 함께 시작하세요.
          </p>
        </BlurFade>
      </div>

      {/* Content Area with overlapping card */}
      <div className="bg-gradient-to-b from-gray-50 to-white px-3 pb-6 md:px-12 md:pb-16 lg:px-20">
        <div className="mx-auto -mt-10 max-w-4xl md:-mt-28">
          <BlurFade delay={0.2}>
            <div className="overflow-hidden rounded-lg bg-white shadow-2xl shadow-blue-900/10 md:rounded-2xl">
              {/* Contact Info Cards */}
              <div className="grid grid-cols-2 gap-1 p-2 md:grid-cols-2 md:gap-4 md:p-6 lg:grid-cols-3">
                <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50/60 px-2 py-1.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <Phone className="h-2.5 w-2.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-gray-800 md:text-sm">02-6342-2800</div>
                    <div className="text-[8px] text-gray-400 md:text-[11px]">평일 9:00~18:00</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50/60 px-2 py-1.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <Mail className="h-2.5 w-2.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[9px] font-bold text-gray-800 md:text-sm">info@parancompany.co.kr</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50/60 px-2 py-1.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <Printer className="h-2.5 w-2.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-gray-800 md:text-sm">0504-482-1305</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50/60 px-2 py-1.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <MapPin className="h-2.5 w-2.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-gray-800 md:text-sm">경기도 수원시 팔달구 효원로 278, 6층 603호</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-2 border-t border-gray-100 md:mx-6" />

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="px-2.5 py-2.5 md:px-10 md:py-8">
                {/* 담당자 정보 */}
                <div className="mb-2 md:mb-8">
                  <h3 className="mb-1 text-[10px] font-bold text-gray-900 md:mb-4 md:text-base">담당자 정보</h3>
                  <div className="space-y-1.5 md:space-y-5">
                    <div className="grid grid-cols-2 gap-1.5 md:gap-5">
                      <div>
                        <label className="mb-0.5 block text-[9px] font-semibold text-gray-500 md:mb-2 md:text-xs">이름 <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          placeholder="홍길동"
                          value={form.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                          onBlur={() => handleBlur("contactName")}
                          className={`w-full rounded border bg-white px-2 py-1.5 text-[10px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.contactName && getFieldError(form, "contactName") ? "border-red-300" : "border-gray-200"}`}
                        />
                        {touched.contactName && getFieldError(form, "contactName") && <p className="mt-0.5 text-[9px] text-red-400 md:text-xs">{getFieldError(form, "contactName")}</p>}
                      </div>
                      <div>
                        <label className="mb-0.5 block text-[9px] font-semibold text-gray-500 md:mb-2 md:text-xs">연락처 <span className="text-red-400">*</span></label>
                        <input
                          type="tel"
                          placeholder="010-1234-5678"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          className={`w-full rounded border bg-white px-2 py-1.5 text-[10px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.phone && getFieldError(form, "phone") ? "border-red-300" : "border-gray-200"}`}
                        />
                        {touched.phone && getFieldError(form, "phone") && <p className="mt-0.5 text-[9px] text-red-400 md:text-xs">{getFieldError(form, "phone")}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="mb-0.5 block text-[9px] font-semibold text-gray-500 md:mb-2 md:text-xs">이메일 <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`w-full rounded border bg-white px-2 py-1.5 text-[10px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.email && getFieldError(form, "email") ? "border-red-300" : "border-gray-200"}`}
                      />
                      {touched.email && getFieldError(form, "email") && <p className="mt-0.5 text-[9px] text-red-400 md:text-xs">{getFieldError(form, "email")}</p>}
                    </div>
                  </div>
                </div>

                {/* 문의 내용 */}
                <div className="mb-2 md:mb-8">
                  <h3 className="mb-1 text-[10px] font-bold text-gray-900 md:mb-4 md:text-base">문의 내용 <span className="text-red-400">*</span></h3>
                  <textarea
                    rows={3}
                    placeholder="프로젝트에 대해 알려주세요"
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    className={`w-full resize-none rounded border bg-white px-2 py-1.5 text-[10px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.message && getFieldError(form, "message") ? "border-red-300" : "border-gray-200"}`}
                  />
                  {touched.message && getFieldError(form, "message") && <p className="mt-0.5 text-[9px] text-red-400 md:text-xs">{getFieldError(form, "message")}</p>}
                </div>

                {/* 개인정보 동의 */}
                <div className="mb-2 flex cursor-pointer items-start gap-2 md:mb-6 md:items-center md:gap-2.5" onClick={() => setPrivacyAgreed(!privacyAgreed)}>
                  <div className="mt-[3px] md:mt-0">
                    <AnimatedCheckbox
                      checked={privacyAgreed}
                      onChange={setPrivacyAgreed}
                      size="sm"
                      className="md:h-4 md:w-4"
                    />
                  </div>
                  <span className="text-[9px] leading-relaxed text-gray-500 md:text-xs">
                    <Link href="/privacy" target="_blank" className="font-semibold text-blue-600 underline underline-offset-2">개인정보 수집·이용</Link>에 동의합니다. (이름, 연락처, 이메일을 문의 응대 목적으로 수집하며, 목적 달성 후 즉시 파기합니다.)
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.99 }}
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-[11px] font-bold text-white shadow-lg shadow-blue-500/25 disabled:opacity-60 md:rounded-xl md:py-4 md:text-sm"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin md:h-4 md:w-4" />}
                  {submitting ? "처리 중..." : "문의 보내기"}
                </motion.button>
              </form>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
