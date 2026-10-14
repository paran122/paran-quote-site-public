"use client";

import { showToast } from "@/components/ui/Toast";
import { OVERSIZE_CONTACT_EMAIL } from "@/lib/attachments";

/** navigator.clipboard 를 쓸 수 없는 환경(비 HTTPS·구형 브라우저) 대비 */
function legacyCopy(text: string): boolean {
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

interface Props {
  /** 화면에 보일 글자 (기본: "메일") */
  label?: string;
  className?: string;
}

/**
 * 클릭하면 회사 메일 주소를 클립보드에 복사하고 토스트로 알린다.
 * 첨부 용량 초과 안내처럼 "메일로 보내주세요" 문구에 쓰인다.
 */
export default function CopyEmail({ label = "메일", className = "" }: Props) {
  const handleCopy = async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(OVERSIZE_CONTACT_EMAIL);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) copied = legacyCopy(OVERSIZE_CONTACT_EMAIL);

    showToast(
      copied
        ? `메일 주소를 복사했습니다 · ${OVERSIZE_CONTACT_EMAIL}`
        : OVERSIZE_CONTACT_EMAIL
    );
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`${OVERSIZE_CONTACT_EMAIL} 복사하기`}
      aria-label={`회사 메일 주소 ${OVERSIZE_CONTACT_EMAIL} 복사하기`}
      className={`font-bold text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700 ${className}`}
    >
      {label}
    </button>
  );
}
