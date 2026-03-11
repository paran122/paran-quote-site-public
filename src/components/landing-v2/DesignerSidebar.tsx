"use client";

import { useState, useEffect } from "react";

const sections = [
  { id: "hero", label: "홈" },
  { id: "about", label: "소개" },
  { id: "portfolio", label: "포트폴리오" },
  { id: "estimate", label: "견적안내" },
  { id: "process", label: "프로세스" },
  { id: "clients", label: "고객사" },
  { id: "blog", label: "블로그" },
  { id: "contact", label: "문의" },
];

export default function DesignerSidebar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -40% 0px" }
    );

    function observeAll() {
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    observeAll();
    // 블로그 섹션 비동기 로드 후 재등록
    const timer = setTimeout(observeAll, 2000);

    // 페이지 맨 아래 → 문의 활성화
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActive("contact");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-screen w-40 flex-col justify-center border-r border-blue-400/10 bg-[#0f1a3c] lg:flex">
      <div className="flex flex-col gap-0.5 px-3">
        {sections.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-3 text-left transition-all ${
                isActive
                  ? "bg-blue-500/20"
                  : "hover:bg-blue-500/5"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full transition-all ${
                  isActive ? "bg-blue-400 opacity-100" : "opacity-0"
                }`}
              />
              <span
                className={`h-2 w-2 flex-shrink-0 rounded-full transition-all ${
                  isActive ? "bg-blue-400" : "bg-white/30 group-hover:bg-white/50"
                }`}
              />
              <span
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "font-semibold text-blue-400" : "text-white/50 group-hover:text-white/80"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
