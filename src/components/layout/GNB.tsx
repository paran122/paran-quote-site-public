"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "홈", anchor: "#hero" },
  { label: "포트폴리오", anchor: "#portfolio" },
  { label: "프로세스", anchor: "#process" },
  { label: "고객사", anchor: "#clients" },
];

export default function GNB() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isLanding = pathname === "/";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (isLanding) {
      if (anchor === "#hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/${anchor}`;
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
          className="font-mono text-lg font-bold tracking-widest text-white"
        >
          PARAN<span className="text-blue-400">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.anchor}
              href={item.anchor}
              onClick={(e) => handleNavClick(e, item.anchor)}
              className="text-xs font-medium text-white/40 transition-colors hover:text-white/80"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
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
                  onClick={(e) => handleNavClick(e, item.anchor)}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
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
