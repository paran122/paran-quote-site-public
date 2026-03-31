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

/* 짧은 구분선 컴포넌트 */
const Divider = () => (
  <div className="hidden self-stretch py-3 md:block">
    <div className="mx-auto h-full w-px bg-white/10" />
  </div>
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
        {/* 데스크톱: 3등분 + 짧은 구분선 */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-6">
          {/* 1/3: 로고 + 회사정보 */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo-white.svg"
                alt="파란컴퍼니"
                width={120}
                height={53}
                className="h-8 w-auto"
              />
            </div>
            <div className="space-y-1 text-xs leading-relaxed text-white/40">
              <p>파란컴퍼니 주식회사 | 대표 김미경</p>
              <p>사업자등록번호 291-86-02802</p>
              <p>경기도 수원시 팔달구 효원로 278, 6층 603호</p>
              <p>운영시간 : 평일 09:00 ~ 18:00</p>
            </div>
          </div>

          <Divider />

          {/* 2/3: 바로가기 + 가이드 */}
          <nav className="flex gap-12">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">바로가기</div>
              <div className="space-y-2 text-xs text-white/40">
                <Link href="/company" className="block transition-colors hover:text-white">회사소개</Link>
                <Link href="/services" className="block transition-colors hover:text-white">서비스</Link>
                <Link href="/work" className="block transition-colors hover:text-white">포트폴리오</Link>
                <Link href="/faq" className="block transition-colors hover:text-white">FAQ</Link>
                <Link href="/blog" className="block transition-colors hover:text-white">블로그</Link>
              </div>
            </div>
            <div>
              <Link href="/services" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-blue-400 transition-colors hover:text-blue-300">서비스</Link>
              <div className="space-y-2 text-xs text-white/40">
                <Link href="/services/corporate" className="block transition-colors hover:text-white">기업행사 대행</Link>
                <Link href="/services/government" className="block transition-colors hover:text-white">공공기관 행사</Link>
                <Link href="/services/conference" className="block transition-colors hover:text-white">컨퍼런스·포럼</Link>
                <Link href="/services/seminar" className="block transition-colors hover:text-white">세미나·워크숍</Link>
                <Link href="/services/design" className="block transition-colors hover:text-white">행사 디자인</Link>
              </div>
            </div>
            <div>
              <Link href="/guide" className="mb-3 block text-xs font-semibold uppercase tracking-wider text-blue-400 transition-colors hover:text-blue-300">가이드</Link>
              <div className="space-y-2 text-xs text-white/40">
                <Link href="/guide/checklist" className="block transition-colors hover:text-white">행사 체크리스트</Link>
                <Link href="/guide/process" className="block transition-colors hover:text-white">진행 절차</Link>
                <Link href="/guide/pricing" className="block transition-colors hover:text-white">비용 가이드</Link>
                <Link href="/guide/venue" className="block transition-colors hover:text-white">장소 선택</Link>
                <Link href="/guide/scale" className="block transition-colors hover:text-white">규모별 가이드</Link>
              </div>
            </div>
          </nav>

          <Divider />

          {/* 3/3: 연락처 + SNS 나란히 */}
          <div className="flex gap-10">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">연락처</div>
              <div className="space-y-2 text-xs text-white/40">
                <p>
                  TEL <a href="tel:02-6342-2800" className="transition-colors hover:text-white">02-6342-2800</a>
                </p>
                <p>
                  <a href="mailto:info@parancompany.co.kr" className="transition-colors hover:text-white">info@parancompany.co.kr</a>
                </p>
                <p>FAX 0504-482-1305</p>
                <p>평일 09:00 ~ 18:00</p>
              </div>
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">SNS</div>
              <div className="space-y-2 text-xs text-white/40">
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
        </div>

        {/* 모바일 */}
        <div className="md:hidden">
          {/* 상단: 회사정보(왼쪽) + SNS(오른쪽) */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2">
                <Image
                  src="/logo-white.svg"
                  alt="파란컴퍼니"
                  width={120}
                  height={53}
                  className="h-5 w-auto"
                />
              </div>
              <div className="space-y-0.5 text-[8px] leading-relaxed text-white/40">
                <p>파란컴퍼니 주식회사 | 대표 김미경 | 사업자등록번호 291-86-02802</p>
                <p>경기도 수원시 팔달구 효원로 278, 6층 603호</p>
                <p>
                  TEL <a href="tel:02-6342-2800" className="transition-colors hover:text-white">02-6342-2800</a> | FAX 0504-482-1305 | <a href="mailto:info@parancompany.co.kr" className="transition-colors hover:text-white">info@parancompany.co.kr</a>
                </p>
                <p>평일 09:00 ~ 18:00 (주말·공휴일 휴무)</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 pt-1 text-white/40">
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
          </div>

          {/* 하단: 바로가기 + 개인정보/이용약관 */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-3 text-[8px] text-white/40">
              <Link href="/company" className="transition-colors hover:text-white">회사소개</Link>
              <Link href="/services" className="transition-colors hover:text-white">서비스</Link>
              <Link href="/work" className="transition-colors hover:text-white">포트폴리오</Link>
              <Link href="/blog" className="transition-colors hover:text-white">블로그</Link>
              <Link href="/faq" className="transition-colors hover:text-white">FAQ</Link>
              <Link href="/guide" className="transition-colors hover:text-white">가이드</Link>
            </div>
            <div className="flex items-center gap-2 text-[8px] text-white/30">
              <Link href="/privacy" className="transition-colors hover:text-white/50">개인정보처리방침</Link>
              <span className="text-white/10">|</span>
              <Link href="/terms" className="transition-colors hover:text-white/50">이용약관</Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-1.5 border-t border-white/10 pt-3 text-[7px] text-white/20 md:mt-8 md:flex-row md:justify-between md:pt-5 md:text-xs">
          <div className="hidden items-center gap-2 md:flex md:gap-3">
            <Link href="/privacy" className="transition-colors hover:text-white/50">개인정보처리방침</Link>
            <span className="text-white/10">|</span>
            <Link href="/terms" className="transition-colors hover:text-white/50">이용약관</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} PARAN COMPANY. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
