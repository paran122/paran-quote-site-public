"use client";

import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navItems: { label: string; anchor: string; isPage?: boolean }[] = [
  { label: "홈", anchor: "/", isPage: true },
  { label: "회사소개", anchor: "/company", isPage: true },
  { label: "서비스", anchor: "/services", isPage: true },
  { label: "포트폴리오", anchor: "/work", isPage: true },
  { label: "FAQ", anchor: "/faq", isPage: true },
  { label: "블로그", anchor: "/blog", isPage: true },
];

const serviceSubItems = [
  { href: "/services/corporate", label: "기업행사" },
  { href: "/services/government", label: "공공기관" },
  { href: "/services/conference", label: "컨퍼런스·포럼" },
  { href: "/services/seminar", label: "세미나·워크숍" },
  { href: "/services/design", label: "행사 디자인" },
];

export default function GNB() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceDropdown, setServiceDropdown] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [siteSwitcherOpen, setSiteSwitcherOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const siteSwitcherTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isLanding = pathname === "/";

  const handleServiceEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setServiceDropdown(true);
  };

  const handleServiceLeave = () => {
    dropdownTimeout.current = setTimeout(() => setServiceDropdown(false), 150);
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
        {/* Logo + Site Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="/"
            onClick={handleLogoClick}
            className="relative block"
          >
            <Image
              src="/logo-white.png"
              alt="파란컴퍼니"
              width={360}
              height={109}
              className="h-9 w-auto md:h-10"
              priority
            />
          </a>

          {/* Site Switcher */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (siteSwitcherTimeout.current) clearTimeout(siteSwitcherTimeout.current);
              setSiteSwitcherOpen(true);
            }}
            onMouseLeave={() => {
              siteSwitcherTimeout.current = setTimeout(() => setSiteSwitcherOpen(false), 150);
            }}
          >
            <button
              onClick={() => setSiteSwitcherOpen(!siteSwitcherOpen)}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/15"
              aria-expanded={siteSwitcherOpen}
              aria-haspopup="true"
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              행사대행
              <svg
                className={`h-3.5 w-3.5 transition-transform ${siteSwitcherOpen ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <AnimatePresence>
              {siteSwitcherOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-lg bg-[#1a2a52] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                  role="menu"
                >
                  <div className="py-1">
                    <div
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-white/90"
                      role="menuitem"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        행사대행
                      </div>
                      <span className="rounded bg-blue-500/30 px-1.5 py-0.5 text-[10px] text-blue-300">
                        현재
                      </span>
                    </div>
                    <a
                      href="https://parandesign.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
                      role="menuitem"
                      onClick={() => setSiteSwitcherOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        디자인
                      </div>
                      <svg
                        className="h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5zm7.25-.75a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l5.47-5.47H12.25a.75.75 0 01-.75-.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
                    className={`text-xs font-medium transition-colors hover:text-white/80 ${
                      isActive(item) ? "text-white" : "text-white/40"
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
                className={`text-xs font-medium transition-colors hover:text-white/80 ${
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
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
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
            <div className="min-w-[140px] border-t border-white/5 bg-[#091041] py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              {serviceSubItems.map((sub) => (
                <a
                  key={sub.href}
                  href={sub.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setServiceDropdown(false);
                    router.push(sub.href);
                  }}
                  className={`block px-4 py-2 text-xs transition-colors ${
                    pathname === sub.href
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {sub.label}
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
                            <div className="flex flex-col gap-3 pl-4 pt-3">
                              {serviceSubItems.map((sub) => (
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
