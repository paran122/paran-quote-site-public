"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Star, ChevronRight } from "lucide-react";
import ParticleCanvas from "./ParticleCanvas";
import StatsCounter from "./StatsCounter";
import PartnersMarquee from "./PartnersMarquee";
import MovingBorderButton from "@/components/ui/MovingBorderButton";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { formatPrice } from "@/lib/constants";
import { useCatalogStore } from "@/stores/catalogStore";
import { useThemeStore } from "@/stores/themeStore";
import { pageBgClass } from "@/lib/themes";

/* ─── useInView ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Hero accent config (navy only) ─── */
const ACCENT = {
  text: "text-blue-600", fill: "fill-blue-500", bg50: "bg-blue-50", border100: "border-blue-100",
  badgeText: "text-blue-700", glowBg: "bg-blue-500/5", floatBadge: "bg-blue-500 text-white shadow-lg",
};

/* ─── Section backgrounds (navy only) ─── */
const SEC_BG = { s1: "bg-white", s2: "bg-slate-50" };
const CTA_BOX = "bg-slate-900";

/* ─── Rotating words for hero ─── */
const HERO_WORDS = ["세미나", "컨퍼런스", "포럼", "전시회", "축제", "교육"];

/* ============================================= */
/*  Unified Hero                                  */
/* ============================================= */
function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const wordIdxRef = useRef(0);
  const displayTextRef = useRef("");
  const isDeletingRef = useRef(false);
  const firstTypingDone = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const tick = () => {
      const currentWord = HERO_WORDS[wordIdxRef.current];
      const dt = displayTextRef.current;

      if (!isDeletingRef.current) {
        const next = currentWord.slice(0, dt.length + 1);
        displayTextRef.current = next;
        setDisplayText(next);

        if (next === currentWord) {
          if (!firstTypingDone.current) {
            firstTypingDone.current = true;
            setTimeout(() => setSubtitleVisible(true), 200);
          }
          timerRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, 2000);
          return;
        }
        timerRef.current = setTimeout(tick, 80);
      } else {
        const next = currentWord.slice(0, dt.length - 1);
        displayTextRef.current = next;
        setDisplayText(next);

        if (next === "") {
          isDeletingRef.current = false;
          wordIdxRef.current = (wordIdxRef.current + 1) % HERO_WORDS.length;
          timerRef.current = setTimeout(tick, 300);
          return;
        }
        timerRef.current = setTimeout(tick, 50);
      }
    };

    timerRef.current = setTimeout(tick, 500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050510]">
      <ParticleCanvas variant="navy" />
      <div className="relative z-10 max-w-content mx-auto px-4 sm:px-6 lg:pl-[176px] w-full py-20 sm:py-0">
        <div className="flex items-center gap-12">
          {/* Left - Text */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 sm:mb-8 bg-blue-500/10 border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-300 tracking-wide">250+ 프로젝트 수행 실적</span>
            </div>

            <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[3.75rem] leading-[1.25] font-bold tracking-tight mb-4 sm:mb-6">
              <span className="font-mono font-light text-sky-400">{"{ "}</span>
              <span className="inline-block text-sky-400 min-w-[1ch]">
                {displayText}
                <span className="inline-block w-[2px] h-[0.9em] bg-sky-400 ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
              </span>
              <span className="font-mono font-light text-sky-400">{" }"}</span>
              <br />
              <span className="inline-flex overflow-hidden">
                {"의 미래를 설계합니다".split("").map((char, i) => (
                  <span
                    key={i}
                    className={`inline-block text-white/90 transition-all duration-500 ease-out ${
                      subtitleVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: subtitleVisible ? `${i * 80}ms` : "0ms" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </h1>

            <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg text-slate-400">
              파란컴퍼니 | 행사 전문 에이전시<br />
              기획 → 디자인 → 운영 → 평가 → 완성
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <MovingBorderButton
                href="/services"
                variant="dark"
                duration={3000}
                borderRadius="0.75rem"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                서비스 둘러보기
                <ArrowRight size={16} />
              </MovingBorderButton>
              <MovingBorderButton
                href="https://pf.kakao.com/_xkexdLG"
                variant="dark"
                duration={4000}
                borderRadius="0.75rem"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                무료 상담
              </MovingBorderButton>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-0 mt-8 sm:mt-12">
              {[
                { value: "250+", label: "수행 프로젝트" },
                { value: "90%", label: "재계약률" },
                { value: "93점", label: "참가자 만족도" },
                { value: "50+", label: "클라이언트" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-4 sm:px-6 py-3 ${
                    i > 0 ? "sm:border-l border-slate-700/50" : ""
                  } ${i >= 2 ? "border-t sm:border-t-0 border-slate-700/50" : ""}`}
                >
                  <p className="font-num text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="hidden lg:block flex-1 max-w-md">
            <div className="relative">
              <div className={`absolute -inset-4 rounded-3xl blur-2xl ${ACCENT.glowBg}`} />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-indigo-500/10">
                <Image
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
                  alt="컨퍼런스 행사"
                  width={480}
                  height={360}
                  className="object-cover w-full h-[340px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/60 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-6 rounded-xl px-4 py-3 flex items-center gap-3 bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sky-500/10">
                  <Star size={18} className="text-sky-400 fill-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">93점</p>
                  <p className="text-xs text-slate-400">참가자 만족도</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-400 text-white shadow-lg shadow-sky-500/30">
                90% 재계약
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================= */
/*  Portfolio Showcase (AnimatedTestimonials)      */
/* ============================================= */
function PortfolioShowcase() {
  const { ref, inView } = useInView(0.1);
  const portfolios = useCatalogStore((s) => s.portfolios);

  const testimonials = useMemo(() => {
    return portfolios
      .filter((pf) => pf.isVisible)
      .slice(0, 5)
      .map((pf) => ({
        name: `${pf.year} ${pf.title}`,
        designation: "",
        quote: pf.description ?? "",
        src: pf.imageUrl ?? "/placeholder.jpg",
      }));
  }, [portfolios]);

  return (
    <section
      ref={ref}
      className={`py-20 transition-colors duration-500 ${SEC_BG.s1}`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:pl-[176px]">
        <div className={`flex items-end justify-between mb-2 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              포트폴리오
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              파란컴퍼니가 만들어온 성공 사례
            </p>
          </div>
          <Link href="/work" className="text-sm font-medium flex items-center gap-1 text-blue-500 hover:text-blue-600">
            전체보기
            <ChevronRight size={14} />
          </Link>
        </div>

        <AnimatedTestimonials testimonials={testimonials} autoplay />
      </div>
    </section>
  );
}

/* ============================================= */
/*  Services Grid                                 */
/* ============================================= */
function ServicesGrid() {
  const { ref, inView } = useInView(0.1);
  const allServices = useCatalogStore((s) => s.services);
  const popular = useMemo(() => allServices.filter((s) => s.isPopular), [allServices]);

  return (
    <section
      ref={ref}
      className={`py-20 transition-colors duration-500 ${SEC_BG.s1}`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:pl-[176px]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              인기 서비스
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              가장 많이 찾는 서비스를 확인하세요
            </p>
          </div>
          <Link href="/services" className="text-sm font-medium flex items-center gap-1 text-blue-500 hover:text-blue-600">
            전체보기
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popular.map((svc, i) => (
            <Link
              key={svc.id}
              href={`/services/${svc.id}`}
              className={`
                group relative h-[300px] rounded-xl overflow-hidden shadow-lg
                transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2
                ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{ transitionDelay: inView ? `${i * 80}ms` : "0ms" }}
            >
              {svc.imageUrl ? (
                <Image
                  src={svc.imageUrl}
                  alt={svc.name}
                  fill
                  className="absolute inset-0 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="relative flex h-full flex-col justify-between p-5">
                <div />
                <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-14">
                  <h3 className="text-xl font-bold text-white">{svc.name}</h3>
                  <p className="text-sm text-white/70 mt-1 line-clamp-1">{svc.description}</p>
                </div>
                <div className="absolute -bottom-16 left-0 w-full px-5 pb-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-num text-2xl font-bold text-white">{formatPrice(svc.basePrice)}</span>
                      <span className="text-white/70 text-sm ml-1">원~</span>
                    </div>
                    <span className="flex items-center gap-1.5 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold">
                      자세히
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================= */
/*  Packages Grid                                 */
/* ============================================= */
function PackagesGrid() {
  const { ref, inView } = useInView(0.1);
  const allServices = useCatalogStore((s) => s.services);
  const allPackages = useCatalogStore((s) => s.packages);

  return (
    <section
      ref={ref}
      className={`py-20 transition-colors duration-500 ${SEC_BG.s2}`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:pl-[176px]">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              풀서비스 패키지
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              필요한 모든 것을 한 번에
            </p>
          </div>
          <Link href="/build" className="text-sm font-medium flex items-center gap-1 text-blue-500 hover:text-blue-600">
            맞춤 구성
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {allPackages.map((pkg, i) => {
            const included = allServices.filter((s) => pkg.includedServiceIds.includes(s.id));
            return (
              <div
                key={pkg.id}
                className={`
                  group relative h-[340px] rounded-xl overflow-hidden shadow-lg cursor-pointer
                  transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2
                  ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
              >
                {pkg.imageUrl ? (
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    fill
                    className="absolute inset-0 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                <div className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex justify-end">
                    <span className="text-[11px] font-bold bg-amber-500/90 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {pkg.discountRate}% OFF
                    </span>
                  </div>

                  <div className="transition-transform duration-500 ease-in-out group-hover:-translate-y-16">
                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                    <p className="text-sm text-white/60 mt-1">{pkg.description}</p>
                    <div className="mt-3 space-y-1">
                      {included.slice(0, 3).map((s) => (
                        <div key={s.id} className="flex items-center gap-2">
                          <Check size={12} className="text-amber-400 shrink-0" />
                          <span className="text-xs text-white/70">{s.name}</span>
                        </div>
                      ))}
                      {included.length > 3 && (
                        <p className="text-[11px] text-white/50 pl-5">
                          외 {included.length - 3}개 서비스
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="absolute -bottom-20 left-0 w-full px-5 pb-5 opacity-0 transition-all duration-500 ease-in-out group-hover:bottom-0 group-hover:opacity-100">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-sm text-white/50 line-through font-num">
                          {formatPrice(pkg.originalPrice)}원
                        </span>
                        <div>
                          <span className="font-num text-2xl font-bold text-white">
                            {formatPrice(pkg.discountPrice)}
                          </span>
                          <span className="text-white/70 text-sm ml-1">원</span>
                        </div>
                      </div>
                      <Link
                        href="/build"
                        className="flex items-center gap-1.5 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
                      >
                        시작하기
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================= */
/*  CTA Section                                   */
/* ============================================= */
function CtaSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      ref={ref}
      className={`py-20 transition-colors duration-500 ${SEC_BG.s1}`}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:pl-[176px]">
        <div
          className={`
            rounded-2xl p-8 sm:p-12 text-center transition-all duration-700
            ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            ${CTA_BOX}
          `}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            성공적인 행사, 파란컴퍼니와 함께
          </h2>
          <p className="text-slate-300 mt-3 max-w-md mx-auto text-sm sm:text-base">
            전문 컨설턴트가 맞춤 견적을 빠르게 보내드립니다
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <MovingBorderButton
              href="https://pf.kakao.com/_xkexdLG"
              variant="dark"
              duration={3000}
              borderRadius="0.75rem"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              무료 견적 요청
              <ArrowRight size={16} />
            </MovingBorderButton>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[0.75rem] border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
            >
              서비스 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================= */
/*  Main Landing Page                             */
/* ============================================= */
export default function NewLanding() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${pageBgClass()}`}>
      <div id="section-hero"><Hero /></div>
      <div id="section-partners"><PartnersMarquee theme={theme} /></div>
      <div id="section-portfolio"><PortfolioShowcase /></div>
      <div id="section-services"><ServicesGrid /></div>
      <div id="section-packages"><PackagesGrid /></div>
      <CtaSection />
      <StatsCounter theme={theme} />
    </div>
  );
}
