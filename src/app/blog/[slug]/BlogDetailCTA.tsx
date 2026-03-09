"use client";

import { useState } from "react";
import ContactModal from "@/components/ui/ContactModal";

export default function BlogDetailCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-[800px] rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 text-center sm:py-14">
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
          행사 기획이 필요하신가요?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-[1.7] text-slate-400">
          기업행사, 세미나, 컨퍼런스 등 어떤 행사든
          <br />
          견적부터 실행까지 전문 팀이 함께합니다.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="relative overflow-hidden rounded-lg bg-primary px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <span className="relative z-10">무료 견적요청</span>
            <span
              className="absolute inset-0 animate-[light-sweep_2.5s_ease-in-out_infinite] opacity-40"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
              }}
            />
          </button>
        </div>
      </div>
      <ContactModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
