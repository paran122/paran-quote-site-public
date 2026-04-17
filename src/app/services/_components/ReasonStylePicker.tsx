"use client";

import { SealCheck, FileText, Handshake } from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import CardCarousel from "./CardCarousel";

const reasons: Array<{ title: string; desc: string; icon: PhosphorIcon }> = [
  { title: "여성기업 인증", desc: "여성기업확인서를 보유한 여성기업으로, 수의계약 한도 내에서 별도 입찰 없이 직접 계약이 가능합니다.", icon: SealCheck },
  { title: "조달 입찰 참여 가능", desc: "행사대행업 직접생산확인증명서를 보유하여 나라장터 조달 입찰에 참여할 수 있습니다.", icon: FileText },
  { title: "원스톱 + 투명한 정산", desc: "기획부터 디자인·운영·결과보고까지 한 팀이 책임지며, 공공기관 기준의 산출내역서와 정산 서류를 완벽하게 제공합니다.", icon: Handshake },
];

export default function ReasonStylePicker() {
  return (
    <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-xl md:text-2xl font-bold mb-10 text-center">
          공공기관이 파란컴퍼니를 선택하는 이유
        </h2>
        <CardCarousel mobileFullWidth desktopGrid="sm:grid-cols-3 sm:gap-8">
          {reasons.map((r) => (
            <div key={r.title} className="snap-center shrink-0 w-full sm:w-auto sm:shrink p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
              <div className="flex justify-center mb-5">
                <div className="w-[58px] h-[58px] rounded-[17px] bg-blue-50 flex items-center justify-center">
                  <r.icon size={28} weight="fill" color="#2563EB" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3">{r.title}</h3>
              <p className="text-slate-500 text-sm leading-[1.7]">{r.desc}</p>
            </div>
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
