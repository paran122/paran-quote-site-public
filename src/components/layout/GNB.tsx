"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navItems: { label: string; anchor: string; isPage?: boolean }[] = [
  { label: "홈", anchor: "/", isPage: true },
  { label: "포트폴리오", anchor: "/work", isPage: true },
  { label: "FAQ", anchor: "/faq", isPage: true },
  { label: "블로그", anchor: "/blog", isPage: true },
];

export default function GNB() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLanding = pathname === "/";

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-blue-400/10 bg-[#0f1a3c] backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3 md:px-8 lg:pl-44">
        {/* Logo */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="relative block"
        >
          <Image
            src="/logo-white.svg"
            alt="파란컴퍼니"
            width={120}
            height={53}
            className="h-8 w-auto md:h-9"
            priority
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
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
          ))}
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
              className="block h-0.5 w-6 bg-white/70"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-white/70"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white/70"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-blue-400/10 bg-[#0f1a3c] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => (
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
              ))}
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
