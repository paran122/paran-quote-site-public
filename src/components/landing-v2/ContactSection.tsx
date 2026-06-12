"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";
import { Phone, Mail, Printer, MapPin, Loader2, Paperclip, X, FileText, Image as ImageIcon, Check } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import AnimatedCheckbox from "@/components/ui/AnimatedCheckbox";
import { REFERRAL_SOURCES, REFERRAL_OTHER, prependReferralToMemo } from "@/lib/referralSources";
import { formatPhoneNumber } from "@/lib/phoneFormat";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\-]{9,15}$/;

/* 서비스·시기 퀵셀렉트 (클릭만으로 문의 절반 완성) */
const SERVICE_OPTIONS = ["컨퍼런스·세미나", "교육·워크숍", "전시·홍보부스", "현수막·포스터", "PPT·카드뉴스·편집디자인", "전시부스·포토존", "아직 미정이에요"];
const TIMING_DATED = "날짜가 정해졌어요";
const TIMING_OPTIONS = [TIMING_DATED, "1개월 이내", "3개월 이내", "올해 안", "미정"];
const MESSAGE_PLACEHOLDERS: Record<string, string> = {
  "컨퍼런스·세미나": "예: 11월 중순 200명 규모 학술대회 견적이 궁금합니다.",
  "교육·워크숍": "예: 직원 80명 1박 2일 워크숍을 준비하고 있습니다.",
  "전시·홍보부스": "예: 박람회 부스(3×3m) 디자인부터 운영까지 견적이 궁금합니다.",
  "현수막·포스터": "예: 행사 포스터 1종과 현수막 2종 시안이 필요합니다.",
  "PPT·카드뉴스·편집디자인": "예: 발표용 PPT 20장 디자인을 맡기고 싶습니다.",
  "전시부스·포토존": "예: 행사장 포토존 디자인·제작이 필요합니다.",
};
const DEFAULT_PLACEHOLDER = "행사명, 예상 인원수, 참고 사항 등 자유롭게 적어주세요.";

interface ContactForm {
  contactName: string;
  organization: string;
  phone: string;
  email: string;
  message: string;
}

const INITIAL_FORM: ContactForm = { contactName: "", organization: "", phone: "", email: "", message: "" };

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
  return null;
}

