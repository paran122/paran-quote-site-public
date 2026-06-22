"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navItems: { label: string; anchor: string; isPage?: boolean }[] = [
  { label: "홈", anchor: "/", isPage: true },
  { label: "회사소개", anchor: "/company", isPage: true },
  { label: "서비스", anchor: "/services", isPage: true },
  { label: "포트폴리오", anchor: "/work", isPage: true },
  { label: "가이드", anchor: "/guide", isPage: true },
  { label: "FAQ", anchor: "/faq", isPage: true },
  { label: "블로그", anchor: "/blog", isPage: true },
];

// 가이드 드롭다운 — 행사장 추천을 최상단 강조, 기존 가이드 페이지들 동반 노출
const guideItems: { href: string; label: string; desc?: string; highlight?: boolean }[] = [
  { href: "/venues", label: "행사장 정보", desc: "지역·유형별 행사장", highlight: true },
  { href: "/lecturers", label: "명사 정보", desc: "분야별 명사·강사 정보", highlight: true },
  { href: "/guide/venue", label: "행사장 선택법", desc: "장소 고르는 기준" },
  { href: "/guide/scale", label: "규모별 가이드", desc: "인원별 행사 준비" },
  { href: "/guide/pricing", label: "비용 가이드", desc: "예산·견적 안내" },
  { href: "/guide/checklist", label: "준비 체크리스트", desc: "행사 준비 항목" },
  { href: "/guide/process", label: "진행 절차", desc: "기획부터 종료까지" },
];

const serviceGroups: { title: string; href: string; items: { href: string; label: string; desc?: string }[] }[] = [
  {
    title: "행사대행",
    href: "/services",
    items: [
      { href: "/services/conference", label: "컨퍼런스·세미나", desc: "학술대회·포럼·심포지엄" },
      { href: "/services/education", label: "교육·워크숍", desc: "연수·캠프·역량강화" },
      { href: "/services/booth", label: "전시·홍보부스", desc: "부스 운영·체험부스·포토존" },
    ],
  },
  {
    title: "디자인",
    href: "/services/design",
    items: [
      { href: "/services/design/print", label: "현수막·포스터", desc: "리플렛·배너·카탈로그" },
      { href: "/services/design/digital", label: "PPT·카드뉴스·편집디자인", desc: "발표자료·SNS 콘텐츠·자료집" },
      { href: "/services/design/space", label: "전시부스·포토존", desc: "박람회 부스·행사 패키지" },
    ],
  },
];

