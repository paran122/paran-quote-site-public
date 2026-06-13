"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/services/conference", label: "컨퍼런스·세미나" },
  { href: "/services/education", label: "교육·워크숍" },
  { href: "/services/booth", label: "전시·홍보부스" },
  { href: "/services/design/print", label: "현수막·포스터" },
  { href: "/services/design/digital", label: "PPT·카드뉴스·편집디자인" },
  { href: "/services/design/space", label: "전시부스·포토존" },
];

export default function ServiceSubNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 처음 노출될 때 현재 페이지 칩을 보이게 가로 스크롤
  useEffect(() => {
    if (visible && !scrolledRef.current && activeRef.current) {
      scrolledRef.current = true;
      activeRef.current.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }, [visible]);

  return (
    <nav
      className={`fixed top-[52px] left-0 right-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? activeRef : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
