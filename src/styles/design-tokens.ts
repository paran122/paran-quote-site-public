/**
 * 파란컴퍼니 디자인 토큰
 * ─────────────────────────────────────────
 * 새 페이지(서비스, 블로그, 랜딩 등)를 만들 때
 * 이 파일의 값을 참고하면 기존 사이트와 일관된 디자인을 유지할 수 있습니다.
 *
 * 사용법:
 *   import { colors, typography, layout, buttons, cards } from "@/styles/design-tokens";
 *
 * 이 파일은 실제 코드에서 import해서 쓸 수도 있고,
 * 단순히 레퍼런스 문서로 참고만 해도 됩니다.
 */

// ─── 색상 (Colors) ───────────────────────────────────────

export const colors = {
  // 브랜드 Primary — 버튼, 링크, 강조에 사용
  primary: {
    DEFAULT: "#3B82F6", // blue-500 — 메인 액센트
    50: "#EFF6FF",      // 배경 하이라이트
    100: "#DBEAFE",     // 선택 배경, 호버
    200: "#BFDBFE",     // 연한 보더
    300: "#93C5FD",
    400: "#60A5FA",
    600: "#2563EB",     // 호버 시 진한 버튼
    700: "#1D4ED8",
    800: "#1E40AF",
  },

  // 액센트 — 강조 배지, 특별 CTA
  accent: {
    DEFAULT: "#F59E0B", // amber-500
    50: "#FFFBEB",
    100: "#FEF3C7",
  },

  // 성공/완료 상태
  success: {
    DEFAULT: "#10B981", // emerald-500
    50: "#ECFDF5",
    100: "#D1FAE5",
  },

  // 텍스트 색상 (slate 계열)
  text: {
    heading: "text-slate-900",      // H1, H2, 강조 텍스트
    body: "text-slate-600",         // 본문
    secondary: "text-slate-500",    // 부제목, 설명
    tertiary: "text-slate-400",     // 캡션, 힌트
    link: "text-blue-600",         // 링크
    linkHover: "text-blue-500",    // 링크 호버
  },

  // 배경 색상
  bg: {
    white: "bg-white",             // 기본 배경
    light: "bg-slate-50",          // 교차 섹션 배경, Hero
    card: "bg-white",              // 카드 배경
    dark: "bg-slate-900",          // 다크 섹션 (랜딩 Hero)
    footer: "#0a0f2c",             // 푸터 배경
  },

  // 보더 색상
  border: {
    DEFAULT: "border-slate-200/80",  // 카드, 구분선
    hover: "border-blue-200",        // 호버 시
    light: "border-slate-100",       // 연한 구분선
  },

  // 포트폴리오 카테고리 배지 색상
  category: {
    포럼: "bg-purple-100 text-purple-700",
    세미나: "bg-emerald-100 text-emerald-700",
    행사운영: "bg-blue-100 text-blue-700",
    교육: "bg-amber-100 text-amber-700",
    콘텐츠: "bg-orange-100 text-orange-700",
    전시: "bg-pink-100 text-pink-700",
  },
} as const;


// ─── 타이포그래피 (Typography) ─────────────────────────────

export const typography = {
  // 폰트 패밀리
  font: {
    sans: "font-sans",       // Geist Sans + Noto KR — 기본
    display: "font-display",  // Jakarta + Noto KR — 제목용
    body: "font-body",        // Noto KR + Jakarta — 본문용
    num: "font-num",          // DM Sans — 숫자 강조
    mono: "font-mono",        // Geist Mono — 코드
  },

  // 제목 (Heading)
  h1: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900",
  h2: "text-xl md:text-2xl font-bold text-slate-900",
  h3: "text-lg font-bold text-slate-900",

  // 부제목
  subtitle: "text-sm md:text-base text-slate-500",
  subtitleNarrow: "text-sm md:text-base text-slate-500 max-w-xl mx-auto",

  // 본문
  body: "text-sm leading-relaxed text-slate-600",
  bodyLg: "text-base leading-relaxed text-slate-600",

  // 라벨
  label: "text-xs font-semibold tracking-widest text-blue-600 uppercase",
  caption: "text-xs text-slate-400",

  // 숫자 강조 (통계)
  stat: "text-3xl md:text-4xl font-extrabold text-blue-600 font-num",
  statLabel: "text-sm text-slate-500 mt-1",
} as const;


// ─── 레이아웃 (Layout) ─────────────────────────────────────

export const layout = {
  // 최대 너비
  maxWidth: "max-w-[1200px]",  // = max-w-content

  // 섹션 래퍼
  section: "px-5 md:px-8",
  sectionInner: "mx-auto max-w-[1200px]",

  // 섹션 패딩 (수직)
  sectionPy: "py-12 md:py-16",
  sectionPyLg: "py-16 md:py-24",

  // Hero 섹션
  hero: "bg-slate-50 py-12 md:py-16 text-center",

  // GNB 높이 (상단 여백)
  gnbHeight: "56px",      // pt-[56px] 로 콘텐츠 오프셋

  // 그리드
  grid2: "grid grid-cols-1 sm:grid-cols-2 gap-6",
  grid3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  grid4: "grid grid-cols-2 md:grid-cols-4 gap-6",
} as const;


// ─── 버튼 (Buttons) ────────────────────────────────────────

