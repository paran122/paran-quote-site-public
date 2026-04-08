"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/services/corporate", label: "기업행사" },
  { href: "/services/government", label: "공공기관" },
  { href: "/services/conference", label: "컨퍼런스·포럼" },
  { href: "/services/seminar", label: "세미나·워크숍" },
  { href: "/services/design", label: "행사 디자인" },
  { href: "#", label: "파란디자인", external: true },
];

export default function ServiceSubNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-[52px] left-0 right-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 py-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            if ("external" in item) {
              return (
                <span
                  key={item.label}
                  className="shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-400 cursor-default"
                >
                  {item.label}
                </span>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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
