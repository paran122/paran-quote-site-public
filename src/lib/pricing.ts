/**
 * 통합 가격 데이터
 * - /guide/pricing (가이드 가격표)
 * - 랜딩 EstimateSection (견적 시뮬레이터)
 * 두 곳에서 공통으로 사용합니다. 가격 수정 시 이 파일만 변경하세요.
 */

/* ── 항목별 단가 (만원 단위) ── */

export interface PriceEntry {
  name: string;
  /** 만원 단위 가격 (예: 500 = 500만원) */
  price: number;
  unit: string;
  note: string;
}

/** 기획·운영 */
export const PLANNING_PRICES: PriceEntry[] = [
  { name: "기획·운영 (세미나·컨퍼런스)", price: 500, unit: "식", note: "기획안, 운영 매뉴얼, 타임테이블, 예산안, 현장 운영 포함" },
  { name: "기획·운영 (포럼)", price: 700, unit: "식", note: "패널 토론 구성, 통역 연계, 현장 운영 포함" },
  { name: "결과보고서", price: 150, unit: "건", note: "행사 성과 분석 및 결과 보고서 작성" },
];

/** 디자인·시안물 */
export const DESIGN_PRICES: PriceEntry[] = [
  { name: "포스터", price: 50, unit: "종", note: "웹용·인쇄용 동시 제작" },
  { name: "메인 현수막", price: 20, unit: "개", note: "디자인 시안 제공, 출력·설치 포함" },
  { name: "배너·엑스배너", price: 15, unit: "개", note: "디자인 시안 제공" },
  { name: "자료집·리플렛", price: 100, unit: "건", note: "편집 디자인 + 인쇄·제본" },
  { name: "참가자 키트", price: 5, unit: "세트", note: "명찰, 자료, 기념품 등 1세트 기준" },
];

/** 영상·촬영 */
export const MEDIA_PRICES: PriceEntry[] = [
  { name: "영상 촬영", price: 200, unit: "건", note: "현장 촬영 + 하이라이트 편집 영상" },
  { name: "하이브리드 중계", price: 300, unit: "건", note: "온·오프라인 동시 생중계" },
];

/** 특수 서비스 */
export const SPECIAL_PRICES: PriceEntry[] = [
  { name: "연사 섭외", price: 200, unit: "명", note: "전문 연사 매칭 및 섭외 대행" },
  { name: "통역 서비스", price: 200, unit: "건", note: "동시통역 장비 + 통역사" },
  { name: "공간 디자인", price: 800, unit: "식", note: "축제·페스티벌 공간 연출" },
  { name: "무대 설치", price: 500, unit: "식", note: "무대 구조물 설치·철거" },
  { name: "체험부스", price: 100, unit: "개", note: "참여형 체험 부스 1개 기준" },
  { name: "안전관리", price: 500, unit: "식", note: "안전요원 배치 및 안전 관리 계획" },
];

/** 편집 디자인 (단품) */
export const EDITORIAL_PRICES: PriceEntry[] = [
  { name: "컨셉 기획", price: 50, unit: "건", note: "편집 방향 및 컨셉 설계" },
  { name: "편집 디자인", price: 100, unit: "건", note: "레이아웃 + 디자인 작업" },
  { name: "인포그래픽", price: 50, unit: "건", note: "데이터 시각화 디자인" },
  { name: "인쇄·제본", price: 50, unit: "건", note: "출력 및 제본 납품" },
  { name: "PDF 납품", price: 10, unit: "건", note: "디지털 파일 납품" },
];

/* ── 가이드 페이지용: 카테고리별 묶음 ── */

export interface PriceCategory {
  title: string;
  items: PriceEntry[];
}

export const PRICE_CATEGORIES: PriceCategory[] = [
  { title: "기획·운영", items: PLANNING_PRICES },
  { title: "디자인·시안물", items: DESIGN_PRICES },
  { title: "영상·촬영", items: MEDIA_PRICES },
  { title: "특수 서비스", items: SPECIAL_PRICES },
];

/* ── 규모별 패키지 예시 ── */

export interface PackageExample {
  title: string;
  scale: string;
  range: string;
  includes: string[];
}

