"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ChevronDown,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  FileText,
  Phone,
} from "lucide-react";
import {
  formatPrice,
  SERVICE_DETAILS,
} from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useCartStore } from "@/stores/cartStore";
import { showToast } from "@/components/ui/Toast";
import { CartItem } from "@/types";

type ContentTab = "detail" | "features" | "process" | "notice" | "refund";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const allServices = useCatalogStore((s) => s.services);
  const allCategories = useCatalogStore((s) => s.categories);

  const service = useMemo(
    () => allServices.find((s) => s.id === params.id) ?? null,
    [params.id, allServices]
  );

  const category = useMemo(
    () => allCategories.find((c) => c.id === service?.categoryId),
    [service, allCategories]
  );

  const [expandedCategoryKey, setExpandedCategoryKey] = useState<string | null>(
    service?.categoryKey ?? null
  );
  const [size, setSize] = useState("small");
  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ContentTab>("detail");

  if (!service) {
    return (
      <div className="pt-[56px] min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-slate-500">서비스를 찾을 수 없습니다</p>
          <Link
            href="/services"
            className="text-indigo-600 text-[13px] mt-2 inline-block hover:underline"
          >
            서비스 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = service.sizePrices[size] ?? service.basePrice;
  const optionPrice =
    service.options.find((o) => o.name === selectedOption)?.price ?? 0;
  const totalPrice = (currentPrice + optionPrice) * quantity;

  const relatedServices = allServices.filter(
    (s) =>
      s.categoryKey === service.categoryKey &&
      s.id !== service.id &&
      s.isVisible
  ).slice(0, 4);

  const categoryServices = (key: string) =>
    allServices.filter((s) => s.categoryKey === key && s.isVisible);

  const detailTexts = SERVICE_DETAILS[service.id] ?? [service.description];

  const handleAddToCart = () => {
    const item: CartItem = {
      id: service.id,
      type: "service",
      name: service.name,
      emoji: service.emoji,
      category: category?.name,
      price: currentPrice + optionPrice,
      quantity,
      options: {
        size:
          size === "small" ? "소형" : size === "medium" ? "중형" : "대형",
        addon: selectedOption || undefined,
      },
    };
    addItem(item);
    showToast(`${service.name} 담기 완료`);
  };

  const handleQuote = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const toggleCategory = (key: string) => {
    setExpandedCategoryKey((prev) => (prev === key ? null : key));
  };

  const CONTENT_TABS: { key: ContentTab; label: string }[] = [
    { key: "detail", label: "상세 설명" },
    { key: "features", label: "포함 사항" },
    { key: "process", label: "진행 절차" },
    { key: "notice", label: "안내사항" },
    { key: "refund", label: "취소·환불" },
  ];

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50">
      {/* 브레드크럼 - 모바일 숨김 */}
      <div className="hidden sm:block max-w-content mx-auto px-4 sm:px-6 py-3">
        <nav className="flex items-center gap-1.5 text-[13px] text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            홈
          </Link>
          <ChevronRight size={12} />
          <Link
            href="/services"
            className="hover:text-gray-900 transition-colors"
          >
            서비스
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/services?category=${service.categoryKey}`}
            className="hover:text-gray-900 transition-colors"
          >
            {category?.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-500 truncate max-w-[200px]">{service.name}</span>
        </nav>
      </div>

      {/* 히어로 이미지 + 서비스 정보 */}
      <div className="max-w-content mx-auto px-0 sm:px-6 mb-6 sm:mb-8">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] sm:rounded-[14px] overflow-hidden">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-slate-200 flex items-center justify-center">
              <span className="text-4xl sm:text-6xl font-bold text-gray-300">
                {service.name[0]}
              </span>
            </div>
          )}
          {/* 그라데이션 오버레이 + 텍스트 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              {service.isPopular && (
                <span className="text-[10px] sm:text-[11px] font-semibold bg-indigo-500 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
                  인기
                </span>
              )}
              <span className="text-[12px] sm:text-[13px] text-white/70">{category?.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
              {service.name}
            </h1>
            <p className="text-[13px] sm:text-[15px] text-white/70 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* 모바일 간이 가격 정보 */}
      <div className="md:hidden max-w-content mx-auto px-4 mb-4">
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
          <div>
            <p className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider mb-1">견적 계산기</p>
            <p className="font-num text-xl font-extrabold text-gray-900">
              {formatPrice(service.basePrice)}<span className="text-sm text-gray-500 font-bold ml-0.5">원~</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <ShoppingCart size={15} />
              담기
            </button>
          </div>
        </div>
      </div>

      {/* 3단 레이아웃 */}
      <div className="max-w-content mx-auto px-4 sm:px-6 pb-24 md:pb-20 flex gap-6 lg:gap-8">
        {/* 왼쪽 사이드바 - 카테고리 (lg 이상) */}
        <aside className="hidden lg:block w-[200px] shrink-0">
          <div className="sticky top-[72px]">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              카테고리
            </h3>
            <nav className="flex flex-col">
              {allCategories.map((cat) => {
                const isExpanded = expandedCategoryKey === cat.key;
                const services = categoryServices(cat.key);
                const isActive = cat.key === service.categoryKey;

                return (
                  <div key={cat.key}>
                    <button
                      onClick={() => toggleCategory(cat.key)}
                      className={`w-full flex items-center justify-between py-2.5 px-3 text-[13px] rounded-lg transition-all ${
                        isActive
                          ? "text-gray-900 font-semibold bg-indigo-50 border-l-2 border-indigo-500"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="py-1 ml-3">
                        {services.map((s) => (
                          <Link
                            key={s.id}
                            href={`/services/${s.id}`}
                            className={`block py-1.5 pl-3 text-[12px] rounded-md transition-colors ${
                              s.id === service.id
                                ? "text-indigo-600 font-semibold bg-indigo-50"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 패키지 상품 */}
              <Link
                href="/services?category=package"
                className="flex items-center justify-between py-2.5 px-3 text-[13px] text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all mt-2 border-t border-gray-100 pt-4"
              >
                <span>패키지 상품</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">
                  추천
                </span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* ────── 중앙 콘텐츠 ────── */}
        <div className="flex-1 min-w-0">
          {/* 콘텐츠 탭 바 */}
          <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {CONTENT_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {/* 상세 설명 */}
          {activeTab === "detail" && (
            <div className="mb-8 sm:mb-10">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-3">
                {detailTexts.map((text, i) => (
                  <p
                    key={i}
                    className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 포함 사항 */}
          {activeTab === "features" && service.features.length > 0 && (
            <div className="mb-8 sm:mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {service.features.map((f) => (
                  <div
                    key={f.title}
                    className="flex gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-indigo-600 sm:w-3 sm:h-3" />
                    </div>
                    <div>
                      <p className="text-[12px] sm:text-[13px] font-medium text-gray-900">
                        {f.title}
                      </p>
                      <p className="text-[11px] sm:text-[12px] text-gray-500 mt-0.5">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "features" && service.features.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              포함 사항 정보가 없습니다.
            </div>
          )}

          {/* 진행 절차 */}
          {activeTab === "process" && service.processSteps.length > 0 && (
            <div className="mb-8 sm:mb-10">
              <div className="space-y-0">
                {service.processSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[11px] sm:text-[12px] font-bold text-indigo-600 shrink-0">
                        {i + 1}
                      </div>
                      {i < service.processSteps.length - 1 && (
                        <div className="w-px flex-1 min-h-[20px] sm:min-h-[24px] bg-gray-200" />
                      )}
                    </div>
                    <div className="pb-5 sm:pb-6 flex-1">
                      <h4 className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                        {step.name}
                      </h4>
                      <p className="text-[11px] sm:text-[12px] text-gray-500 mt-0.5">
                        {getStepDescription(step.name)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "process" && service.processSteps.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              진행 절차 정보가 없습니다.
            </div>
          )}

          {/* 안내사항 */}
          {activeTab === "notice" && (
            <div className="mb-8 sm:mb-10 space-y-3 sm:space-y-4">
              {[
                {
                  title: "견적 유효기간",
                  desc: "견적서 발행일로부터 30일간 유효하며, 이후 가격이 변동될 수 있습니다.",
                },
                {
                  title: "부가세 안내",
                  desc: "모든 표시 가격은 VAT 별도 가격이며, 세금계산서 발행이 가능합니다.",
                },
                {
                  title: "규모 및 일정 협의",
                  desc: "행사 규모, 장소, 일정에 따라 최종 금액이 달라질 수 있으며, 상담을 통해 정확한 견적을 안내드립니다.",
                },
                {
                  title: "결제 방법",
                  desc: "계약금 50% 선입금 후 진행되며, 잔금은 행사 완료 후 7일 이내 정산합니다.",
                },
                {
                  title: "서비스 변경",
                  desc: "행사 7일 전까지 서비스 구성 변경이 가능하며, 이후 변경 시 추가 비용이 발생할 수 있습니다.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 items-start p-3 sm:p-4 bg-white border border-gray-200 rounded-xl"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-[12px] sm:text-[13px] font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 취소·환불 */}
          {activeTab === "refund" && (
            <div className="mb-8 sm:mb-10">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                <p className="text-[12px] sm:text-[13px] font-semibold text-amber-700">
                  취소 시점에 따라 환불 금액이 달라집니다
                </p>
                <p className="text-[11px] sm:text-[12px] text-amber-600 mt-1">
                  아래 규정은 계약서에 별도 명시된 경우 계약 조건이 우선합니다
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-[12px] sm:text-[13px]">
                  <thead>
                    <tr className="bg-white">
                      <th className="text-left py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-500">
                        취소 시점
                      </th>
                      <th className="text-right py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-gray-500">
                        환불율
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { period: "행사 14일 전까지", rate: "100% 환불" },
                      { period: "행사 7~13일 전", rate: "80% 환불" },
                      { period: "행사 3~6일 전", rate: "50% 환불" },
                      { period: "행사 1~2일 전", rate: "20% 환불" },
                      { period: "행사 당일", rate: "환불 불가" },
                    ].map((row, i) => (
                      <tr
                        key={row.period}
                        className={
                          i < 4
                            ? "border-t border-gray-200"
                            : "border-t border-gray-200 bg-red-50"
                        }
                      >
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-gray-700">
                          {row.period}
                        </td>
                        <td
                          className={`py-2.5 sm:py-3 px-3 sm:px-4 text-right font-semibold ${
                            row.rate === "환불 불가"
                              ? "text-red-500"
                              : "text-gray-900"
                          }`}
                        >
                          {row.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 sm:mt-4 space-y-2">
                {[
                  "천재지변, 전염병 등 불가항력적 사유의 경우 별도 협의합니다.",
                  "이미 진행된 제작물(인쇄, 출력 등)은 환불 대상에서 제외됩니다.",
                  "환불 요청은 이메일(paran@parancompany.co.kr) 또는 전화(02-6342-2800)로 접수해주세요.",
                ].map((text) => (
                  <p
                    key={text}
                    className="text-[11px] sm:text-[12px] text-gray-500 flex items-start gap-2"
                  >
                    <span className="shrink-0">*</span>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ── 관련 서비스 (이미지 포함 미니 카드) ── */}
          {relatedServices.length > 0 && (
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">
                함께 많이 선택하는 서비스
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {relatedServices.map((rs) => (
                  <Link
                    key={rs.id}
                    href={`/services/${rs.id}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {rs.imageUrl ? (
                        <Image
                          src={rs.imageUrl}
                          alt={rs.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 150px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-400">{rs.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <p className="text-[11px] sm:text-[12px] font-medium text-gray-900 line-clamp-1">
                        {rs.name}
                      </p>
                      <p className="text-[11px] sm:text-[12px] font-num text-gray-500 mt-0.5">
                        {formatPrice(rs.basePrice)}원~
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 가격 패널 공간 확보용 spacer */}
        <div className="hidden md:block w-[280px] lg:w-[300px] shrink-0" />
      </div>

      {/* ────── 오른쪽 고정 견적 패널 (md 이상) ────── */}
      <div
        className="hidden md:block fixed top-[72px] w-[280px] lg:w-[300px] z-30 max-h-[calc(100vh-88px)] overflow-y-auto"
        style={{ right: 'max(1rem, calc(50vw - 586px))' }}
      >
        <div className="border border-gray-200 bg-white rounded-[14px] p-4 lg:p-6 shadow-xl shadow-gray-200/50">
          {/* 견적 계산기 라벨 */}
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-5">
            견적 계산기
          </p>

          {/* 규모 선택 */}
          <div className="mb-4">
            <label className="text-[13px] font-semibold text-gray-700 mb-2 block">
              규모 선택
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border border-gray-200 bg-white rounded-lg px-3 lg:px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
            >
              <option value="small">
                소형 ({formatPrice(service.sizePrices.small ?? service.basePrice)}원)
              </option>
              <option value="medium">
                중형 ({formatPrice(service.sizePrices.medium ?? service.basePrice)}원)
              </option>
              <option value="large">
                대형 ({formatPrice(service.sizePrices.large ?? service.basePrice)}원)
              </option>
            </select>
          </div>

          {/* 추가 옵션 */}
          {service.options.length > 0 && (
            <div className="mb-4">
              <label className="text-[13px] font-semibold text-gray-700 mb-2 block">
                추가 옵션
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-lg px-3 lg:px-4 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              >
                <option value="">옵션을 선택하세요</option>
                {service.options.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name} (+{formatPrice(opt.price)}원)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 수량 */}
          <div className="mb-6">
            <label className="text-[13px] font-semibold text-gray-700 mb-2 block">
              수량
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-base font-semibold font-num text-gray-900 w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <hr className="border-gray-200 mb-4" />

          {/* 예상 합계 */}
          <div className="mb-5">
            <p className="text-[13px] text-gray-500 mb-1">예상 합계</p>
            <p className="font-num text-2xl font-extrabold text-indigo-600">
              {formatPrice(totalPrice)}
              <span className="text-base font-bold">원</span>
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <ShoppingCart size={18} />
              장바구니 담기
            </button>
            <button
              onClick={handleQuote}
              className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors"
            >
              바로 견적 요청
            </button>
          </div>

          {/* 전화번호 링크 */}
          <a
            href="tel:02-6342-2800"
            className="flex items-center justify-center gap-2 mt-4 text-[13px] text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Phone size={14} />
            02-6342-2800
          </a>
        </div>
      </div>

      {/* 모바일 하단 고정 바 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-50 border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] text-gray-500">예상 합계</span>
          <span className="font-num text-lg font-extrabold text-indigo-600">
            {formatPrice(totalPrice)}원
          </span>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 flex-1 bg-indigo-500 hover:bg-indigo-400 text-white text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
          >
            <ShoppingCart size={15} />
            담기
          </button>
          <button
            onClick={handleQuote}
            className="flex items-center justify-center gap-1.5 flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
          >
            <FileText size={15} />
            바로 견적
          </button>
        </div>
      </div>
    </div>
  );
}

/** 진행 단계별 간단 설명 헬퍼 */
function getStepDescription(stepName: string): string {
  const descriptions: Record<string, string> = {
    "요구사항 확인": "고객님의 행사 목적, 규모, 일정 등을 상세히 파악합니다.",
    "초안 작성": "요구사항을 바탕으로 초안을 작성하여 전달드립니다.",
    "피드백 반영": "고객님의 피드백을 반영하여 수정·보완합니다.",
    "최종 납품": "최종 확인 후 완성본을 납품합니다.",
    "현장 지원": "행사 당일 현장에서 운영을 지원합니다.",
    "시안 요청": "원하시는 디자인 방향과 참고자료를 접수합니다.",
    "디자인 작업": "전문 디자이너가 시안을 제작합니다.",
    "디자인": "전문 디자이너가 시안을 제작합니다.",
    "출력": "최종 확인된 디자인을 고품질로 출력합니다.",
    "설치": "행사장에 직접 방문하여 설치를 완료합니다.",
    "배송": "제작 완료된 제품을 안전하게 배송합니다.",
    "피드백": "고객님의 피드백을 반영하여 수정합니다.",
    "현장 답사": "행사 장소를 직접 방문하여 환경을 확인합니다.",
    "도면 설계": "답사 결과를 바탕으로 설치 도면을 작성합니다.",
    "자재 준비": "필요한 자재와 장비를 준비합니다.",
    "철거": "행사 종료 후 깔끔하게 철거·정리합니다.",
    "장비 설치": "전문 장비를 반입하고 세팅합니다.",
    "리허설": "사전 테스트를 통해 완벽한 운영을 준비합니다.",
    "행사 운영": "행사 당일 전문 인력이 실시간 운영합니다.",
    "규격 확인": "행사장 규모에 맞는 최적 규격을 결정합니다.",
    "장비 준비": "확정된 규격에 맞는 장비를 준비합니다.",
    "테스트": "설치 후 기능 테스트를 진행합니다.",
    "운영": "행사 중 실시간 모니터링과 운영을 합니다.",
    "행사 정보 확인": "행사의 성격, 규모, 대상 등 정보를 확인합니다.",
    "MC 매칭": "행사 특성에 맞는 전문 MC를 선정합니다.",
    "대본 작성": "행사 흐름에 맞는 진행 대본을 작성합니다.",
    "본행사": "당일 전문적으로 행사를 진행합니다.",
    "콘셉트 확인": "원하시는 디자인 콘셉트와 방향을 확인합니다.",
    "제작": "확정된 디자인을 바탕으로 실물을 제작합니다.",
    "메뉴 협의": "행사 성격에 맞는 메뉴를 함께 선정합니다.",
    "식자재 준비": "신선한 식자재를 준비합니다.",
    "현장 세팅": "행사장에서 테이블과 음식을 세팅합니다.",
    "서비스 운영": "행사 중 서빙과 운영을 진행합니다.",
    "정리": "행사 종료 후 깔끔하게 정리합니다.",
    "촬영 협의": "촬영 범위와 원하시는 스타일을 협의합니다.",
    "현장 촬영": "행사 전 과정을 전문적으로 촬영합니다.",
    "보정 작업": "촬영된 사진을 전문적으로 보정합니다.",
    "납품": "보정 완료된 사진을 전달드립니다.",
  };
  return descriptions[stepName] ?? "해당 단계의 작업을 진행합니다.";
}
