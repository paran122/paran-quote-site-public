"use client";

import { ArrowRight } from "lucide-react";
import { useInView } from "@/lib/utils";

export default function CtaSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="bg-white py-20">
      <div
        ref={ref}
        className={`max-w-content mx-auto px-6 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-slate-900 rounded-[14px] p-12 text-center">
          <h2 className="text-2xl md:text-[2rem] font-bold text-white tracking-tight">
            성공적인 행사, 파란컴퍼니와 함께
          </h2>
          <p className="mt-3 text-slate-400 text-[15px]">
            전문 컨설턴트가 맞춤 견적을 빠르게 보내드립니다
          </p>
          <a
            href="https://pf.kakao.com/_xkexdLG"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-[15px] font-medium rounded-[6px] bg-white text-slate-900 hover:bg-slate-100 transition-colors"
          >
            카카오톡 무료 상담
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
