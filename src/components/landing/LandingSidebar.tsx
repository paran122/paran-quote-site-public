"use client";

import { useState, useEffect, useCallback } from "react";

const SECTION_ITEMS = [
  { id: "section-hero", label: "홈" },
  { id: "section-partners", label: "파트너" },
  { id: "section-portfolio", label: "포트폴리오" },
  { id: "section-services", label: "서비스" },
  { id: "section-packages", label: "패키지" },
];

export default function LandingSidebar() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("section-hero");

  useEffect(() => setMounted(true), []);

  // IntersectionObserver로 현재 보이는 섹션 추적
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: "-56px 0px 0px 0px" }
    );

    SECTION_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [mounted]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  if (!mounted) return null;

  return (
      <aside
        className="
          fixed left-0 top-0 bottom-0 w-40 z-30
          flex flex-col justify-center
          border-r border-blue-400/10 bg-[#0f1a3c]
          max-lg:hidden
        "
      >
        <nav className="flex flex-col gap-0.5 px-3">
          {SECTION_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`
                  group relative flex items-center gap-2.5 rounded-lg px-3 py-2.5
                  text-left transition-all
                  ${isActive ? "bg-blue-500/20" : "hover:bg-white/5"}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-blue-400" />
                )}
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? "bg-blue-400" : "bg-slate-500 group-hover:bg-slate-400"
                  }`}
                />
                <span
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: 전화 상담 */}
        <div className="absolute bottom-6 left-0 right-0 px-3">
          <div className="px-2 py-2.5 rounded-lg bg-white/5">
            <p className="text-[10px] font-medium text-slate-400">전화 상담</p>
            <p className="text-xs font-bold mt-0.5 text-white">02-6342-2801</p>
            <p className="text-[10px] mt-0.5 text-slate-400">평일 09:00~18:00</p>
          </div>
        </div>
      </aside>
  );
}
