"use client";

import Image from "next/image";
import type { ThemeKey } from "@/lib/themes";

interface Partner {
  name?: string;
  logo?: string;
}

const PARTNERS: Partner[] = [
  /* ── 기존 파트너 ── */
  { name: "도레미디어" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part1.png" },
  { name: "주식회사 비스타원" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part2.png", name: "해군작전사령부" },
  { name: "믹스캠프" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part3.png", name: "해군3함대사령부" },
  { name: "주식회사 지케이엔에스" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part4.png" },
  { name: "조원미디어" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part5.png" },
  { name: "제임 스튜디오" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part6.png" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part7.png" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part8.png" },
  { logo: "https://parancompany.co.kr/theme/paranep/img/ms5_part9.jpg", name: "경기도교육청" },
  /* ── 추가 고객사 ── */
  { logo: "https://www.jcs.mil.kr/mbshome/mbs/jcs2/images/common/logo.png", name: "합동참모본부" },
  { logo: "https://www.namwon.go.kr/resource/www/images/common/logo.svg", name: "남원시" },
  { logo: "https://www.kapkorea.org/common/images/icon-logo-foot.svg", name: "자동차부품산업진흥재단" },
  { logo: "https://www.e-policy.or.kr/images/header/logo.png", name: "한국에너지정보문화재단" },
  { logo: "https://www.apfs.kr/images/main/eg_logo.png", name: "농업정책보험금융원" },
  { logo: "https://www.arte.or.kr/2024_new/images/common/logo.png", name: "한국문화예술교육진흥원" },
  { name: "한국예술인복지재단" },
  { logo: "https://www.gef.or.kr/_img/v1/common/top_logo.png", name: "경남경영자총협회" },
  { name: "IVOR 게임스튜디오" },
  { name: "DSGenterprise" },
];

const MQ: Record<ThemeKey, {
  bg: string; fade: string; itemBg: string; itemBorder: string;
  nameText: string; nameWithLogo: string; boldText: string; countText: string;
  logoFilter: string;
}> = {
  navy: {
    bg: "bg-[#0e1a2e]", fade: "from-[#0e1a2e]", itemBg: "bg-white/[0.07]", itemBorder: "border-white/[0.10]",
    nameText: "text-slate-200", nameWithLogo: "text-slate-200", boldText: "text-blue-400", countText: "text-slate-500",
    logoFilter: "brightness-110 contrast-105",
  },
};

function PartnerItem({ partner, theme }: { partner: Partner; theme: ThemeKey }) {
  const s = MQ[theme];
  return (
    <div
      className={`
        inline-flex items-center justify-center gap-2.5 px-5 py-3 mx-2.5
        rounded-xl shrink-0 h-[54px] min-w-[140px]
        ${s.itemBg} border ${s.itemBorder}
        backdrop-blur-sm
      `}
    >
      {partner.logo && (
        <div className="flex items-center justify-center h-7 w-auto bg-white/90 rounded-md px-2 py-0.5">
          <Image
            src={partner.logo}
            alt={partner.name || "파트너"}
            width={80}
            height={28}
            className="h-5 w-auto object-contain"
            unoptimized
          />
        </div>
      )}
      {partner.name && !partner.logo && (
        <span className={`text-sm font-semibold whitespace-nowrap ${s.nameText}`}>
          {partner.name}
        </span>
      )}
      {partner.name && partner.logo && (
        <span className={`text-xs font-medium whitespace-nowrap ${s.nameWithLogo}`}>
          {partner.name}
        </span>
      )}
    </div>
  );
}

export default function PartnersMarquee({ theme }: { theme: ThemeKey }) {
  const s = MQ[theme];
  const mid = Math.ceil(PARTNERS.length / 2);
  const row1 = PARTNERS.slice(0, mid);
  const row2 = PARTNERS.slice(mid);

  return (
    <section className={`py-12 overflow-hidden transition-colors duration-500 ${s.bg}`}>
      <div className="max-w-content mx-auto px-6 lg:pl-[176px] mb-8">
        <p className={`text-center text-sm font-medium ${s.countText}`}>
          <span className={`font-bold ${s.boldText}`}>50+</span>
          {" "}클라이언트와{" "}
          <span className={`font-bold ${s.boldText}`}>250+</span>
          {" "}프로젝트를 함께했습니다
        </p>
      </div>

      <div className="relative">
        <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r ${s.fade} to-transparent`} />
        <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l ${s.fade} to-transparent`} />
        <div className="marquee-track">
          <div className="marquee-content animate-marquee">
            {row1.map((p, i) => <PartnerItem key={`r1a-${i}`} partner={p} theme={theme} />)}
          </div>
          <div className="marquee-content animate-marquee" aria-hidden>
            {row1.map((p, i) => <PartnerItem key={`r1b-${i}`} partner={p} theme={theme} />)}
          </div>
        </div>
      </div>

      <div className="relative mt-3">
        <div className={`absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r ${s.fade} to-transparent`} />
        <div className={`absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l ${s.fade} to-transparent`} />
        <div className="marquee-track">
          <div className="marquee-content animate-marquee-reverse">
            {row2.map((p, i) => <PartnerItem key={`r2a-${i}`} partner={p} theme={theme} />)}
          </div>
          <div className="marquee-content animate-marquee-reverse" aria-hidden>
            {row2.map((p, i) => <PartnerItem key={`r2b-${i}`} partner={p} theme={theme} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
