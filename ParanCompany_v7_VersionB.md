# 파란컴퍼니 행사 서비스 마켓플레이스 — Version B (모던 원페이지)

> **문서 목적**: Next.js + Supabase + Tailwind CSS로 구현하기 위한 설계 명세서  
> **UI 스타일**: 모던 원페이지 — 풀스크린 히어로, 탭 탐색, Drawer 상세, 통합 견적 플로우  
> **기술 스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (DB/Auth/Storage)  
> **기준 해상도**: 1440px (데스크톱 퍼스트, 반응형 대비)  
> **최종 업데이트**: 2026-02-10 (v7)

---

## 목차

### 공통
1. [v6 → v7 변경 사항 요약](#1-v6--v7-변경-사항-요약)
2. [기술 스택 & 프로젝트 구조](#2-기술-스택--프로젝트-구조)
3. [사이트맵 & 유저 플로우](#3-사이트맵--유저-플로우)
4. [디자인 시스템](#4-디자인-시스템)
5. [글로벌 컴포넌트](#5-글로벌-컴포넌트)

### 프론트엔드 페이지
6. [P1 — 풀스크린 랜딩](#6-p1--풀스크린-랜딩)
7. [P2 — 서비스 탐색 (탭 기반)](#7-p2--서비스-탐색)
8. [P3 — 서비스 상세 (Drawer)](#8-p3--서비스-상세-drawer)
9. [P4 — 스텝 위저드 (통합형)](#9-p4--스텝-위저드)
10. [P5+P6 — 장바구니 + 견적 통합](#10-p5p6--장바구니--견적-통합)
11. [P7 — 견적 완료](#11-p7--견적-완료)
12. [P8 — 포트폴리오 (갤러리)](#12-p8--포트폴리오)

### 관리자
13. [관리자 페이지](#13-관리자-페이지)

### 데이터 & 구현
14. [Supabase DB 스키마](#14-supabase-db-스키마)
15. [구현 가이드](#15-구현-가이드)

---

## 1. v6 → v7 변경 사항 요약

### 1.1 버블 est1/est2 대화에서 반영된 수정사항

| # | 페이지 | 수정 내용 | 출처 |
|---|--------|----------|------|
| 1 | **서비스 탐색** | 카테고리 7개 (케이터링 추가) | est1 |
| 2 | **추가서비스** | 이미지 대신 이모지 사용, 3열 배치 | est2 |
| 3 | **추가서비스 카드** | Row 레이아웃: 이모지 + 서비스명·가격 + 플러스 아이콘 | est2 |
| 4 | **장바구니** | 패키지 아이템 포함 (파란 테두리 + 할인 뱃지) | est2 |
| 5 | **장바구니 요약** | 패키지 할인 Row + 할인 금액 -1,160,000원 (빨간색) | est2 |
| 6 | **장바구니** | 서비스명 "케이터" → "커피/다과" | est2 |
| 7 | **견적 폼** | 담당자 정보 먼저, 행사 유형 드롭다운 추가 | est2 |
| 8 | **견적 폼** | 2열 레이아웃 적용 | est2 |

### 1.2 Version A와의 차이

| 요소 | Version A (클래식) | Version B (모던) |
|------|-------------------|-----------------|
| 서비스 탐색 | 사이드바 아코디언 | **상단 탭 + 필터 Pill** |
| 서비스 상세 | 별도 페이지 (/service/[id]) | **우측 Drawer (슬라이드 패널)** |
| 행사 기획 | 2페이지 (P4a → P4b) | **한 페이지 스텝 위저드** |
| 장바구니+견적 | 2페이지 (P5 → P6) | **한 페이지 좌우 배치** |
| 전체 분위기 | 밝은 블루 + 화이트 쇼핑몰 | **다크 히어로 + SaaS 느낌** |
| 애니메이션 | 기본 hover/transition | **스크롤 애니메이션 + 페이드인** |
| 네비게이션 | GNB + 사이드바 | **GNB + Sticky 카테고리 탭** |

### 1.3 Bubble → Next.js 전환

| 항목 | Bubble (v6) | Next.js (v7) |
|------|-------------|--------------|
| 라우팅 | Page 단위 | App Router |
| 상태 관리 | Custom State | Zustand |
| 스타일링 | Bubble UI | Tailwind CSS |
| DB | Bubble Data | Supabase |
| 배포 | Bubble | Vercel |
| 아이콘 | Material Symbols | Lucide React |

---

## 2. 기술 스택 & 프로젝트 구조

### 2.1 기술 스택

```
프론트엔드: Next.js 14 (App Router) + TypeScript + Tailwind CSS
상태관리:   Zustand (장바구니, 필터, Drawer 등)
UI 라이브러리: Lucide React (아이콘), Framer Motion (애니메이션)
폰트:       Plus Jakarta Sans, Noto Sans KR, DM Sans (Google Fonts)
백엔드:     Supabase (PostgreSQL + Auth + Storage + Edge Functions)
배포:       Vercel
```

### 2.2 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃 (GNB + Footer)
│   ├── page.tsx                   # P1 풀스크린 랜딩
│   ├── services/
│   │   └── page.tsx               # P2 서비스 탐색 (탭 기반)
│   ├── build/
│   │   └── page.tsx               # P4 통합 스텝 위저드
│   ├── checkout/
│   │   ├── page.tsx               # P5+P6 장바구니 + 견적 통합
│   │   └── complete/page.tsx      # P7 견적 완료
│   ├── work/
│   │   └── page.tsx               # P8 포트폴리오 갤러리
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx               # PA1 대시보드
│       ├── services/page.tsx      # PA2
│       ├── packages/page.tsx      # PA3
│       ├── quotes/page.tsx        # PA4
│       ├── portfolio/page.tsx     # PA5
│       └── settings/page.tsx      # PA6
├── components/
│   ├── layout/
│   │   ├── GNB.tsx
│   │   ├── Footer.tsx
│   │   └── CategoryTabs.tsx       # 상단 카테고리 탭
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx             # 서비스 상세 Drawer
│   │   ├── SlidePanel.tsx         # 관리자 편집 패널
│   │   └── StepWizard.tsx         # 스텝 위저드
│   ├── cards/
│   │   ├── ServiceCard.tsx
│   │   ├── PackageCard.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartPackageItem.tsx
│   │   └── PortfolioCard.tsx
│   └── forms/
│       ├── QuoteForm.tsx
│       └── ServiceEditForm.tsx
├── stores/
│   ├── cartStore.ts
│   ├── catalogStore.ts
│   ├── drawerStore.ts             # Drawer 상태
│   └── adminStore.ts
├── lib/
│   ├── supabase.ts
│   ├── constants.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

---

## 3. 사이트맵 & 유저 플로우

```
/ (P1 풀스크린 랜딩)
├── [전체 행사 기획] → /build (통합 위저드) → /checkout
├── [서비스 둘러보기] → /services (탭 탐색) → Drawer(상세) → /checkout
├── /checkout (장바구니 + 견적 통합) → /checkout/complete
└── /work (포트폴리오)

/admin (관리자)
├── /admin (PA1 대시보드)
├── /admin/services (PA2)
├── /admin/packages (PA3)
├── /admin/quotes (PA4)
├── /admin/portfolio (PA5)
└── /admin/settings (PA6, admin만)
```

**2가지 진입 경로**
| 경로 | 설명 | 흐름 |
|------|------|------|
| 전체 행사 기획 | 한 페이지 위저드 | / → /build → /checkout → /checkout/complete |
| 개별 서비스 선택 | 탭 탐색 + Drawer | / → /services → Drawer → /checkout → /checkout/complete |

---

## 4. 디자인 시스템

### 4.1 Tailwind Config

```typescript
const config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE',
          400: '#60A5FA', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF',
        },
        accent: { DEFAULT: '#F59E0B', 50: '#FFFBEB', 100: '#FEF3C7' },
        success: { DEFAULT: '#10B981', 50: '#ECFDF5', 100: '#D1FAE5' },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Noto Sans KR', 'sans-serif'],
        body: ['Noto Sans KR', 'Plus Jakarta Sans', 'sans-serif'],
        num: ['DM Sans', 'Plus Jakarta Sans', 'sans-serif'],
      },
      maxWidth: { content: '1200px' },
      borderRadius: { sm: '8px', DEFAULT: '12px', lg: '20px', xl: '28px' },
    },
  },
};
```

### 4.2 타이포그래피

| 용도 | 사이즈 | Weight | Tailwind |
|------|--------|--------|----------|
| Hero 대제목 | 3.2rem | 800 | `text-[3.2rem] font-extrabold font-display` |
| 페이지 제목 | 1.8rem | 800 | `text-[1.8rem] font-extrabold` |
| 섹션 제목 | 1.5rem | 800 | `text-2xl font-extrabold` |
| 카드 제목 | 1.25rem | 700 | `text-xl font-bold` |
| 본문 | 0.88~0.92rem | 400~500 | `text-sm` |
| 가격 (대) | 2rem | 800 | `text-[2rem] font-extrabold font-num` |
| 통계 숫자 | 2.8rem | 700 | `text-[2.8rem] font-bold font-num` |

### 4.3 색상 팔레트 상세

#### Primary — Blue 계열
| 토큰 | HEX | 용도 |
|------|-----|------|
| `primary` | `#3B82F6` | 메인 버튼, 링크 |
| `primary-50` | `#EFF6FF` | hover 배경 |
| `primary-100` | `#DBEAFE` | 뱃지 배경 |
| `primary-200` | `#BFDBFE` | hover 테두리 |
| `primary-400` | `#60A5FA` | 그래디언트 끝점 |
| `primary-600` | `#2563EB` | 버튼 hover |
| `primary-700` | `#1D4ED8` | 그래디언트 시작점 |
| `primary-800` | `#1E40AF` | CTA 배경 |

#### Accent — Amber / Success — Green / Gray 스케일
Version A와 동일.

### 4.4 Version B 전용 스타일 차이

| 요소 | Version A | Version B |
|------|----------|----------|
| P1 Hero 배경 | bg-white | `bg-gradient-to-br from-gray-900 via-gray-800 to-primary-800` |
| GNB (P1) | bg-white border-b | `bg-transparent` → 스크롤 시 `bg-white/90 backdrop-blur` |
| 서비스 카드 호버 | shadow-md + translateY | `scale-[1.02] shadow-lg` |
| 페이지 전환 | 없음 | Framer Motion fade/slide |
| 스크롤 효과 | 없음 | Intersection Observer 페이드업 |
| 포트폴리오 그리드 | 3열 균등 | Masonry (핀터레스트) |

### 4.5 버튼 시스템

| 클래스 | 스타일 | 용도 |
|--------|------|------|
| `btn-primary` | bg-primary text-white → hover:bg-primary-600 | 메인 CTA |
| `btn-outline` | bg-transparent text-primary border-primary-200 → hover:bg-primary-50 | 보조 CTA |
| `btn-outline-white` | bg-transparent text-white border-white/30 → hover:bg-white/10 | 다크 배경용 |
| `btn-accent` | bg-accent text-white | 패키지 관련 |
| `btn-ghost` | bg-transparent text-gray-500 border-gray-200 | 취소/보조 |
| `btn-white` | bg-white text-primary → hover:bg-gray-50 | CTA 배너 내부 |

공통: `rounded-[10px] font-semibold inline-flex items-center gap-1.5 transition-all duration-150`

### 4.6 아이콘 시스템

```
Lucide React 사용

매핑:
- ShoppingCart, CheckCircle, ChevronDown, ChevronRight
- Home, Package, FileText, Search, X, Plus, Minus
- ArrowRight, ExternalLink, Phone, Mail, MapPin
- User, Calendar, Users, Building

카테고리 이모지 유지: 📋🎨🏗️🎬🎤🎪🍽️📦
```

---

## 5. 글로벌 컴포넌트

### 5.1 GNB

```
┌──────────────────────────────────────────────────────────────────────┐
│  [로고] 파란컴퍼니    서비스  포트폴리오  문의하기    📞 02-6342-2800  🛒(2)  [견적 요청]  │
└──────────────────────────────────────────────────────────────────────┘
```

- sticky top-0 z-50, h-[72px]
- **P1에서는 투명**: `bg-transparent text-white`
- 스크롤 60px 이상 시: `bg-white/90 backdrop-blur-md text-gray-900 border-b`
- 나머지 페이지: bg-white border-b (일반)
- 장바구니 뱃지: Zustand cartStore

### 5.2 Footer

- bg-gray-900 (Version A의 gray-800보다 약간 더 진하게)
- 흰색 로고 + 회사 정보 + 링크 + 저작권
- 구조는 Version A와 동일

---

## 6. P1 — 풀스크린 랜딩

### 6.1 Hero (100vh)

```
┌──────────────────────────────────────────────────────────────┐
│                        (GNB 투명)                            │
│                                                              │
│            교육이 즐거워질 때                                   │
│            직원의 성과는 올라갑니다                              │
│                                                              │
│       ✅ 1,200건 이상의 행사 성공 실적                          │
│                                                              │
│       [전체 행사 기획 →]    [서비스 둘러보기 →]                  │
│                                                              │
│            ↓ 스크롤                                           │
└──────────────────────────────────────────────────────────────┘
```

- `min-h-screen flex flex-col justify-center items-center text-center`
- 배경: `bg-gradient-to-br from-gray-900 via-gray-800 to-primary-800`
- 배경 장식: subtle 그리드 패턴 (`bg-[url('/grid.svg')] opacity-5`)
- 대제목: text-white, font-display, text-[3.2rem], font-extrabold
- "올라갑니다": `text-primary-400` (밝은 블루 강조)
- 뱃지: bg-white/10 border border-white/20 text-white/80 text-sm
- 버튼: btn-primary btn-lg + btn-outline-white btn-lg
- 하단 화살표: `animate-bounce text-white/40`

### 6.2 인기 서비스 프리뷰

- bg-white, py-20
- 섹션 제목: "인기 서비스" + 부제
- 가로 스크롤 카드: `overflow-x-auto snap-x snap-mandatory flex gap-5 pb-4`
- 각 카드: `min-w-[260px] snap-start`, bg-gray-50, rounded-lg, p-6
  - 이모지 3rem + 서비스명 font-bold + 가격 font-num text-gray-500
  - hover: bg-primary-50 border-primary-200
- Intersection Observer: 뷰포트 진입 시 `opacity-0 translate-y-8 → opacity-100 translate-y-0`

### 6.3 패키지 섹션

- bg-gray-50, py-20
- 3열 그리드, gap-6
- 각 카드: bg-white, border, rounded-lg, p-6
  - 이모지 2rem + 패키지명 font-bold + 할인율 뱃지 (accent)
  - 포함 서비스: hover 시 높이 확장 (max-h-0 → max-h-[200px] transition)
  - 원가 취소선 + 할인가 font-num text-xl font-bold text-primary
  - [패키지 시작하기 →] 버튼

### 6.4 통계 섹션

- bg-white, py-16
- 4열 inline, 가운데 정렬
- 카운트업 애니메이션 (0 → 목표값)
  - Intersection Observer 트리거
  - `requestAnimationFrame` 또는 framer-motion `useMotionValue`

| 숫자 | 단위 | 라벨 |
|------|------|------|
| 1,200 | — | 누적 행사 건수 |
| 10,000 | + | 파트너 업체 |
| 4.9 | /5 | 평균 만족도 |
| 98 | % | 재계약률 |

### 6.5 CTA

- bg-gradient-to-r from-primary-700 via-primary to-primary-400
- rounded-lg, p-12, text-center
- text-white + btn-white btn-lg "무료 견적 받기"

---

## 7. P2 — 서비스 탐색 (탭 기반)

### 7.1 레이아웃

```
[GNB]
[Sticky 카테고리 탭 바]
[필터/정렬 바]
[서비스 그리드 3열]
```

### 7.2 카테고리 탭 바

```
[전체] [기획서 제작] [시안물 제작] [전시부스] [영상/음향] [MC/진행] [이벤트 연출] [케이터링] | [📦 패키지]
```

- `sticky top-[72px] z-40`, bg-white, border-b, py-3
- max-w-content mx-auto, `flex gap-2 overflow-x-auto`
- 탭: `px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap`
- 활성: `bg-primary text-white`
- 비활성: `bg-gray-100 text-gray-600 hover:bg-gray-200`
- 📦 패키지: `bg-accent-50 text-amber-800 border border-accent`

카테고리 7개:
| 키 | 이름 | 서비스 수 |
|----|------|----------|
| planning | 기획서 제작 | 6종 |
| design | 시안물 제작 | 5종 |
| booth | 전시부스 | 4종 |
| av | 영상/음향 | 6종 |
| mc | MC/진행 | 4종 |
| event | 이벤트 연출 | 5종 |
| catering | 케이터링 | 4종 |

### 7.3 필터/정렬 바

```
[🔍 서비스 검색...]    [정렬: 추천순 ▾]    [가격대: 전체 ▾]
```

- max-w-content mx-auto, py-4, flex justify-between
- 검색: w-[300px], rounded-full, bg-gray-50, pl-10 (Search 아이콘)

### 7.4 서비스 카드

```
┌────────────────────────────────┐
│                                │
│     [이모지 원형 80×80]         │  bg-gradient-to-br from-primary-50 to-primary-100
│                                │
│  🔥 인기       기획서 제작       │  뱃지 + 카테고리 text-xs
│  컨퍼런스 기획서                 │  text-lg font-bold
│  행사 기획안 + 운영 매뉴얼       │  text-sm text-gray-500, line-clamp-2
│                                │
│  1,500,000원~        [+ 담기]  │  font-num font-bold + 아이콘 버튼
└────────────────────────────────┘
```

- bg-white, border, rounded-lg, p-6, cursor-pointer
- hover: `scale-[1.02] shadow-lg transition-all duration-200`
- **카드 영역 클릭 → Drawer 열림** (drawerStore.open(serviceId))
- **[+ 담기] 클릭 → e.stopPropagation() + 장바구니 추가 + Toast**
- 3열 그리드, gap-5

### 7.5 패키지 뷰 (📦 탭 선택 시)

- 3열 카드 그리드
- bg-accent-50, border-2 border-accent, rounded-lg, p-6
- 포함 서비스: pill 태그 (bg-white rounded-full text-xs)
- 가격: 원가(line-through text-gray-400) + 할인가(font-num text-xl font-bold)
- [패키지 담기] btn-accent

---

## 8. P3 — 서비스 상세 (Drawer)

### 8.1 Drawer 구조

```
┌───────────────────────────────┐
│  ← 닫기        서비스 상세     │  h-14, border-b, flex items-center justify-between
├───────────────────────────────┤
│                               │
│  [히어로] h-[200px]           │  bg-gradient, 이모지 5rem 가운데
│                               │
│  [카테고리 뱃지] [인기 뱃지]    │  flex gap-2, mt-5
│  컨퍼런스 기획서                │  text-xl font-bold mt-2
│  행사 기획안 + 운영 매뉴얼...   │  text-sm text-gray-500 mt-2
│                               │
│  ── 포함 사항 ──              │  mt-6
│  ✅ 라인어레이 스피커           │
│     200W급 전문 스피커 시스템   │
│  ✅ 전문 엔지니어              │
│  ✅ 설치·철거                  │
│  ✅ 리허설 지원                │
│                               │
│  ── 진행 프로세스 ──           │  mt-6
│  ① 요구사항 확인               │  세로 타임라인
│  ② 현장 답사                   │
│  ③ 장비 설치                   │
│  ④ 리허설                     │
│  ⑤ 행사 운영                   │
│                               │
│  ── 함께 많이 선택하는 서비스 ── │  mt-6
│  [미니카드 3개 가로 스크롤]      │
│                               │
├───────────────────────────────┤  sticky bottom-0
│  ── 옵션 선택 ──              │
│  [규모: 소형 ▾]               │  select
│  [추가옵션: 없음 ▾]            │  select
│  [수량: − 1 +]                │
│  ──────────────────────────── │
│  합계  1,500,000원            │  font-num text-xl font-bold text-primary
│  [장바구니 담기] [바로 견적]    │  2개 버튼 가로 배치
└───────────────────────────────┘
```

### 8.2 Drawer CSS/동작

- `fixed right-0 top-0 h-full w-[480px] z-50`
- bg-white, shadow-2xl, border-l
- 본문: overflow-y-auto, px-6
- 하단 영역: sticky bottom-0, bg-white, border-t, py-4 px-6, shadow-[0_-4px_12px_rgba(0,0,0,0.05)]
- 오버레이: `fixed inset-0 bg-black/20 z-40`, 클릭 시 닫힘
- 애니메이션 (Framer Motion):
  ```
  오버레이: opacity 0 → 1
  패널: x '100%' → 0, transition duration 0.25s ease-out
  ```
- ESC 키 닫기, 뒤로가기 시 닫기

### 8.3 Drawer Store

```typescript
interface DrawerStore {
  isOpen: boolean;
  serviceId: string | null;
  open: (id: string) => void;
  close: () => void;
}
```

---

## 9. P4 — 스텝 위저드 (통합형)

### 9.1 P4a + P4b를 한 페이지에 통합

```
[GNB]
[프로그레스 바]  ① 행사 유형 ─── ② 구성 방법 ─── ③ 서비스 선택 ─── ④ 확인
[콘텐츠 영역]
[하단 네비게이션 버튼]
```

### 9.2 프로그레스 바

- max-w-[720px] mx-auto, py-8
- 선형 바: h-1 bg-gray-200 rounded-full, 현재까지 bg-primary (width transition)
- 스텝 라벨: flex justify-between
  - 활성: text-primary font-semibold
  - 완료: text-success
  - 비활성: text-gray-400

### 9.3 스텝별 내용

**① 행사 유형** (max-w-[960px])

3열 카드 그리드:

| 유형 | 이모지 | 설명 |
|------|--------|------|
| 컨퍼런스 | 🏛️ | 대규모 학술·정책 발표 행사 |
| 포럼/심포지엄 | 🎓 | 전문가 토론·발표 중심 |
| 세미나/교육 | 📚 | 강연·연수·워크숍 |
| 축제/문화행사 | 🎭 | 공연·전시·체험 |
| 기업행사 | 🏢 | 팀빌딩·송년회·시상식 |
| 기타 | 🤝 | 직접 구성하기 |

카드: h-[200px], bg-gray-50, border-2 border-gray-200, rounded-lg
선택 시: bg-primary-50 border-primary, 우상단 체크마크 (bg-primary rounded-full w-6 h-6)

**② 구성 방법** (2열)

| 방법 | 배경 | 선택 시 |
|------|------|--------|
| 📦 추천 패키지 | bg-accent-50, [추천] 뱃지 | border-accent |
| ✏️ 직접 구성 | bg-gray-50 | border-primary |

**③ 서비스 선택** (P4b 통합)

- 패키지 요약 카드: bg-accent-50, border-2 border-accent, rounded-lg
  - 포함 서비스 목록: CheckCircle + 서비스명 + 가격 + 삭제(×)
- 규모 슬라이더: input[type=range] accent-primary
- 추가 서비스 3열 (⚠️ 수정 반영):
  ```
  ├── [📸 행사 촬영 | 800,000원~] [+]
  ├── [🎬 영상 편집 | 600,000원~] [+]
  ├── [📷 포토존 제작 | 1,200,000원~] [+]
  ├── [☕ 커피/다과 | 500,000원~] [+]
  ├── [📊 결과보고서 | 600,000원~] [+]
  └── [🌐 통역사 섭외 | 600,000원~] [+]
  ```
  카드: bg-white border rounded-xl px-4 py-3.5 flex justify-between

**④ 최종 확인**

- 선택 내역 요약 (행사 유형 + 패키지 + 추가 서비스)
- 합계 표시
- [장바구니 담기] → /checkout 이동

### 9.4 스텝 전환 애니메이션

```typescript
// Framer Motion AnimatePresence
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {stepContent}
  </motion.div>
</AnimatePresence>
```

### 9.5 하단 네비게이션

- fixed bottom-0 또는 sticky, bg-white, border-t, py-4
- [← 이전] btn-ghost (스텝 1에서는 숨김)
- [다음 →] btn-primary (마지막 스텝에서는 "장바구니 담기")

---

## 10. P5+P6 — 장바구니 + 견적 통합

### 10.1 레이아웃 (한 페이지 좌우 배치)

```
┌─────────────────────────────────┬──────────────────────────────┐
│    장바구니 (왼쪽, 55%)          │    견적 정보 (오른쪽, 45%)    │
│    overflow-y-auto              │    overflow-y-auto           │
│                                │                              │
│  [패키지 카드]                  │  ── 👤 담당자 정보 ──        │
│    📦 컨퍼런스 올인원            │  [이름 *] [소속 *]           │
│    [패키지] [20% 할인]          │  [연락처 *] [이메일 *]       │
│    5,800,000원                  │  [부서]                     │
│                                │                              │
│  [개별 서비스]                   │  ── 📅 행사 정보 ──         │
│    📸 행사 촬영  800,000원       │  [행사명 *]                 │
│    ☕ 커피/다과   500,000원      │  [행사일 *] [인원 *]        │
│                                │  [유형] [장소]               │
│  ── 요약 ──                    │  [추가 요청사항]              │
│  서비스 소계     7,100,000원    │                              │
│  패키지 할인    -1,160,000원    │  ☐ 개인정보 동의             │
│  ──────────────────            │                              │
│  합계          5,940,000원     │  [견적 요청하기]              │
│                                │                              │
│  [서비스 더 추가하기]            │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

### 10.2 왼쪽 — 장바구니

**패키지 아이템** (⚠️ 수정 반영)
- `bg-primary-50 border-2 border-primary rounded-xl p-5`
- 뱃지 2개: [패키지] bg-primary-100 text-primary-700 + [20% 할인] bg-accent-100 text-amber-800
- 서비스명: "컨퍼런스 올인원 패키지", text-lg font-bold
- 부가: "300명 규모 · 6개 서비스 포함", text-xs text-gray-500
- "▼ 포함 서비스 보기" 토글: text-xs text-primary font-medium
- 수량 컨트롤 + 가격: font-num text-lg font-bold

**개별 서비스 카드**
- bg-white border rounded-xl p-5
- 이모지 + 카테고리 라벨 + 서비스명 + 수량 + 가격 + 삭제(×)

| 이모지 | 카테고리 | 서비스명 | 가격 |
|--------|---------|---------|------|
| 📸 | 영상/음향 | 행사 촬영 | 800,000원 |
| ☕ | 케이터링 | **커피/다과** | 500,000원 |

**요약 영역**
```
서비스 소계              7,100,000원    text-sm
패키지 할인 (20%)       -1,160,000원    text-sm text-red-500 font-semibold
────────────────────────────────────    border-t
합계                    5,940,000원    font-num text-2xl font-extrabold text-primary
```

[서비스 더 추가하기] → /services로 이동

### 10.3 오른쪽 — 견적 폼 (⚠️ 수정 반영)

카드 스타일: bg-white rounded-lg border p-6

**담당자 정보** (먼저)
```
👤 담당자 정보        (User 아이콘 + 제목)
┌────────────┬────────────┐
│ 담당자 성함 * │ 기관/회사명 * │    2열
├────────────┼────────────┤
│ 연락처 *     │ 이메일 *     │    2열
├────────────┴────────────┤
│ 부서                     │    1열
└──────────────────────────┘
```

**행사 정보** (두 번째)
```
📅 행사 기본 정보      (Calendar 아이콘 + 제목)
┌──────────────────────────┐
│ 행사명 *                  │    1열
├────────────┬─────────────┤
│ 행사일 *    │ 예상 인원 *  │    2열
├────────────┼─────────────┤
│ 행사 유형   │ 행사 장소    │    2열 (⚠️ 유형 신규)
├────────────┴─────────────┤
│ 추가 요청사항             │    textarea
└──────────────────────────┘
```

행사 유형 드롭다운: 컨퍼런스/세미나, 기업 행사, 학술대회, 문화/축제
예상 인원 드롭다운: 50명 이하, 50~100명, 100~300명, 300~500명, 500명 이상

**개인정보 동의 + 제출**
- bg-gray-50 rounded-sm p-4
- 체크박스 + "개인정보 수집·이용에 동의합니다" + 상세보기 링크
- [견적 요청하기] btn-primary 풀너비, FileText 아이콘
- 하단: "평균 1시간 이내 견적 회신", text-xs text-gray-400

### 10.4 모바일 대응

- `lg:flex-row flex-col` (1024px 이하에서 세로 스택)
- 768px 이하: 탭 전환 UI ([장바구니] [정보 입력])

---

## 11. P7 — 견적 완료

```
[성공 아이콘 120×120] — bg-success-50 rounded-full, CheckCircle 애니메이션
[견적 요청이 완료되었습니다!] — text-2xl font-extrabold mt-6
[견적번호: QT-20250204-001] — bg-primary-50 border-primary-200 rounded-xl inline-flex
[요약 정보 카드] — bg-white border rounded-lg
[세로 타임라인]
  ● 견적접수 — 활성 (bg-primary, shadow ring)
  ○ 검토중
  ○ 견적발송
  ○ 계약체결
  ○ 행사준비
[홈으로 돌아가기] btn-primary btn-lg
[포트폴리오 보기] btn-outline
```

- 성공 아이콘: SVG 체크마크 drawpath 애니메이션 또는 Framer Motion
- 컨페티 효과 (선택): `canvas-confetti` 라이브러리
- 타임라인: **세로** (Version A는 가로, Version B는 세로로 모바일 친화적)

---

## 12. P8 — 포트폴리오 (갤러리)

### 12.1 레이아웃

```
[GNB]
[Dark Hero] — bg-gray-900, py-16
[필터 드롭다운 + 검색]
[Masonry 그리드]
[CTA]
[Footer]
```

### 12.2 Dark Hero

- bg-gray-900, text-center
- "포트폴리오" text-3xl font-extrabold text-white
- 부제: text-gray-400
- 통계 3개: font-num text-2xl font-bold text-primary-400

### 12.3 필터

```
[유형: 전체 ▾]  [연도: 전체 ▾]  [🔍 검색...]
```

- max-w-content mx-auto, py-6
- 드롭다운: rounded-lg border bg-white

### 12.4 Masonry 그리드 (핀터레스트 스타일)

- `columns-3 gap-6` (CSS multi-column) 또는 `react-masonry-css`
- 각 카드: `break-inside-avoid mb-6`
- 카드 높이: 콘텐츠에 따라 자연스럽게 (200~350px)

카드 구조:
```
┌──────────────────┐
│                  │
│  (그래디언트 BG)  │  h-[200~300px], 카테고리별 gradient
│                  │
│  ═══ hover ═══   │  bg-black/40 overlay + text slide-up
│  🏛️ 컨퍼런스     │  뱃지
│  2025 교육 컨퍼런스│  제목
│  📍 소노캄 고양   │  장소
│  #기획 #음향 #MC │  태그
└──────────────────┘
```

- 기본: 이모지 + 유형 뱃지만 보임
- hover: `group-hover:opacity-100` 오버레이 + 텍스트 올라옴
- 클릭 → 상세 모달

그래디언트 (카테고리별):
| 유형 | 그래디언트 |
|------|----------|
| 컨퍼런스 | from-primary-100 to-primary-200 |
| 세미나 | from-success-100 to-success-200 |
| 기업행사 | from-accent-100 to-yellow-200 |
| 축제 | from-pink-100 to-pink-200 |
| 워크숍 | from-indigo-100 to-indigo-200 |

### 12.5 상세 모달 (카드 클릭)

- max-w-[640px], rounded-2xl, p-8
- 큰 썸네일 + 행사 정보 + 서비스 태그 pill
- 오버레이: bg-black/30, 클릭 닫기

### 12.6 CTA

- bg-gradient-to-r from-primary to-primary-700, rounded-lg, p-12
- text-white + [무료 견적 시작하기] btn-white btn-lg

---

## 13. 관리자 페이지

### 13.1 Shell 레이아웃

```
┌──────────┬──────────────────────────────────────────────────┐
│  SIDE    │  TOPBAR (56px)                                   │
│  NAV     │  [페이지명]              [👤 김미경 · admin]       │
│  220px   ├──────────────────────────────────────────────────┤
│  fixed   │              MAIN CONTENT                        │
│          │              bg-gray-50, p-8                     │
│  [메뉴]  │              ml-[220px]                           │
└──────────┴──────────────────────────────────────────────────┘
```

### 13.2 사이드 내비

```
[로고] 파란컴퍼니 관리자
📊 대시보드
📋 서비스 관리
📦 패키지 관리
💼 견적 관리 (3)    ← 미처리 건수 뱃지
🏆 포트폴리오
─────────────
⚙️ 사이트 문구      ← admin만
─────────────
↗ 사이트 보기       ← 새 탭 (ExternalLink 아이콘)
```

- w-[220px], h-screen, fixed, bg-white, border-r
- 활성: bg-primary-50 text-primary font-semibold, border-l-[3px] border-primary
- hover: bg-gray-50

### 13.3 각 탭

| 탭 | 라우트 | 기능 | 접근 |
|----|--------|------|------|
| PA1 대시보드 | `/admin` | 요약 카드 4개 + 최근 견적 5건 + 바로가기 3개 | admin, editor |
| PA2 서비스 | `/admin/services` | 카테고리별 접기/펼치기 + 검색 + 편집 SlidePanel (480px) | admin, editor |
| PA3 패키지 | `/admin/packages` | 패키지 카드 + 편집(포함 서비스, 할인율 자동 계산) | admin, editor |
| PA4 견적 | `/admin/quotes` | 테이블 + 상태 인라인 드롭다운 + 상세 패널 + 내부 메모 | admin, editor |
| PA5 포트폴리오 | `/admin/portfolio` | 카드 + 편집(태그, 그래디언트) | admin, editor |
| PA6 사이트 문구 | `/admin/settings` | 그룹별 폼 + 하단 저장 바 | **admin만** |

### 13.4 PA2 서비스 편집 SlidePanel

```
[← 서비스 편집]                    [저장]

── 기본 정보 ──
서비스명 *          💡 카탈로그 카드 제목에 표시
이모지 *            💡 썸네일 아이콘
기본 가격 *         💡 가격 표시
설명 *              💡 카드 설명
인기 서비스 [토글]   💡 🔥 인기 뱃지
공개 여부 [토글]     💡 OFF 시 숨김

── 상세 페이지 ──
포함 사항 [+추가/-삭제]   💡 2×2 그리드
진행 프로세스 5단계       💡 5단계 표시
규모별 가격 (소/중/대)   💡 규모 선택
추가 옵션 [+추가/-삭제]  💡 옵션 선택

          [취소]           [저장]
```

### 13.5 PA4 견적 상태 뱃지

| 상태 | 색상 |
|------|------|
| 접수 | bg-primary-100 text-primary-700 |
| 검토중 | bg-accent-100 text-amber-800 |
| 견적발송 | bg-success-100 text-green-800 |
| 계약체결 | bg-primary text-white |
| 행사준비 | bg-gray-900 text-white |

### 13.6 공통 UI

- **SlidePanel**: w-[480px], fixed right-0 top-0 h-full, bg-white, shadow-xl, translateX 애니메이션
- **Toast**: fixed top-[90px] right-6, bg-gray-900 text-white, rounded-xl, 2초 자동 사라짐
- **삭제 Modal**: max-w-[400px], rounded-2xl, 삭제 버튼 bg-red-500
- **저장 바 (PA6)**: fixed bottom-0, bg-white, border-t, shadow-lg, [되돌리기] + [저장]

---

## 14. Supabase DB 스키마

```sql
-- 서비스 카테고리
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,        -- 'planning', 'design', ..., 'catering'
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 서비스
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT,
  base_price INT NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',      -- [{title, description, icon}]
  process_steps JSONB DEFAULT '[]', -- [{name, icon}]
  size_prices JSONB DEFAULT '{}',   -- {small: 1500000, medium: 2200000, large: 3000000}
  options JSONB DEFAULT '[]',       -- [{name, price}]
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 패키지
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  event_type TEXT,
  discount_rate INT DEFAULT 0,
  included_services UUID[],
  original_price INT,
  discount_price INT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 견적 요청
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT UNIQUE NOT NULL, -- 'QT-YYYYMMDD-NNN'
  contact_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_venue TEXT,
  event_type TEXT,                    -- ⚠️ 신규
  attendees TEXT,
  memo TEXT,
  cart_items JSONB NOT NULL,
  total_amount INT NOT NULL,
  discount_amount INT DEFAULT 0,
  status TEXT DEFAULT '접수',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 관리자 내부 메모
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id),
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 포트폴리오
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_type TEXT,
  year INT,
  venue TEXT,
  emoji TEXT,
  tags TEXT[],
  gradient_type TEXT,
  is_visible BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 사이트 설정 (PA6)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  group_name TEXT
);
```

### RLS

```sql
-- 공개 읽기
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read visible" ON services FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read visible" ON packages FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read visible" ON portfolios FOR SELECT USING (is_visible = true);
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);

-- 견적: 누구나 생성, 관리자만 조회/수정
CREATE POLICY "Anyone insert" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read" ON quotes FOR SELECT USING (auth.jwt()->>'role' IN ('admin', 'editor'));

-- 관리자 전체 권한
CREATE POLICY "Admin all" ON services FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'editor'));
CREATE POLICY "Admin all" ON packages FOR ALL USING (auth.jwt()->>'role' IN ('admin', 'editor'));
```

---

## 15. 구현 가이드

### 15.1 개발 순서

```
Phase 1: 기본 세팅
├── Next.js 프로젝트 + Tailwind + Supabase 연결
├── 글로벌 레이아웃 (GNB 투명/불투명 전환 + Footer)
└── Framer Motion 설정

Phase 2: 프론트엔드 페이지
├── P1 풀스크린 랜딩 (스크롤 애니메이션, 카운트업)
├── P2 서비스 탐색 (탭 + 카드 그리드)
├── P3 Drawer 컴포넌트 (Framer Motion)
├── P4 스텝 위저드 (AnimatePresence)
├── P5+P6 통합 체크아웃
├── P7 완료 (체크 애니메이션)
└── P8 포트폴리오 (Masonry + 모달)

Phase 3: Supabase 연동
├── DB 스키마 (Migration)
├── 데이터 시딩
├── API 라우트
└── Auth

Phase 4: 관리자
├── Admin Shell → PA1~PA6

Phase 5: 배포
├── Vercel + 도메인
```

### 15.2 핵심 상태 관리 (Zustand)

```typescript
// stores/cartStore.ts
interface CartItem {
  id: string;
  type: 'service' | 'package';
  name: string;
  emoji: string;
  category?: string;
  price: number;
  quantity: number;
  options?: { size?: string; addon?: string };
  includedServices?: string[];
  discountRate?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  clearCart: () => void;
}

// stores/drawerStore.ts
interface DrawerStore {
  isOpen: boolean;
  serviceId: string | null;
  open: (id: string) => void;
  close: () => void;
}
```

### 15.3 Version B 핵심 라이브러리

```json
{
  "dependencies": {
    "framer-motion": "^11.x",
    "lucide-react": "^0.300",
    "zustand": "^4.x",
    "react-masonry-css": "^1.x",
    "canvas-confetti": "^1.x"
  }
}
```

### 15.4 CLAUDE.md 참고

```markdown
## 프로젝트 규칙
- Next.js 14 App Router 사용
- TypeScript 필수
- Tailwind CSS로만 스타일링
- 한글 UI, 가격은 원화 (toLocaleString('ko-KR'))
- Supabase 클라이언트는 lib/supabase.ts
- 아이콘은 Lucide React
- 애니메이션은 Framer Motion
- 서비스 상세는 Drawer (별도 페이지 없음)
- 장바구니+견적은 /checkout 한 페이지

## 디자인 토큰
- Primary: #3B82F6
- Accent: #F59E0B
- 기본 폰트: Noto Sans KR
- 숫자 폰트: DM Sans
- max-width: 1200px
- 카드 radius: 12px (기본), 20px (큰 카드)
- P1 GNB: 투명 → 스크롤 시 백색
```

---

## 부록: 회사 정보

| 항목 | 내용 |
|------|------|
| 상호명 | 파란컴퍼니 |
| 영문 | Paran Company |
| 대표 | 김미경 |
| 전화 | 02-6342-2800 |
| 팩스 | 0504-482-1305 |
| 이메일 | paran@parancompany.co.kr |
| 주소 | 수원시 팔달구 효원로 278, 6층 603호 |
| 사업자등록번호 | 291-86-02802 |

---

*문서 끝 — 파란컴퍼니 v7 Version B (모던 원페이지) + 관리자 + DB*
