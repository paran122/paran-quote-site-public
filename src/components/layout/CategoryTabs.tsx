"use client";

import { useCatalogStore } from "@/stores/catalogStore";
import { Package } from "lucide-react";

interface CategoryTabsProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function CategoryTabs({ activeKey, onSelect }: CategoryTabsProps) {
  const CATEGORIES = useCatalogStore((s) => s.categories);
  return (
    <div className="sticky top-[56px] z-40 bg-white border-b border-slate-200">
      <div className="max-w-content mx-auto px-6 py-2.5">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {/* 전체 탭 */}
          <button
            onClick={() => onSelect("all")}
            className={`px-3.5 py-1.5 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeKey === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            전체
          </button>

          {/* 카테고리 탭 */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className={`px-3.5 py-1.5 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-colors ${
                activeKey === cat.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* 패키지 탭 */}
          <button
            onClick={() => onSelect("package")}
            className={`px-3.5 py-1.5 rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeKey === "package"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <Package size={13} />
            패키지
          </button>
        </div>
      </div>
    </div>
  );
}
