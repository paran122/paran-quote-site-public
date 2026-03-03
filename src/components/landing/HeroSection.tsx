import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutGrid, Layers } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-[88vh] flex flex-col justify-center items-center text-center bg-white relative overflow-hidden pt-[56px]">
      {/* 배경 행사 이미지 오버레이 */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/50 to-white" />
      </div>

      <div className="relative z-10 px-6 max-w-3xl">
        <h1 className="text-[2.4rem] sm:text-[3rem] md:text-[3.5rem] font-bold font-display text-slate-900 leading-[1.08] tracking-tight">
          교육이 즐거워질 때
          <br />
          직원의 성과는{" "}
          <span className="text-primary">올라갑니다</span>
        </h1>

        <p className="mt-5 text-slate-500 text-[15px]">
          1,200건 이상의 행사 성공 실적. 기획부터 운영까지 원스톱 솔루션.
        </p>

        {/* 카드형 CTA */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
          {/* Full Service 카드 */}
          <Link href="/build" className="group block">
            <div className="h-full border border-slate-200 rounded-[10px] p-5 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 flex flex-col">
              <div className="w-9 h-9 rounded-[6px] bg-primary-50 flex items-center justify-center mb-4">
                <Layers size={18} className="text-primary" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                ALL-IN-ONE
              </p>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Full Service
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-3 flex-1">
                기획부터 디자인, 현장 운영까지 전담 매니저가 함께하는 행사 솔루션
              </p>
              <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary group-hover:gap-2 transition-all">
                전체 행사 기획
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>

          {/* Individual Service 카드 */}
          <Link href="/services" className="group block">
            <div className="h-full border border-slate-200 rounded-[10px] p-5 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 flex flex-col">
              <div className="w-9 h-9 rounded-[6px] bg-slate-100 flex items-center justify-center mb-4">
                <LayoutGrid size={18} className="text-slate-600" />
              </div>
              <p className="text-[11px] font-medium text-slate-400 mb-1">
                기획, 음향, 디자인, 포토존 등
              </p>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Individual Service
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-3 flex-1">
                필요한 항목만 선택하는 맞춤형 부분 서비스
              </p>
              <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary group-hover:gap-2 transition-all">
                개별 서비스 보기
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
