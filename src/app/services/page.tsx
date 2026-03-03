"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useCatalogStore } from "@/stores/catalogStore";
import CategoryTabs from "@/components/layout/CategoryTabs";
import CategorySidebar from "@/components/layout/CategorySidebar";
import ServiceCard from "@/components/cards/ServiceCard";
import PackageCard from "@/components/cards/PackageCard";

type SortKey = "recommend" | "price-asc" | "price-desc";
type PriceRange = "all" | "under100" | "100to300" | "300to500" | "over500";

const PRICE_RANGES: { value: PriceRange; label: string; min: number; max: number }[] = [
  { value: "all", label: "전체", min: 0, max: Infinity },
  { value: "under100", label: "100만원 이하", min: 0, max: 1_000_000 },
  { value: "100to300", label: "100~300만원", min: 1_000_000, max: 3_000_000 },
  { value: "300to500", label: "300~500만원", min: 3_000_000, max: 5_000_000 },
  { value: "over500", label: "500만원 이상", min: 5_000_000, max: Infinity },
];

export default function ServicesPage() {
  const SERVICES = useCatalogStore((s) => s.services);
  const PACKAGES = useCatalogStore((s) => s.packages);
  const CATEGORIES = useCatalogStore((s) => s.categories);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recommend");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [showFilters, setShowFilters] = useState(false);

  const isPackageTab = activeTab === "package";

  const filteredServices = useMemo(() => {
    let list = SERVICES.filter((s) => s.isVisible);

    if (activeTab !== "all" && activeTab !== "package") {
      list = list.filter((s) => s.categoryKey === activeTab);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.value === priceRange);
      if (range) {
        list = list.filter(
          (s) => s.basePrice >= range.min && s.basePrice < range.max
        );
      }
    }

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    }

    return list;
  }, [SERVICES, activeTab, search, sort, priceRange]);

  const categoryName =
    activeTab === "all"
      ? "전체"
      : CATEGORIES.find((c) => c.key === activeTab)?.name ?? "";

  return (
    <div className="pt-[56px] bg-slate-50 min-h-screen">
      {/* 모바일/태블릿 카테고리 탭 */}
      <div className="lg:hidden">
        <CategoryTabs activeKey={activeTab} onSelect={setActiveTab} />
      </div>

      {/* 메인 레이아웃: 사이드바 + 콘텐츠 */}
      <div className="max-w-content mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20 flex gap-6 lg:gap-8">
        {/* 데스크톱 사이드바 */}
        <CategorySidebar activeKey={activeTab} onSelect={setActiveTab} />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 min-w-0">
          {/* 검색바 + 필터 */}
          <div className="flex flex-col gap-3 mb-5">
            {/* 검색바 + 필터 토글 (모바일) */}
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none sm:w-[360px]">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="서비스 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>

              {/* 모바일 필터 토글 */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-500"
              >
                <SlidersHorizontal size={16} />
              </button>

              {/* 데스크톱 필터 */}
              <div className="hidden sm:flex items-center gap-3 ml-auto">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="recommend">추천순</option>
                  <option value="price-asc">가격 낮은순</option>
                  <option value="price-desc">가격 높은순</option>
                </select>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      가격대: {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 모바일 필터 드롭다운 */}
            {showFilters && (
              <div className="sm:hidden flex gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="recommend">추천순</option>
                  <option value="price-asc">가격 낮은순</option>
                  <option value="price-desc">가격 높은순</option>
                </select>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 결과 헤더 */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {isPackageTab ? "패키지" : categoryName}
            </h2>
            <span className="text-[12px] sm:text-[13px] text-slate-500">
              {isPackageTab
                ? `${PACKAGES.filter((p) => p.isVisible).length}개`
                : `${filteredServices.length}개`}
            </span>
          </div>

          {/* 결과 영역 */}
          {isPackageTab ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {PACKAGES.filter((p) => p.isVisible).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16 sm:py-20 text-slate-500">
              <p className="text-base sm:text-lg">검색 결과가 없습니다</p>
              <p className="text-[12px] sm:text-[13px] mt-1">다른 키워드로 검색해보세요</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