export const buttons = {
  // 글로벌 공통: rounded-[6px], font-semibold/medium, inline-flex, gap-1.5, transition 150ms

  // Primary (파란 배경)
  primary: "btn-primary",
  // → bg-primary text-white hover:bg-primary-600 rounded-[6px] font-semibold

  // Outline (흰 배경 + 테두리)
  outline: "btn-outline",
  // → bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-[6px]

  // Ghost (투명 배경)
  ghost: "btn-ghost",
  // → bg-transparent text-slate-500 hover:bg-slate-50 rounded-[6px]

  // White (흰 배경 + 그림자)
  white: "btn-white",
  // → bg-white text-slate-800 hover:bg-slate-50 rounded-[6px] shadow-subtle

  // Accent (amber 배경)
  accent: "btn-accent",
  // → bg-accent text-white hover:bg-amber-600 rounded-[6px]

  // 사이즈
  sm: "btn-sm",   // px-3 py-1.5 text-sm
  md: "btn-md",   // px-4 py-2 text-sm
  lg: "btn-lg",   // px-6 py-3 text-base

  // Pulsating CTA — 특별 CTA에만 사용 (import { PulsatingButton })
  // → src/components/ui/pulsating-button.tsx
} as const;


// ─── 카드 (Cards) ──────────────────────────────────────────

export const cards = {
  // 기본 카드
  base: "rounded-xl border border-slate-200/80 bg-white shadow-sm",

  // 호버 효과 있는 카드
  interactive: "rounded-xl border border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-lg transition-all",

  // 카드 내부 패딩
  padding: "p-5 md:p-6",

  // FAQ 아코디언 카드
  faq: "rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
  faqAnswer: "border-l-2 border-blue-500/40 pl-4",  // 답변 왼쪽 악센트 라인
} as const;


// ─── 그림자 (Shadows) ──────────────────────────────────────

export const shadows = {
  subtle: "shadow-subtle",     // 거의 보이지 않는 그림자
  card: "shadow-card",         // 기본 카드 그림자 (= shadow-sm)
  elevated: "shadow-elevated", // 호버 시, 모달
  float: "shadow-float",       // 플로팅 요소
} as const;


// ─── 라운드 (Border Radius) ────────────────────────────────

export const radius = {
  xs: "rounded-xs",        // 4px
  sm: "rounded-sm",        // 6px — 버튼
  DEFAULT: "rounded",      // 10px
  lg: "rounded-lg",        // 14px — 카드
  xl: "rounded-xl",        // 20px — 큰 카드
  "2xl": "rounded-2xl",    // 24px — 모달, 큰 섹션
  full: "rounded-full",    // 필 태그, 아바타
} as const;


// ─── 애니메이션 (Animations) ───────────────────────────────

export const animations = {
  // BlurFade — 페이지 진입 시 블러+페이드 애니메이션
  // import { BlurFade } from "@/components/ui/blur-fade"
  // <BlurFade delay={0.1}> ... </BlurFade>
  blurFade: {
    component: "@/components/ui/blur-fade",
    defaultDelay: 0,
    defaultDuration: 0.4,
    defaultYOffset: 6,
  },

  // Framer Motion 호버
  cardHover: "whileHover={{ y: -6 }}",     // 카드 위로 살짝 뜨기
  cardHoverSubtle: "whileHover={{ y: -2 }}", // 카드 미세 호버

  // CSS 애니메이션
  marquee: "animate-marquee",              // 무한 스크롤
  glowPulse: "animate-glow-pulse",         // 버튼 발광
  lightSweep: "animate-light-sweep",       // 버튼 빛 훑기
} as const;


// ─── 공통 UI 컴포넌트 경로 ─────────────────────────────────

export const components = {
  BlurFade: "@/components/ui/blur-fade",
  PulsatingButton: "@/components/ui/pulsating-button",
  ShimmerButton: "@/components/ui/shimmer-button",
  BorderBeam: "@/components/ui/border-beam",
  Toast: "@/components/ui/Toast",
  ConfirmModal: "@/components/ui/ConfirmModal",
  SlidePanel: "@/components/ui/SlidePanel",
  AnimatedCheckbox: "@/components/ui/AnimatedCheckbox",
} as const;


// ─── 섹션 패턴 (복사해서 사용) ─────────────────────────────

export const sectionPatterns = {
  // Hero 섹션
  hero: `
    <section className="bg-slate-50 py-12 md:py-16 text-center">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-3">LABEL</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">제목</h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mt-4">설명</p>
      </div>
    </section>
  `,

  // 일반 섹션
  section: `
    <section className="py-12 md:py-16 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {children}
      </div>
    </section>
  `,

  // 배경색 교차 섹션
  sectionAlt: `
    <section className="bg-slate-50 py-16 md:py-24 px-5 md:px-8">
      <div className="mx-auto max-w-[1200px]">
        {children}
      </div>
    </section>
  `,

  // CTA 섹션
  cta: `
    <section className="py-16 md:py-20 px-5 md:px-8 text-center">
      <div className="mx-auto max-w-[600px]">
        <h2 className="text-xl md:text-2xl font-bold mb-3">제목</h2>
        <p className="text-slate-500 text-sm mb-8">설명</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/#contact" className="btn-primary btn-lg">무료 견적 요청하기</a>
          <a href="tel:02-6342-2800" className="btn-outline btn-lg">02-6342-2800</a>
        </div>
      </div>
    </section>
  `,

  // 카드 그리드 (3열)
  cardGrid: `
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-5 md:p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm hover:border-blue-200 hover:shadow-lg transition-all">
        <h3 className="text-lg font-bold mb-2">카드 제목</h3>
        <p className="text-slate-500 text-sm leading-relaxed">카드 설명</p>
      </div>
    </div>
  `,
} as const;
