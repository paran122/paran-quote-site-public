"use client";

import Link from "next/link";
import { PulsatingButton } from "@/components/ui/pulsating-button";

interface Props {
  title: string;
  relatedServices: Array<{ href: string; label: string }>;
}

export default function ServiceCTA({ title, relatedServices }: Props) {
  return (
    <section className="py-16 md:py-24 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* 관련 서비스 */}
        <div className="mb-16">
          <p className="text-sm font-medium text-slate-500 mb-4">
            관련 서비스
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedServices.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-[#091041] rounded-2xl p-8 md:p-12">
          <h2 className="text-xl md:text-2xl font-bold mb-3 text-white">{title}</h2>
          <p className="text-slate-300 text-sm mb-8">
            행사 일정과 규모만 알려주시면, 1영업일 내에 맞춤 견적서를
            보내드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/?scrollTo=contact">
              <PulsatingButton className="px-8 py-3.5 text-sm font-semibold rounded-xl">
                무료 견적 요청하기
              </PulsatingButton>
            </Link>
            <a
              href="https://pf.kakao.com/_xkexdLG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-6 py-3.5 text-sm font-semibold text-[#3B1C1C] transition-all hover:bg-[#F5DC00] w-full sm:w-auto"
            >
              카카오톡 상담
            </a>
            <a
              href="tel:02-6342-2800"
              className="btn-outline btn-lg rounded-xl w-full sm:w-auto"
            >
              02-6342-2800
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