const REQUIRED_FIELDS = ["contactName", "phone", "email"] as const;

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [referralSources, setReferralSources] = useState<string[]>([]);
  const [referralOther, setReferralOther] = useState("");
  const [serviceSel, setServiceSel] = useState("");
  const [timingSel, setTimingSel] = useState("");
  const [eventDate, setEventDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (key: keyof ContactForm, value: string) => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const totalCount = files.length + selected.length;
    if (totalCount > MAX_FILES) {
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
      let attachments: UploadedFile[] = [];
      if (files.length > 0) {
        attachments = await uploadFiles();
      }

      // 퀵셀렉트 값을 memo 상단에 합성 (백엔드 변경 없이 전달)
      const metaLines: string[] = [];
      if (serviceSel) metaLines.push(`관심 서비스: ${serviceSel}`);
      if (timingSel) {
        metaLines.push(
          timingSel === TIMING_DATED && eventDate
            ? `행사 시기: ${eventDate} (확정)`
            : `행사 시기: ${timingSel}`
        );
      }
      const messageWithMeta = [metaLines.join("\n"), form.message].filter(Boolean).join("\n");

      const { submitQuoteViaApi } = await import("@/lib/queries");
      await submitQuoteViaApi({
        quote_number: quoteNumber,
        contact_name: form.contactName,
        organization: form.organization.trim() || "문의",
        phone: form.phone,
        email: form.email,
        event_name: serviceSel ? `${serviceSel} 문의` : "문의",
        event_date: (timingSel === TIMING_DATED && eventDate) || new Date().toISOString().slice(0, 10),
        event_type: serviceSel || "문의",
        memo: prependReferralToMemo(referralSources, messageWithMeta, referralOther),
        cart_items: [],
        total_amount: 0,
        attachments,
      });
      showToast("문의가 접수되었습니다. 1영업일 내 연락드리겠습니다");
      setForm(INITIAL_FORM);
      setTouched({});
      setPrivacyAgreed(false);
      setFiles([]);
      setReferralSources([]);
      setReferralOther("");
      setServiceSel("");
      setTimingSel("");
      setEventDate("");
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
          <div className="mb-1 font-[var(--font-inter)] text-[11px] font-extrabold tracking-[0.25em] text-white/60 md:text-base">CONTACT</div>
          <div className="mx-auto mb-1 h-[1.5px] w-6 rounded-full bg-white/40 md:mb-4 md:h-[2px] md:w-10" />
          <h2 className="text-2xl font-bold text-white md:text-5xl">문의하기</h2>
          <p className="mx-auto mt-2 max-w-[300px] text-[12px] leading-relaxed text-blue-100/80 md:mt-4 md:max-w-md md:text-sm">
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
              <div className="grid grid-flow-dense grid-cols-2 gap-2 p-3 md:gap-4 md:p-6 xl:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <Phone className="h-3.5 w-3.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-gray-800 md:text-sm">02-6342-2800</div>
                    <div className="text-[10px] text-gray-400 md:text-[11px]">평일 9:00~18:00</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 md:col-span-1 md:items-start md:gap-3 md:rounded-xl md:px-4 md:py-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <Mail className="h-3.5 w-3.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0 md:self-center">
                    <div className="whitespace-nowrap text-[12px] font-bold leading-snug text-gray-800 md:text-[clamp(11px,0.95vw,13px)]">info@parancompany.co.kr</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <Printer className="h-3.5 w-3.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-gray-800 md:text-sm">0504-482-1305</div>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5 md:items-start md:gap-4 md:rounded-xl md:px-5 md:py-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 md:h-10 md:w-10 md:rounded-lg">
                    <MapPin className="h-3.5 w-3.5 text-blue-500 md:h-[18px] md:w-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-bold text-gray-800 md:text-sm">경기도 수원시 팔달구 효원로 278, 6층 603호</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-2 border-t border-gray-100 md:mx-6" />

              {/* Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="px-4 py-5 md:px-10 md:py-8">
                {/* 회신 약속 배지 */}
                <div className="mb-5 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5 md:mb-8 md:rounded-xl md:px-4 md:py-3">
                  <Check className="h-4 w-4 shrink-0 text-blue-500" strokeWidth={3} />
                  <span className="text-[12px] font-semibold text-blue-700 md:text-[13px]">보내주시면 1영업일 내 담당자가 직접 회신합니다</span>
                </div>

                {/* 1. 서비스 선택 */}
                <div className="mb-6 md:mb-8">
                  <div className="mb-2.5 flex items-center gap-1.5 md:mb-4 md:gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white md:text-[11px]">1</span>
                    <h3 className="text-[14px] font-bold text-gray-900 md:text-base">어떤 서비스가 필요하세요?</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {SERVICE_OPTIONS.map((opt) => {
                      const selected = serviceSel === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setServiceSel(selected ? "" : opt)}
                          className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors md:gap-1.5 md:px-3.5 md:py-2 md:text-xs ${
                            selected
                              ? "border-blue-500 bg-blue-50 text-blue-600"
                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. 시기 선택 */}
                <div className="mb-6 md:mb-8">
                  <div className="mb-2.5 flex items-center gap-1.5 md:mb-4 md:gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white md:text-[11px]">2</span>
                    <h3 className="text-[14px] font-bold text-gray-900 md:text-base">행사는 언제쯤인가요?</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                    {TIMING_OPTIONS.map((opt) => {
                      const selected = timingSel === opt;
                      return (
                        <div key={opt} className="flex items-center gap-1 md:gap-2">
                          <button
                            type="button"
                            onClick={() => setTimingSel(selected ? "" : opt)}
                            className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors md:gap-1.5 md:px-3.5 md:py-2 md:text-xs ${
                              selected
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                          >
                            {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                            {opt}
                          </button>
                          {opt === TIMING_DATED && timingSel === TIMING_DATED && (
                            <input
                              type="date"
                              autoFocus
                              value={eventDate}
                              onChange={(e) => setEventDate(e.target.value)}
                              className="rounded-full border border-blue-400 bg-blue-50/50 px-3 py-1.5 text-[12px] font-medium text-blue-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 md:text-xs"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. 연락받을 곳 */}
                <div className="mb-6 md:mb-8">
                  <div className="mb-2.5 flex items-center gap-1.5 md:mb-4 md:gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white md:text-[11px]">3</span>
                    <h3 className="text-[14px] font-bold text-gray-900 md:text-base">연락받을 곳</h3>
                  </div>
                  <div className="space-y-3 md:space-y-5">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-gray-500 md:mb-2 md:text-xs">이름 <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          placeholder="홍길동"
                          value={form.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                          onBlur={() => handleBlur("contactName")}
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.contactName && getFieldError(form, "contactName") ? "border-red-300" : "border-gray-200"}`}
                        />
                        {touched.contactName && getFieldError(form, "contactName") && <p className="mt-1 text-[11px] text-red-400 md:text-xs">{getFieldError(form, "contactName")}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-gray-500 md:mb-2 md:text-xs">연락처 <span className="text-red-400">*</span></label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={14}
                          placeholder="010-1234-5678"
                          value={form.phone}
                          onChange={(e) => updateField("phone", formatPhoneNumber(e.target.value))}
                          onBlur={() => handleBlur("phone")}
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.phone && getFieldError(form, "phone") ? "border-red-300" : "border-gray-200"}`}
                        />
                        {touched.phone && getFieldError(form, "phone") && <p className="mt-1 text-[11px] text-red-400 md:text-xs">{getFieldError(form, "phone")}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-gray-500 md:mb-2 md:text-xs">이메일 <span className="text-red-400">*</span></label>
                        <input
                          type="email"
                          placeholder="example@email.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm ${touched.email && getFieldError(form, "email") ? "border-red-300" : "border-gray-200"}`}
                        />
                        {touched.email && getFieldError(form, "email") && <p className="mt-1 text-[11px] text-red-400 md:text-xs">{getFieldError(form, "email")}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-gray-500 md:mb-2 md:text-xs">소속(회사/기관) <span className="font-normal text-gray-400">— 선택</span></label>
                        <input
                          type="text"
                          placeholder="파란컴퍼니"
                          value={form.organization}
                          onChange={(e) => updateField("organization", e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. 남기실 말씀 */}
                <div className="mb-6 md:mb-8">
                  <div className="mb-2.5 flex items-center gap-1.5 md:mb-4 md:gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white md:text-[11px]">4</span>
                    <h3 className="text-[14px] font-bold text-gray-900 md:text-base">남기실 말씀</h3>
                    <span className="text-[10px] text-gray-400 md:text-[11px]">선택사항</span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder={MESSAGE_PLACEHOLDERS[serviceSel] ?? DEFAULT_PLACEHOLDER}
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:rounded-lg md:px-4 md:py-3 md:text-sm"
                  />
                </div>

                {/* 유입경로 */}
                <div className="mb-6 md:mb-8">
                  <div className="mb-2.5 flex items-center gap-1.5 md:mb-4 md:gap-2">
                    <h3 className="text-[14px] font-bold text-gray-900 md:text-base">유입경로</h3>
                    <span className="text-[10px] text-gray-400 md:text-[11px]">중복 선택 가능</span>
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {REFERRAL_SOURCES.map((src) => {
                      const selected = referralSources.includes(src);
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => toggleReferral(src)}
                          className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors md:gap-1.5 md:px-3.5 md:py-2 md:text-xs ${
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
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] text-gray-900 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 md:mt-2.5 md:rounded-lg md:px-4 md:py-2.5 md:text-sm"
                    />
                  )}
                </div>

                {/* 파일 첨부 */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-1 md:gap-2">
                    <h3 className="text-[14px] font-bold text-gray-900 md:text-base">파일 첨부</h3>
                    <span className="text-[10px] text-gray-400 md:text-[11px]">선택사항 (최대 {MAX_FILES}개, 10MB 이하)</span>
                  </div>
                  <div className="mt-1 md:mt-3">
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
                      className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-[12px] text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-40 md:px-4 md:text-xs"
                    >
                      <Paperclip className="h-3.5 w-3.5" />
                      파일 선택 (이미지, PDF, 문서)
                    </button>
                    {files.length > 0 && (
                      <div className="mt-1.5 space-y-1 md:mt-2.5 md:space-y-1.5">
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
                            <span className="min-w-0 flex-1 truncate text-[12px] text-gray-700 md:text-xs">{file.name}</span>
                            <span className="shrink-0 text-[10px] text-gray-400 md:text-[11px]">{formatFileSize(file.size)}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 개인정보 동의 */}
                <div className="mb-5 flex cursor-pointer items-start gap-2 md:mb-6 md:items-center md:gap-2.5" onClick={() => setPrivacyAgreed(!privacyAgreed)}>
                  <div className="mt-[3px] md:mt-0">
                    <AnimatedCheckbox
                      checked={privacyAgreed}
                      onChange={setPrivacyAgreed}
                      size="sm"
                      className="md:h-4 md:w-4"
                    />
                  </div>
                  <span className="text-[11px] leading-relaxed text-gray-500 md:text-xs">
                    <Link href="/privacy" target="_blank" className="font-semibold text-blue-600 underline underline-offset-2">개인정보 수집·이용</Link>에 동의합니다. (이름, 연락처, 이메일을 문의 응대 목적으로 수집하며, 목적 달성 후 즉시 파기합니다.)
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.99 }}
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-blue-500/25 disabled:opacity-60 md:py-4 md:text-sm"
                >
                  {(submitting || uploading) && <Loader2 className="h-3.5 w-3.5 animate-spin md:h-4 md:w-4" />}
                  {uploading ? "파일 업로드 중..." : submitting ? "처리 중..." : "문의 보내기"}
                </motion.button>
              </form>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
