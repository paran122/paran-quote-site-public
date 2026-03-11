"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/* Naver Blog SVG — 블로그 사이드바와 동일한 아이콘, 흑백 */
const NaverBlogIcon = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M13.56 0H6.44C2.88 0 0 2.88 0 6.44v7.12C0 17.12 2.88 20 6.44 20h7.12C17.12 20 20 17.12 20 13.56V6.44C20 2.88 17.12 0 13.56 0zm-1.59 14.4L8.52 9.67v4.73H5.6V5.6h3.45l3.45 4.73V5.6h2.93v8.8h-3.46z" />
  </svg>
);

/* Instagram SVG — 블로그 사이드바와 동일한 아이콘, 흑백 */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/* YouTube SVG — 블로그 사이드바와 동일한 아이콘, 흑백 */
const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const sidebarPl = isHome ? "lg:pl-40" : "";

  return (
    <footer className={`relative overflow-hidden bg-[#0a0f2c] px-4 py-5 md:px-12 md:py-10 ${sidebarPl}`}>
      {/* Background Gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #0a0f2c 50%, #3ca2fa22 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4 md:gap-8">
          {/* Left: Logo & Info */}
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
            {/* 모바일: 5줄 */}
            <div className="space-y-0.5 text-[7px] leading-relaxed text-white/40 md:hidden">
              <p>파란컴퍼니 주식회사 | 대표 김미경</p>
              <p>사업자등록번호 291-86-02802</p>
              <p>경기도 수원시 팔달구 효원로 278, 6층 603호</p>
              <p>
                TEL <a href="tel:02-6342-2800" className="transition-colors hover:text-white">02-6342-2800</a> | FAX <a href="tel:0504-482-1305" className="transition-colors hover:text-white">0504-482-1305</a>
              </p>
              <p>
                <a href="mailto:info@parancompany.co.kr" className="transition-colors hover:text-white">info@parancompany.co.kr</a>
              </p>
            </div>
            {/* 데스크톱: 3줄로 압축 */}
            <div className="hidden space-y-1 text-xs leading-relaxed text-white/40 md:block">
              <p>파란컴퍼니 주식회사 | 대표 김미경 | 사업자등록번호 291-86-02802</p>
              <p>경기도 수원시 팔달구 효원로 278, 6층 603호</p>
              <p>
                TEL <a href="tel:02-6342-2800" className="transition-colors hover:text-white">02-6342-2800</a> | FAX <a href="tel:0504-482-1305" className="transition-colors hover:text-white">0504-482-1305</a> | <a href="mailto:info@parancompany.co.kr" className="transition-colors hover:text-white">info@parancompany.co.kr</a>
              </p>
            </div>
          </div>

          {/* Center: Quick Links */}
          <nav className="hidden md:block">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">바로가기</div>
            <div className="space-y-2 text-xs text-white/40">
              <Link href="/work" className="block transition-colors hover:text-white">포트폴리오</Link>
              <Link href="/faq" className="block transition-colors hover:text-white">FAQ</Link>
              <Link href="/blog" className="block transition-colors hover:text-white">블로그</Link>
            </div>
          </nav>

          {/* Right: SNS Links — 모바일: 가로 아이콘만 / 데스크톱: 세로 아이콘+텍스트 */}
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400 md:mb-3 md:text-xs">SNS</div>
            {/* 모바일: 가로 아이콘 */}
            <div className="flex items-center gap-3 text-white/40 md:hidden">
              <a href="https://blog.naver.com/paran-company" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                <NaverBlogIcon className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.instagram.com/parancompany" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.youtube.com/@parancompany" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                <YouTubeIcon className="h-3.5 w-3.5" />
              </a>
            </div>
            {/* 데스크톱: 세로 아이콘+텍스트 */}
            <div className="hidden space-y-2 text-xs text-white/40 md:block">
              <a href="https://blog.naver.com/paran-company" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-white">
                <NaverBlogIcon className="h-3.5 w-3.5" />
                Blog
              </a>
              <a href="https://www.instagram.com/parancompany" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-white">
                <InstagramIcon className="h-3.5 w-3.5" />
                Instagram
              </a>
              <a href="https://www.youtube.com/@parancompany" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-white">
                <YouTubeIcon className="h-3.5 w-3.5" />
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1.5 border-t border-white/10 pt-3 text-[7px] text-white/20 md:mt-8 md:flex-row md:justify-between md:pt-5 md:text-xs">
          <Link href="/privacy" className="transition-colors hover:text-white/50">개인정보처리방침</Link>
          <span>&copy; {new Date().getFullYear()} PARAN COMPANY. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