export default function GNB() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceDropdown, setServiceDropdown] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [guideDropdown, setGuideDropdown] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isLanding = pathname === "/";

  // 모바일 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  const handleServiceEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setServiceDropdown(true);
  };

  const handleServiceLeave = () => {
    dropdownTimeout.current = setTimeout(() => setServiceDropdown(false), 150);
  };

  const handleGuideEnter = () => {
    if (guideTimeout.current) clearTimeout(guideTimeout.current);
    setGuideDropdown(true);
  };

  const handleGuideLeave = () => {
    guideTimeout.current = setTimeout(() => setGuideDropdown(false), 150);
  };

  const isActive = (item: typeof navItems[number]) =>
    item.isPage && (item.anchor === "/" ? pathname === "/" : pathname.startsWith(item.anchor));

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[number]) => {
    e.preventDefault();
    setMobileOpen(false);

    // 페이지 링크
    if (item.isPage) {
      router.push(item.anchor);
      return;
    }

    // 앵커 스크롤 (랜딩 페이지)
    if (isLanding) {
      if (item.anchor === "#hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.querySelector(item.anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // 다른 페이지 → 랜딩 앵커: scrollTo 파라미터로 전달
      const hash = item.anchor.replace("#", "");
      router.push(`/?scrollTo=${hash}`);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isLanding) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#091041] ">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 md:px-8">
        {/* Logo */}
        <a href="/" onClick={handleLogoClick} className="relative block">
          <Image
            src="/logo-white.png"
            alt="파란컴퍼니"
            width={360}
            height={109}
            className="h-9 w-auto md:h-10"
            priority
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            if (item.anchor === "/services") {
              return (
                <div
                  key={item.anchor}
                  ref={serviceRef}
                  className="flex items-center"
                  onMouseEnter={handleServiceEnter}
                  onMouseLeave={handleServiceLeave}
                >
                  <a
                    href={item.anchor}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`text-sm font-medium transition-colors hover:text-white/80 ${
                      isActive(item) ? "text-white" : "text-white/40"
                    }`}
                  >
                    {item.label}
                  </a>
                </div>
              );
            }
            if (item.anchor === "/guide") {
              return (
                <div
                  key={item.anchor}
                  ref={guideRef}
                  className="flex items-center"
                  onMouseEnter={handleGuideEnter}
                  onMouseLeave={handleGuideLeave}
                >
                  <a
                    href={item.anchor}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`text-sm font-medium transition-colors hover:text-white/80 ${
                      isActive(item) || pathname.startsWith("/venues") || pathname.startsWith("/lecturers") ? "text-white" : "text-white/40"
                    }`}
                  >
                    {item.label}
                  </a>
                </div>
              );
            }
            return (
              <a
                key={item.anchor}
                href={item.anchor}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-sm font-medium transition-colors hover:text-white/80 ${
                  isActive(item) ? "text-white" : "text-white/40"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/?scrollTo=contact"
            onClick={(e) => handleNavClick(e, { label: "문의하기", anchor: "#contact" })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            문의하기
          </a>
        </nav>

        {/* Mobile: Hamburger */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5"
            aria-label="메뉴"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-white"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white"
            />
          </button>
        </div>
      </div>

      {/* Desktop Service Dropdown — GNB 하단 구분선에 딱 맞춤 */}
      <AnimatePresence>
        {serviceDropdown && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%-1px)] origin-top hidden md:block"
            style={{
              left: serviceRef.current
                ? serviceRef.current.getBoundingClientRect().left
                : undefined,
            }}
            onMouseEnter={handleServiceEnter}
            onMouseLeave={handleServiceLeave}
          >
            <div className="flex gap-0 border-t border-white/5 bg-[#091041] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              {serviceGroups.map((group, gi) => (
                <div
                  key={group.title}
                  className={`min-w-[240px] py-4 px-3 ${gi === 0 ? "border-r border-white/5" : ""}`}
                >
                  <a
                    href={group.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setServiceDropdown(false);
                      router.push(group.href);
                    }}
                    className="block px-3 pb-2 mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300/80 hover:text-blue-200 transition-colors"
                  >
                    {group.title} <span className="text-white/30">전체 →</span>
                  </a>
                  {group.items.map((sub) => (
                    <a
                      key={sub.href}
                      href={sub.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setServiceDropdown(false);
                        router.push(sub.href);
                      }}
                      className={`block rounded-lg px-3 py-2 transition-colors ${
                        pathname === sub.href
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className={`block text-xs font-medium ${pathname === sub.href ? "text-white" : "text-white/80"}`}>
                        {sub.label}
                      </span>
                      {sub.desc && (
                        <span className="mt-0.5 block text-[11px] text-white/35">{sub.desc}</span>
                      )}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Guide Dropdown */}
      <AnimatePresence>
        {guideDropdown && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%-1px)] origin-top hidden md:block"
            style={{
              left: guideRef.current
                ? guideRef.current.getBoundingClientRect().left
                : undefined,
            }}
            onMouseEnter={handleGuideEnter}
            onMouseLeave={handleGuideLeave}
          >
            <div className="min-w-[280px] border-t border-white/5 bg-[#091041] py-3 px-3 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              {guideItems.map((sub) => (
                <a
                  key={sub.href}
                  href={sub.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setGuideDropdown(false);
                    router.push(sub.href);
                  }}
                  className={`block rounded-lg px-3 py-2 transition-colors ${
                    pathname === sub.href || (sub.href === "/venues" && pathname.startsWith("/venues")) || (sub.href === "/lecturers" && pathname.startsWith("/lecturers"))
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`text-xs font-medium ${sub.highlight ? "text-teal-300" : "text-white/80"}`}>
                      {sub.label}
                    </span>
                    {sub.highlight && (
                      <span className="rounded-full bg-teal-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-300">
                        NEW
                      </span>
                    )}
                  </span>
                  {sub.desc && (
                    <span className="mt-0.5 block text-[11px] text-white/35">{sub.desc}</span>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/5 bg-[#091041]  md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => {
                if (item.anchor === "/services") {
                  return (
                    <div key={item.anchor}>
                      <button
                        onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                        className={`flex w-full items-center justify-between text-sm transition-colors hover:text-white ${
                          isActive(item) ? "text-white" : "text-white/50"
                        }`}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: mobileServiceOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/40"
                        >
                          ▾
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {mobileServiceOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-4 pl-4 pt-3">
                              {serviceGroups.map((group) => (
                                <div key={group.title} className="flex flex-col gap-2.5">
                                  <a
                                    href={group.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setMobileOpen(false);
                                      setMobileServiceOpen(false);
                                      router.push(group.href);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300/80"
                                  >
                                    {group.title} 전체 →
                                  </a>
                                  {group.items.map((sub) => (
                                    <a
                                      key={sub.href}
                                      href={sub.href}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setMobileOpen(false);
                                        setMobileServiceOpen(false);
                                        router.push(sub.href);
                                      }}
                                      className={`text-sm transition-colors ${
                                        pathname === sub.href
                                          ? "text-white"
                                          : "text-white/40 hover:text-white"
                                      }`}
                                    >
                                      {sub.label}
                                    </a>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                if (item.anchor === "/guide") {
                  return (
                    <div key={item.anchor}>
                      <button
                        onClick={() => setMobileGuideOpen(!mobileGuideOpen)}
                        className={`flex w-full items-center justify-between text-sm transition-colors hover:text-white ${
                          isActive(item) || pathname.startsWith("/venues") || pathname.startsWith("/lecturers") ? "text-white" : "text-white/50"
                        }`}
                      >
                        {item.label}
                        <motion.span
                          animate={{ rotate: mobileGuideOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/40"
                        >
                          ▾
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {mobileGuideOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-3 pl-4 pt-3">
                              {guideItems.map((sub) => (
                                <a
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setMobileOpen(false);
                                    setMobileGuideOpen(false);
                                    router.push(sub.href);
                                  }}
                                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                                    sub.highlight
                                      ? "text-teal-300"
                                      : pathname === sub.href
                                        ? "text-white"
                                        : "text-white/40 hover:text-white"
                                  }`}
                                >
                                  {sub.label}
                                  {sub.highlight && (
                                    <span className="rounded-full bg-teal-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-300">
                                      NEW
                                    </span>
                                  )}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <a
                    key={item.anchor}
                    href={item.anchor}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`text-sm transition-colors hover:text-white ${
                      isActive(item) ? "text-white" : "text-white/50"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a
                href="/?scrollTo=contact"
                onClick={(e) => handleNavClick(e, { label: "문의하기", anchor: "#contact" })}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                문의하기
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
