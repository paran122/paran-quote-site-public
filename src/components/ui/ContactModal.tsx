"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^[\d\-]{9,15}$/;

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
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setFiles([]);
    }
  }, [isOpen]);

  const updateField = (key: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
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
      let attachments: UploadedFile[] = [];
      if (files.length > 0) {
        attachments = await uploadFiles();
      }

      const { submitQuoteViaApi } = await import("@/lib/queries");
      await submitQuoteViaApi({
        quote_number: quoteNumber,
        contact_name: form.contactName,
        organization: form.organization.trim() || "문의",
        phone: form.phone,
        email: form.email,
        event_name: "문의",
        event_date: new Date().toISOString().slice(0, 10),
        event_type: "문의",
        memo: form.message,
        cart_items: [],
        total_amount: 0,
        attachments,
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
                  소속(회사/기관)
                </label>
                <input
                  type="text"
                  placeholder="파란컴퍼니"
                  value={form.organization}
                  onChange={(e) => updateField("organization", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 placeholder-slate-300 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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

          {/* 파일 첨부 */}
          <div className="mt-4">
            <div className="flex items-center gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">파일 첨부</label>
              <span className="text-[11px] text-slate-400">선택사항 (최대 {MAX_FILES}개, 10MB 이하)</span>
            </div>
            <div className="mt-1.5">
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
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3.5 py-2 text-[13px] text-slate-500 transition-colors hover:border-blue-400 hover:text-blue-500 disabled:opacity-40"
              >
                <Paperclip className="h-3.5 w-3.5" />
                파일 선택 (이미지, PDF, 문서)
              </button>
              {files.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
                    >
                      {isImageType(file.type) ? (
                        <ImageIcon className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      )}
                      <span className="min-w-0 flex-1 truncate text-[13px] text-slate-700">{file.name}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{formatFileSize(file.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="shrink-0 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-[14px] font-semibold text-white shadow-lg shadow-blue-500/20 transition-opacity disabled:opacity-60"
          >
            {(submitting || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? "파일 업로드 중..." : submitting ? "처리 중..." : "문의 보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
