"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { BadgeCheck, Download, X } from "lucide-react";

/** 공공 입찰·수의계약 적격 증빙 3종 (원본: E드라이브 행정 폴더, 공시성 서류만 게시) */
export const CERTS = [
  {
    key: "direct-production",
    name: "직접생산확인증명서",
    sub: "행사대행 · 한국중소벤처기업유통원",
    image: "/assets/certs/direct-production.webp",
    pdf: "/certs/직접생산확인증명서_행사대행_파란컴퍼니.pdf",
  },
  {
    key: "women",
    name: "여성기업확인서",
    sub: "5천만 원 이하 수의계약 가능",
    image: "/assets/certs/women.webp",
    pdf: "/certs/여성기업확인서_파란컴퍼니.pdf",
  },
  {
    key: "sme",
    name: "소상공인확인서",
    sub: "중소기업기본법 제2조 소기업",
    image: "/assets/certs/sme.webp",
    pdf: "/certs/소상공인확인서_파란컴퍼니.pdf",
  },
] as const;

export type Cert = (typeof CERTS)[number];

/** 증명서 원본 라이트박스 — portal로 body에 직접 마운트 (조상 transform/filter 컨테이닝 회피) */
export function CertLightbox({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X size={22} />
      </button>
      <div className="relative max-h-[85vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={cert.image}
          alt={`${cert.name} 원본`}
          width={1000}
          height={1416}
          className="max-h-[78vh] w-auto rounded-lg bg-white object-contain"
        />
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-white/10 px-4 py-2.5">
          <div>
            <p className="text-[13px] font-bold text-white">{cert.name}</p>
            <p className="text-[11px] text-white/60">{cert.sub}</p>
          </div>
          <a
            href={cert.pdf}
            download
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download size={14} /> PDF
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** 클릭형 인증 칩 — variant: 다크 히어로용 / 라이트 섹션용 */
export default function CertBadges({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [openCert, setOpenCert] = useState<Cert | null>(null);
  const close = useCallback(() => setOpenCert(null), []);

  const chip = variant === "dark"
    ? "border-white/15 bg-white/[0.07] text-white/75 hover:border-blue-400/40 hover:bg-white/[0.12] hover:text-white"
    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-slate-900 hover:shadow-sm";
  const icon = variant === "dark" ? "text-blue-300" : "text-blue-600";

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {CERTS.map((c) => (
          <button
            key={c.key}
            onClick={() => setOpenCert(c)}
            title={`${c.name} 원본 보기`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium backdrop-blur-sm transition-all ${chip}`}
          >
            <BadgeCheck size={14} className={icon} />
            {c.name}
          </button>
        ))}
      </div>
      {openCert && <CertLightbox cert={openCert} onClose={close} />}
    </>
  );
}
