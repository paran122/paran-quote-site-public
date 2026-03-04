"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Plus,
  Minus,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useCartStore } from "@/stores/cartStore";
import { showToast } from "@/components/ui/Toast";
import { CartItem } from "@/types";

const ADDITIONAL_SERVICES = [
  {
    id: "svc-12", emoji: "📸", name: "행사 촬영",
    description: "전문 촬영팀이 행사 전 과정을 촬영합니다",
    features: ["사진사 1인 (반일 기준)", "보정 사진 200장 이상 납품", "행사 전과정 촬영"],
    sizePrices: { small: 800000, medium: 1200000, large: 2000000 } as Record<string, number>,
    sizeLabels: { small: "반일 (3시간)", medium: "종일 (6시간)", large: "이틀 이상" } as Record<string, string>,
    options: [{ name: "드론 촬영", price: 500000 }],
  },
  {
    id: "add-video", emoji: "🎬", name: "영상 편집",
    description: "행사 하이라이트 영상 촬영·편집·납품",
    features: ["영상 촬영 (2~3시간)", "하이라이트 편집", "자막·BGM 삽입", "MP4 파일 납품"],
    sizePrices: { small: 600000, medium: 900000, large: 1500000 } as Record<string, number>,
    sizeLabels: { small: "하이라이트 (3분)", medium: "스탠다드 (5분)", large: "풀 버전 (10분+)" } as Record<string, string>,
    options: [{ name: "인터뷰 영상 추가", price: 400000 }],
  },
  {
    id: "svc-9", emoji: "📷", name: "포토존 제작",
    description: "맞춤형 포토존 디자인·제작·설치·철거",
    features: ["브랜드 맞춤 디자인 시안", "구조물 제작·설치", "행사 후 철거 포함"],
    sizePrices: { small: 1200000, medium: 1800000, large: 2500000 } as Record<string, number>,
    sizeLabels: { small: "기본형 (2m×2m)", medium: "중형 (3m×2.5m)", large: "대형 (4m×3m)" } as Record<string, string>,
    options: [{ name: "포토 프린터 (즉석 인화)", price: 500000 }],
  },
  {
    id: "svc-10", emoji: "☕", name: "커피/다과",
    description: "프리미엄 커피·다과 케이터링 서비스",
    features: ["현장 바리스타 운영", "쿠키·과일 등 다과 세팅", "일회용품·냅킨 포함"],
    sizePrices: { small: 500000, medium: 800000, large: 1200000 } as Record<string, number>,
    sizeLabels: { small: "50명 이하", medium: "51~150명", large: "151명 이상" } as Record<string, string>,
    options: [{ name: "디저트 추가", price: 300000 }],
  },
  {
    id: "add-report", emoji: "📊", name: "결과보고서",
    description: "행사 결과 분석 및 보고서 작성·납품",
    features: ["행사 결과 데이터 정리", "사진·영상 포함 보고서", "개선점 분석 리포트"],
    sizePrices: { small: 600000, medium: 900000, large: 1400000 } as Record<string, number>,
    sizeLabels: { small: "기본 (10p)", medium: "상세 (20p)", large: "종합 (30p+)" } as Record<string, string>,
    options: [{ name: "영문 번역", price: 400000 }],
  },
  {
    id: "add-interpreter", emoji: "🌐", name: "통역사 섭외",
    description: "행사 전문 통역사 섭외·배치 서비스",
    features: ["경력 5년 이상 전문 통역사", "동시통역 장비 포함", "사전 자료 번역"],
    sizePrices: { small: 600000, medium: 1000000, large: 1600000 } as Record<string, number>,
    sizeLabels: { small: "순차통역 1인", medium: "동시통역 1인", large: "동시통역 2인" } as Record<string, string>,
    options: [{ name: "자료 번역 추가", price: 300000 }],
  },
];