export const PACKAGE_EXAMPLES: PackageExample[] = [
  {
    title: "소규모 세미나",
    scale: "30~50명",
    range: "700만 원~",
    includes: ["기획·운영", "포스터", "현수막·배너", "참가자 키트", "결과보고서"],
  },
  {
    title: "중규모 컨퍼런스",
    scale: "100~200명",
    range: "1,500만 원~",
    includes: ["기획·운영", "포스터", "현수막·배너", "참가자 키트", "자료집", "영상 촬영", "연사 섭외", "결과보고서"],
  },
  {
    title: "대규모 포럼·국제행사",
    scale: "300~500명",
    range: "2,000만 원~",
    includes: ["기획·운영", "포스터", "현수막·배너", "참가자 키트", "자료집", "영상 촬영", "연사 섭외", "통역 서비스", "하이브리드 중계", "결과보고서"],
  },
];

/* ── 견적 시뮬레이터용: 행사 유형별 항목 ── */

export interface EstimateEventType {
  id: string;
  name: string;
  desc: string;
  items: { name: string; price: number; unit: string; default?: boolean }[];
}

/** 이름으로 단가를 찾는 헬퍼 */
function p(entries: PriceEntry[], name: string): number {
  return entries.find((e) => e.name === name)?.price ?? 0;
}

export const ESTIMATE_EVENT_TYPES: EstimateEventType[] = [
  {
    id: "seminar",
    name: "세미나·컨퍼런스",
    desc: "전문 발표와 네트워킹 중심의 행사",
    items: [
      { name: "기획·운영", price: p(PLANNING_PRICES, "기획·운영 (세미나·컨퍼런스)"), unit: "식", default: true },
      { name: "포스터", price: p(DESIGN_PRICES, "포스터"), unit: "종" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "참가자 키트", price: p(DESIGN_PRICES, "참가자 키트"), unit: "세트" },
      { name: "연사 섭외", price: p(SPECIAL_PRICES, "연사 섭외"), unit: "명" },
      { name: "영상 촬영", price: p(MEDIA_PRICES, "영상 촬영"), unit: "건" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건", default: true },
    ],
  },
  {
    id: "forum",
    name: "포럼",
    desc: "토론·패널 중심의 전문가 회의",
    items: [
      { name: "기획·운영", price: p(PLANNING_PRICES, "기획·운영 (포럼)"), unit: "식", default: true },
      { name: "포스터", price: p(DESIGN_PRICES, "포스터"), unit: "종" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "통역 서비스", price: p(SPECIAL_PRICES, "통역 서비스"), unit: "건" },
      { name: "하이브리드 중계", price: p(MEDIA_PRICES, "하이브리드 중계"), unit: "건" },
      { name: "영상 촬영", price: p(MEDIA_PRICES, "영상 촬영"), unit: "건" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건", default: true },
    ],
  },
  {
    id: "festival",
    name: "축제·페스티벌",
    desc: "대중 참여형 문화·체험 행사",
    items: [
      { name: "기획·운영", price: 1500, unit: "식", default: true },
      { name: "공간 디자인", price: p(SPECIAL_PRICES, "공간 디자인"), unit: "식", default: true },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "체험부스", price: p(SPECIAL_PRICES, "체험부스"), unit: "개" },
      { name: "무대 설치", price: p(SPECIAL_PRICES, "무대 설치"), unit: "식" },
      { name: "안전관리", price: p(SPECIAL_PRICES, "안전관리"), unit: "식", default: true },
      { name: "영상 촬영", price: 300, unit: "건" },
    ],
  },
  {
    id: "editorial",
    name: "편집 디자인",
    desc: "인쇄물·리플렛·보고서 등 편집 디자인",
    items: [
      { name: "컨셉 기획", price: p(EDITORIAL_PRICES, "컨셉 기획"), unit: "건", default: true },
      { name: "편집 디자인", price: p(EDITORIAL_PRICES, "편집 디자인"), unit: "건", default: true },
      { name: "인포그래픽", price: p(EDITORIAL_PRICES, "인포그래픽"), unit: "건" },
      { name: "인쇄·제본", price: p(EDITORIAL_PRICES, "인쇄·제본"), unit: "건" },
      { name: "PDF 납품", price: p(EDITORIAL_PRICES, "PDF 납품"), unit: "건", default: true },
    ],
  },
];

/* ── 유틸 ── */

export function formatPriceWon(price: number): string {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) return `${eok}억원`;
    return `${eok}억 ${man.toLocaleString()}만원`;
  }
  return `${price.toLocaleString()}만원`;
}

export function formatPriceRange(price: number): string {
  return `${price.toLocaleString()}만 원~`;
}
