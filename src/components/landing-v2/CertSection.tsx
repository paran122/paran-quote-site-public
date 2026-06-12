"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Download, FileText } from "lucide-react";
import { CERTS, CertLightbox, type Cert } from "@/components/common/CertBadges";

const CHECKS = [
  { strong: "여성기업", rest: " — 수의계약 한도 5천만원" },
  { strong: "직접생산확인증명서(행사대행)", rest: " — 나라장터 입찰 적격" },
  { strong: "소상공인(소기업)", rest: " — 공공구매 우선구매 대상" },
  { strong: "비교견적", rest: " — 필요 시 비교견적 작성 지원" },
];

/** 공공기관 담당자용 인증·증빙 섹션 */
export default function CertSection() {
  const [openCert, setOpenCert] = useState<Cert | null>(null);
  const close = useCallback(() => setOpenCert(null), []);

  return (
    <section id="certs" className="bg-[#091041] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-content">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          {/* 좌: 카피 + 체크리스트 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-blue-300">
              CERTIFIED PARTNER
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-snug text-white md:text-3xl">
              2천만 원이 넘는 행사도,
              <br />
              입찰 없이 수의계약으로 진행하세요
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-slate-300/80 md:text-[15px]">
              파란컴퍼니는 여성기업으로 행사 예산{" "}
              <strong className="font-semibold text-white">5천만 원까지</strong> 수의계약 체결이
              가능합니다. 검토용 산출내역서부터 비교견적까지, 행정작업에 필요한 서류를 한 번에
              준비해 드립니다.
            </p>
            <ul className="flex flex-col gap-3.5">
              {CHECKS.map((c) => (
                <li key={c.strong} className="flex items-start gap-3 text-sm text-slate-200">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-400" />
                  <span>
                    <strong className="font-semibold text-white">{c.strong}</strong>
                    <span className="text-slate-300/80">{c.rest}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 우: 증명서 3장 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {CERTS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setOpenCert(c)}
                  className="group text-left"
                  title={`${c.name} 원본 보기`}
                >
                  <div className="relative aspect-[1000/1416] overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-1.5">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 30vw, 180px"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#091041]/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="w-full p-2.5 text-center text-[10px] font-semibold text-white">원본 보기</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[12px] font-semibold leading-snug text-white">{c.name}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{c.sub}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {CERTS.map((c) => (
                <a
                  key={c.key}
                  href={c.pdf}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-[11px] font-medium text-white/75 transition-colors hover:border-blue-400/40 hover:bg-white/[0.1] hover:text-white"
                >
                  <FileText size={13} className="text-blue-300" />
                  {c.name}
                  <Download size={12} className="text-white/40" />
                </a>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              PDF 원본 — 기안·계약 검토 자료로 바로 사용하실 수 있습니다.
            </p>
          </motion.div>
        </div>
      </div>
      {openCert && <CertLightbox cert={openCert} onClose={close} />}
    </section>
  );
}