const SIZE_LABEL_MAP: Record<string, Record<string, string>> = {
  "전문 MC": { small: "MC 1인 (반일)", medium: "MC 1인 (종일)", large: "MC 2인 (종일)" },
  "메인 현수막": { small: "소형 (2m×1m)", medium: "중형 (4m×1.5m)", large: "대형 (6m×2m)" },
  "배너·X배너": { small: "X배너 1개", medium: "X배너 2~3개", large: "X배너 5개+" },
  "등록 데스크": { small: "1개소 (100명↓)", medium: "2개소 (200명↓)", large: "3개소 (300명+)" },
  "음향 시스템": { small: "소규모 (50명↓)", medium: "중규모 (150명↓)", large: "대규모 (300명+)" },
  "LED 스크린": { small: "소형 (3m×2m)", medium: "중형 (5m×3m)", large: "대형 (8m×4m)" },
  "컨퍼런스 기획서": { small: "소형 행사", medium: "중형 행사", large: "대형 행사" },
  "세미나 기획서": { small: "소형 행사", medium: "중형 행사", large: "대형 행사" },
  "포토존 제작": { small: "기본형 (2m×2m)", medium: "중형 (3m×2.5m)", large: "대형 (4m×3m)" },
  "커피/다과": { small: "50명 이하", medium: "51~150명", large: "151명 이상" },
  "뷔페 케이터링": { small: "50명 이하", medium: "100명 이하", large: "200명 이상" },
  "행사 촬영": { small: "반일 (3시간)", medium: "종일 (6시간)", large: "이틀 이상" },
};

const STEP_LABELS = ["행사 유형", "구성 방법", "서비스 선택", "확인"];

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="pt-[56px] min-h-screen bg-slate-50 dark:bg-[#0b1120] " />}>
      <BuildPageContent />
    </Suspense>
  );
}

function BuildPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const ALL_PACKAGES = useCatalogStore((s) => s.packages);
  const SERVICES = useCatalogStore((s) => s.services);
  const EVENT_TYPES = useCatalogStore((s) => s.eventTypes);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 1: 행사 유형
  const [eventType, setEventType] = useState("");

  // 선택한 행사 유형에 맞는 패키지만 필터
  const selectedET = EVENT_TYPES.find((e) => e.key === eventType);
  const PACKAGES = selectedET
    ? ALL_PACKAGES.filter((p) => p.eventType === selectedET.label)
    : ALL_PACKAGES;

  useEffect(() => {
    const et = searchParams.get("eventType");
    if (et && EVENT_TYPES.some((t) => t.key === et)) {
      setEventType(et);
    }
  }, [searchParams, EVENT_TYPES]);
  // Step 1: 규모
  const SCALE_LABELS = ["50명 이하", "50~100명", "100~200명", "200~500명", "500명 이상"];
  const [scale, setScale] = useState(1);

  // Step 2: 구성 방법
  const [buildMethod, setBuildMethod] = useState<"package" | "custom" | "">("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  // Step 3: 추가 서비스
  const [addedServices, setAddedServices] = useState<string[]>([]);
  const [expandedAdditionalId, setExpandedAdditionalId] = useState<string | null>(null);
  const [additionalConfigs, setAdditionalConfigs] = useState<Record<string, { size: string; option: string }>>({});
  const [expandedPkgServiceId, setExpandedPkgServiceId] = useState<string | null>(null);

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId);
  const packageServices = selectedPackage
    ? SERVICES.filter((s) => selectedPackage.includedServiceIds.includes(s.id))
    : [];

  const canNext = () => {
    if (step === 0) return eventType !== "";
    if (step === 1) return buildMethod === "package" && selectedPackageId !== "";
    return true;
  };

  const goNext = () => {
    if (!canNext()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goPrev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const getAdditionalPrice = (id: string) => {
    const svc = ADDITIONAL_SERVICES.find((s) => s.id === id);
    if (!svc) return 0;
    const config = additionalConfigs[id] ?? { size: "small", option: "" };
    const basePrice = svc.sizePrices[config.size] ?? svc.sizePrices.small;
    const optPrice = svc.options.find((o) => o.name === config.option)?.price ?? 0;
    return basePrice + optPrice;
  };

  const addAdditional = (id: string) => {
    if (!addedServices.includes(id)) {
      setAddedServices((prev) => [...prev, id]);
      if (!additionalConfigs[id]) {
        setAdditionalConfigs((prev) => ({ ...prev, [id]: { size: "small", option: "" } }));
      }
    }
    setExpandedAdditionalId(null);
  };

  const removeAdditional = (id: string) => {
    setAddedServices((prev) => prev.filter((x) => x !== id));
    setExpandedAdditionalId(null);
  };

  const updateAdditionalConfig = (id: string, key: "size" | "option", value: string) => {
    setAdditionalConfigs((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { size: "small", option: "" }), [key]: value },
    }));
  };

  const toggleExpandAdditional = (id: string) => {
    setExpandedAdditionalId((prev) => (prev === id ? null : id));
  };

  // 최종 합계
  const packagePrice = selectedPackage?.discountPrice ?? 0;
  const additionalPrice = addedServices.reduce((sum, id) => sum + getAdditionalPrice(id), 0);
  const totalPrice = packagePrice + additionalPrice;

  const handleSubmit = () => {
    // 패키지 담기
    if (selectedPackage) {
      const pkgItem: CartItem = {
        id: selectedPackage.id,
        type: "package",
        name: selectedPackage.name,
        emoji: selectedPackage.emoji,
        price: selectedPackage.discountPrice,
        quantity: 1,
        includedServices: packageServices.map((s) => s.name),
        discountRate: selectedPackage.discountRate,
      };
      addItem(pkgItem);
    }

    // 추가 서비스 담기
    addedServices.forEach((id) => {
      const svc = ADDITIONAL_SERVICES.find((s) => s.id === id);
      if (svc) {
        const config = additionalConfigs[id] ?? { size: "small", option: "" };
        const sizePrice = svc.sizePrices[config.size] ?? svc.sizePrices.small;
        const optPrice = svc.options.find((o) => o.name === config.option)?.price ?? 0;
        const sizeLabel = config.size === "small" ? "소형" : config.size === "medium" ? "중형" : "대형";
        const item: CartItem = {
          id: svc.id,
          type: "service",
          name: svc.name,
          emoji: svc.emoji,
          price: sizePrice + optPrice,
          quantity: 1,
          options: {
            size: `${sizeLabel} (${svc.sizeLabels[config.size]})`,
            addon: config.option || undefined,
          },
        };
        addItem(item);
      }
    });

    showToast("장바구니에 담았습니다");
    router.push("/checkout");
  };

  const progressWidth = ((step + 1) / STEP_LABELS.length) * 100;

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50 dark:bg-[#0b1120] ">
      {/* 프로그레스 바 */}
      <div className="max-w-[720px] mx-auto px-6 py-8">
        <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-[12px] font-medium ${
                i <= step
                  ? i < step
                    ? "text-success"
                    : "text-primary font-semibold"
                  : "text-slate-400"
              }`}
            >
              {i < step ? "✓ " : ""}
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* 스텝 콘텐츠 */}
      <div className="max-w-[960px] mx-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: 행사 유형 */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-2">
                  어떤 행사를 준비하시나요?
                </h2>
                <p className="text-slate-500 text-[13px]text-center mb-8">
                  행사 유형에 맞는 서비스를 추천해드립니다
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {EVENT_TYPES.map((et) => (
                    <button
                      key={et.key}
                      onClick={() => { setEventType(et.key); setSelectedPackageId(""); }}
                      className={`relative h-[200px] bg-white dark:bg-white/5 border-2 rounded-[6px] p-6 text-left transition-all hover:shadow-md ${
                        eventType === et.key
                          ? "border-primary bg-primary-50 dark:bg-primary/10"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {eventType === et.key && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      )}
                      <span className="text-[2.5rem]">{et.emoji}</span>
                      <p className="font-bold text-slate-900 dark:text-white mt-3">{et.label}</p>
                      <p className="text-[12px]text-slate-500 mt-1">{et.description}</p>
                    </button>
                  ))}
                </div>

                {/* 규모 슬라이더 */}
                {eventType && (
                  <div className="mt-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-[10px] p-6">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-1">
                      예상 참석 규모
                    </h3>
                    <p className="text-[12px]text-slate-500 mb-5">
                      규모에 맞는 패키지와 가격을 안내해드립니다
                    </p>
                    <div className="px-2">
                      <input
                        type="range"
                        min={0}
                        max={SCALE_LABELS.length - 1}
                        step={1}
                        value={scale}
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                      />
                      <div className="flex justify-between mt-2">
                        {SCALE_LABELS.map((label, i) => (
                          <span
                            key={label}
                            className={`text-[11px] ${
                              i === scale
                                ? "text-primary font-bold"
                                : "text-slate-400"
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-primary-50 text-primary text-[13px] font-semibold px-4 py-1.5 rounded-[4px]">
                        {SCALE_LABELS[scale]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: 구성 방법 */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-2">
                  어떻게 구성하시겠어요?
                </h2>
                <p className="text-slate-500 text-[13px]text-center mb-8">
                  추천 패키지로 시작하거나 직접 구성할 수 있습니다
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setBuildMethod("package")}
                    className={`p-6 border-2 rounded-[6px] text-left transition-all ${
                      buildMethod === "package"
                        ? "border-accent bg-accent-50 dark:bg-accent-50/10"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-white/5 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[2rem]">📦</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-2">추천 패키지</p>
                    <p className="text-[12px]text-slate-500 mt-1">
                      검증된 구성으로 할인 혜택까지
                    </p>
                    <span className="inline-block mt-2 text-[12px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-[4px]">
                      추천
                    </span>
                  </button>
                  <a
                    href="https://pf.kakao.com/_xkexdLG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-white/5 hover:border-slate-300 rounded-[6px] text-left transition-all"
                  >
                    <span className="text-[2rem]">💬</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-2">맞춤 상담</p>
                    <p className="text-[12px]text-slate-500 mt-1">
                      카카오톡으로 맞춤 견적 상담
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-[12px] font-medium text-primary">
                      카카오톡 상담하기
                      <ExternalLink size={12} />
                    </span>
                  </a>
                </div>

                {/* 패키지 선택 */}
                {buildMethod === "package" && (
                  <div className="space-y-3">
                    <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white">
                      패키지를 선택하세요
                    </h3>
                    {PACKAGES.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        선택한 행사 유형에 맞는 패키지가 없습니다.
                        <br />
                        <a
                          href="https://pf.kakao.com/_xkexdLG"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-primary font-medium underline"
                        >
                          카카오톡으로 맞춤 상담하기
                        </a>
                      </div>
                    )}
                    {PACKAGES.map((pkg) => {
                      const included = SERVICES.filter((s) =>
                        pkg.includedServiceIds.includes(s.id)
                      );
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`w-full p-4 border-2 rounded-[6px] text-left transition-all ${
                            selectedPackageId === pkg.id
                              ? "border-accent bg-accent-50 dark:bg-accent-50/10"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-white/5 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{pkg.emoji}</span>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 dark:text-white">{pkg.name}</p>
                              {pkg.description && (
                                <p className="text-[11px] text-primary-600 font-medium mt-0.5">
                                  {pkg.description}
                                </p>
                              )}
                              <p className="text-[12px]text-slate-500 mt-0.5">
                                {included.map((s) => s.name).join(" · ")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[12px]text-slate-400 line-through font-num">
                                {formatPrice(pkg.originalPrice)}원
                              </p>
                              <p className="font-bold font-num text-primary">
                                {formatPrice(pkg.discountPrice)}원
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: 서비스 선택 */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-2">
                  추가 서비스를 선택하세요
                </h2>
                <p className="text-slate-500 text-[13px]text-center mb-8">
                  필요한 서비스를 추가할 수 있습니다 (선택사항)
                </p>

                {/* 패키지 요약 */}
                {selectedPackage && (
                  <div className="bg-accent-50 border-2 border-accent rounded-[10px] p-5 mb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{selectedPackage.emoji}</span>
                      <h3 className="font-bold text-slate-900">
                        {selectedPackage.name}
                      </h3>
                      <span className="text-[12px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-[4px]">
                        {selectedPackage.discountRate}% 할인
                      </span>
                    </div>
                    {selectedPackage.description && (
                      <p className="text-[12px]text-amber-700 mb-4 ml-8">
                        {selectedPackage.description}
                      </p>
                    )}
                    {!selectedPackage.description && <div className="mb-3" />}
                    <div className="space-y-0">
                      {packageServices.map((s) => {
                        const isExpanded = expandedPkgServiceId === s.id;
                        const sizeLabels = SIZE_LABEL_MAP[s.name];
                        return (
                          <div key={s.id} className="border-t border-amber-200/50 first:border-t-0">
                            <button
                              type="button"
                              onClick={() => setExpandedPkgServiceId(isExpanded ? null : s.id)}
                              className="w-full flex items-center gap-2 py-3 text-left"
                            >
                              <CheckCircle size={14} className="text-success shrink-0" />
                              <span className="text-[13px] font-medium text-slate-800 flex-1">{s.name}</span>
                              <span className="text-[12px]text-slate-400 font-num">
                                {formatPrice(s.basePrice)}원~
                              </span>
                              <ChevronDown
                                size={14}
                                className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="pb-3 pl-6 space-y-2.5">
                                <p className="text-[12px]text-slate-500">{s.description}</p>
                                {s.features.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase">포함 사항</p>
                                    {s.features.map((f) => (
                                      <div key={f.title} className="flex items-start gap-1.5 text-[12px]text-slate-600">
                                        <span className="text-success mt-0.5">·</span>
                                        <span><span className="font-medium">{f.title}</span> — {f.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {sizeLabels && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {(["small", "medium", "large"] as const).map((sz) => (
                                      <span key={sz} className="text-[11px] bg-white/70 text-slate-500 px-2 py-0.5 rounded-[4px] border border-amber-200/60">
                                        {sz === "small" ? "소형" : sz === "medium" ? "중형" : "대형"}: {sizeLabels[sz]} ({formatPrice(s.sizePrices[sz] ?? s.basePrice)}원)
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {s.options.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase">추가 옵션</p>
                                    {s.options.map((opt) => (
                                      <span key={opt.name} className="text-[12px]text-slate-500">
                                        + {opt.name} ({formatPrice(opt.price)}원)
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 추가 서비스 */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-slate-900">추가 서비스 선택</h3>
                  <a
                    href="https://pf.kakao.com/_xkexdLG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[12px]text-slate-500 hover:text-primary transition-colors"
                  >
                    그 외 서비스는 카카오톡으로 상담하세요
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div className="space-y-3">
                  {ADDITIONAL_SERVICES.map((svc) => {
                    const isAdded = addedServices.includes(svc.id);
                    const isExpanded = expandedAdditionalId === svc.id;
                    const config = additionalConfigs[svc.id] ?? { size: "small", option: "" };
                    const currentPrice = svc.sizePrices[config.size] ?? svc.sizePrices.small;
                    const optPrice = svc.options.find((o) => o.name === config.option)?.price ?? 0;

                    return (
                      <div
                        key={svc.id}
                        className={`bg-white dark:bg-white/5 border rounded-[10px] overflow-hidden transition-all ${
                          isAdded
                            ? "border-primary ring-1 ring-primary/20"
                            : isExpanded
                            ? "border-slate-300 dark:border-slate-600 shadow-sm"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {/* 헤더 */}
                        <button
                          type="button"
                          onClick={() => toggleExpandAdditional(svc.id)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="text-xl">{svc.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-medium text-slate-900 dark:text-white">{svc.name}</p>
                              {isAdded && (
                                <span className="text-[10px] font-semibold bg-primary-50 text-primary px-1.5 py-0.5 rounded-[4px]">
                                  추가됨
                                </span>
                              )}
                            </div>
                            <p className="text-[12px]text-slate-500 mt-0.5">{svc.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[13px] font-bold font-num text-slate-900 dark:text-white">
                              {isAdded ? formatPrice(currentPrice + optPrice) : formatPrice(svc.sizePrices.small)}원{!isAdded && "~"}
                            </p>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* 확장 영역 */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 dark:border-slate-700/50 px-4 py-4 space-y-4">
                            {/* 포함 사항 */}
                            <div>
                              <p className="text-[12px] font-semibold text-slate-500 mb-2">포함 사항</p>
                              <div className="space-y-1">
                                {svc.features.map((f) => (
                                  <div key={f} className="flex items-start gap-1.5 text-[12px]text-slate-600">
                                    <CheckCircle size={12} className="text-success shrink-0 mt-0.5" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 규모 선택 */}
                            <div>
                              <p className="text-[12px] font-semibold text-slate-500 mb-2">규모 선택</p>
                              <div className="grid grid-cols-3 gap-2">
                                {(["small", "medium", "large"] as const).map((sz) => {
                                  const isSelected = config.size === sz;
                                  return (
                                    <button
                                      key={sz}
                                      type="button"
                                      onClick={() => updateAdditionalConfig(svc.id, "size", sz)}
                                      className={`p-2.5 border-2 rounded-[6px] text-center transition-all ${
                                        isSelected
                                          ? "border-primary bg-primary-50 dark:bg-primary/10"
                                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                      }`}
                                    >
                                      <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                                        {sz === "small" ? "소형" : sz === "medium" ? "중형" : "대형"}
                                      </p>
                                      <p className="text-[10px] text-slate-500 mt-0.5">{svc.sizeLabels[sz]}</p>
                                      <p className="text-[12px] font-bold font-num text-slate-900 dark:text-white mt-1">
                                        {formatPrice(svc.sizePrices[sz])}원
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* 추가 옵션 */}
                            {svc.options.length > 0 && (
                              <div>
                                <p className="text-[12px] font-semibold text-slate-500 mb-2">추가 옵션</p>
                                {svc.options.map((opt) => {
                                  const isOptSelected = config.option === opt.name;
                                  return (
                                    <button
                                      key={opt.name}
                                      type="button"
                                      onClick={() =>
                                        updateAdditionalConfig(svc.id, "option", isOptSelected ? "" : opt.name)
                                      }
                                      className={`flex items-center justify-between w-full px-3 py-2.5 border rounded-[6px] transition-all ${
                                        isOptSelected
                                          ? "border-primary bg-primary-50 dark:bg-primary/10"
                                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                          isOptSelected ? "border-primary bg-primary" : "border-slate-300"
                                        }`}>
                                          {isOptSelected && <CheckCircle size={10} className="text-white" />}
                                        </div>
                                        <span className="text-[12px]text-slate-700">{opt.name}</span>
                                      </div>
                                      <span className="text-[12px] font-num text-slate-500">+{formatPrice(opt.price)}원</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 가격 + 추가/제거 버튼 */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <div>
                                <p className="text-[11px] text-slate-400">선택 금액</p>
                                <p className="text-base font-extrabold font-num text-primary">
                                  {formatPrice(currentPrice + optPrice)}원
                                </p>
                              </div>
                              {isAdded ? (
                                <button
                                  type="button"
                                  onClick={() => removeAdditional(svc.id)}
                                  className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-[6px] text-[13px] font-medium hover:bg-red-50 transition-colors"
                                >
                                  <Minus size={14} />
                                  제거
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addAdditional(svc.id)}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-[6px] text-[13px] font-medium hover:bg-primary-700 transition-colors"
                                >
                                  <Plus size={14} />
                                  추가하기
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: 확인 */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center mb-2">
                  선택 내역을 확인하세요
                </h2>
                <p className="text-slate-500 text-[13px]text-center mb-8">
                  장바구니에 담고 견적을 요청할 수 있습니다
                </p>

                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-[6px] p-6 space-y-4">
                  {/* 행사 유형 */}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">행사 유형</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {EVENT_TYPES.find((e) => e.key === eventType)?.label}
                    </span>
                  </div>

                  {/* 규모 */}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">예상 규모</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {SCALE_LABELS[scale]}
                    </span>
                  </div>

                  {/* 패키지 */}
                  {selectedPackage && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">패키지</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedPackage.emoji} {selectedPackage.name}
                        <span className="text-[12px]text-accent ml-1">
                          ({selectedPackage.discountRate}% 할인)
                        </span>
                      </span>
                    </div>
                  )}

                  {/* 추가 서비스 */}
                  {addedServices.length > 0 && (
                    <div>
                      <span className="text-[13px]text-slate-500">추가 서비스</span>
                      <div className="mt-1.5 space-y-2">
                        {addedServices.map((id) => {
                          const svc = ADDITIONAL_SERVICES.find((s) => s.id === id);
                          const config = additionalConfigs[id] ?? { size: "small", option: "" };
                          const sizeLabel = config.size === "small" ? "소형" : config.size === "medium" ? "중형" : "대형";
                          const price = getAdditionalPrice(id);
                          return svc ? (
                            <div key={id} className="pl-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-700">
                                  {svc.emoji} {svc.name}
                                </span>
                                <span className="font-num text-slate-700">
                                  {formatPrice(price)}원
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {sizeLabel} ({svc.sizeLabels[config.size]})
                                {config.option && ` + ${config.option}`}
                              </p>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-white">합계</span>
                      <span className="text-2xl font-extrabold font-num text-primary">
                        {formatPrice(totalPrice)}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-4 z-30">
        <div className="max-w-[960px] mx-auto px-6 flex justify-between">
          {step > 0 ? (
            <button onClick={goPrev} className="btn-ghost btn-md">
              <ArrowLeft size={16} />
              이전
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={goNext}
              disabled={!canNext()}
              className="btn-primary btn-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
              <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary btn-md">
              <ShoppingCart size={16} />
              장바구니 담기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
