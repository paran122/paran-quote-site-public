"use client";

import { useCatalogStore } from "@/stores/catalogStore";
import { Package } from "lucide-react";

interface CategorySidebarProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function CategorySidebar({ activeKey, onSelect }: CategorySidebarProps) {
  const categories = useCatalogStore((s) => s.categories);
  const services = useCatalogStore((s) => s.services);

  const getServiceCount = (categoryKey: string) =>
    services.filter((s) => s.categoryKey === categoryKey && s.isVisible).length;

  const totalCount = services.filter((s) => s.isVisible).length;

  return (
    <aside className="hidden lg:block w-[220px] shrink-0">
      <div className="sticky top-[72px]">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          카테고리
        </h3>
        <nav className="flex flex-col gap-0.5">
          {/* 전체 */}
          <button
            onClick={() => onSelect("all")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all ${
              activeKey === "all"
                ? "border-l-2 border-blue-500 bg-blue-50 text-slate-900 font-semibold"
                : "border-l-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>전체</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
              activeKey === "all"
                ? "bg-blue-100 text-blue-600"
                : "bg-slate-100 text-slate-500"
            }`}>
              {totalCount}
            </span>
          </button>

          {/* 카테고리별 */}
          {categories.map((cat) => {
            const count = getServiceCount(cat.key);
            const isActive = activeKey === cat.key;

            return (
              <button
                key={cat.key}
                onClick={() => onSelect(cat.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all ${
                  isActive
                    ? "border-l-2 border-blue-500 bg-blue-50 text-slate-900 font-semibold"
                    : "border-l-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* 패키지 */}
          <button
            onClick={() => onSelect("package")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] transition-all mt-2 pt-3 border-t border-slate-200 ${
              activeKey === "package"
                ? "border-l-2 border-blue-500 bg-blue-50 text-slate-900 font-semibold"
                : "border-l-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Package size={14} />
              패키지
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">
              추천
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
