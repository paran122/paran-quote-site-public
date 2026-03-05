"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const sidebarPl = isHome ? "lg:pl-40" : "";

  return (
    <footer className={`bg-[#0a0f2c] px-4 py-5 md:px-12 md:py-12 ${sidebarPl}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4 md:gap-8">
          {/* Logo & Info */}
          <div>
            <div className="mb-1.5 md:mb-4">
              <Image
                src="/logo-white.svg"
                alt="파란컴퍼니"
                width={120}
                height={53}
                className="h-5 w-auto md:h-8"
              />
            </div>
            <div className="space-y-0.5 text-[7px] leading-relaxed text-white/40 md:space-y-1 md:text-xs">
              <p>파란컴퍼니 주식회사 | 대표 김미경</p>
              <p>사업자등록번호 291-86-02802</p>
              <p>경기도 수원시 팔달구 효원로 278, 6층 603호</p>
              <p>TEL 02-6342-2801 | FAX 0504-482-1305</p>
            </div>
          </div>

          {/* SNS Links */}
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400 md:mb-3 md:text-xs">SNS</div>
            <div className="space-y-1 text-[10px] text-white/40 md:space-y-2 md:text-xs">
              <a href="https://blog.naver.com/paran-company" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">Blog</a>
              <a href="https://www.instagram.com/parancompany" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">Instagram</a>
              <a href="https://www.youtube.com/@parancompany" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">YouTube</a>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-3 text-center text-[7px] text-white/20 md:mt-12 md:pt-6 md:text-xs">
          &copy; {new Date().getFullYear()} PARAN COMPANY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
