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
  { name: "기획 (세미나·컨퍼런스)", price: 200, unit: "식", note: "기획안, 운영 매뉴얼, 타임테이블, 예산안 포함" },
  { name: "기획 (포럼)", price: 200, unit: "식", note: "패널 토론 구성, 동시통역 연계 포함" },
  { name: "현장 운영인력", price: 30, unit: "인/일", note: "현장 운영 스태프 1인 1일 기준" },
  { name: "결과보고서", price: 50, unit: "건", note: "행사 성과 분석 및 결과 보고서 작성" },
];

/** 디자인·시안물 */
export const DESIGN_PRICES: PriceEntry[] = [
  { name: "포스터", price: 50, unit: "종", note: "웹용·인쇄용 동시 제작" },
  { name: "메인 현수막", price: 20, unit: "개", note: "디자인 시안 제공, 출력·설치 포함" },
  { name: "배너·엑스배너", price: 15, unit: "개", note: "디자인+인쇄 포함" },
  { name: "자료집·리플렛", price: 100, unit: "건", note: "편집 디자인 + 인쇄·제본" },
];

/** 영상·촬영 */
export const MEDIA_PRICES: PriceEntry[] = [
  { name: "행사 스케치 영상", price: 150, unit: "건", note: "촬영+편집 포함" },
  { name: "하이브리드 중계", price: 300, unit: "건", note: "카메라 대수·중계 시간에 따라 변동" },
];

/** 특수 서비스 */
export const SPECIAL_PRICES: PriceEntry[] = [
  { name: "연사 섭외", price: 200, unit: "명", note: "200~700만원, 유명도·전문성에 따라 변동" },
  { name: "사회자 섭외", price: 120, unit: "회", note: "전문 사회자·아나운서 기준" },
  { name: "음향 시스템", price: 130, unit: "식", note: "음향 P.A 시스템, 유무선 마이크 포함" },
  { name: "동시통역", price: 600, unit: "언어", note: "언어 1개별 기준" },
  { name: "안전관리", price: 500, unit: "식", note: "행사 규모·장소 특성에 따라 변동" },
];

/** 케이터링·식음 (1인당, 만원 단위) */
export const CATERING_PRICES: PriceEntry[] = [
  { name: "커피·다과 (1인당)", price: 1, unit: "인", note: "메뉴 구성·바리스타 유무에 따라 변동" },
  { name: "다과 케이터링 (1인당)", price: 2.5, unit: "인", note: "메뉴 수·구성에 따라 변동" },
];

/** 편집 디자인 (단품) */
export const EDITORIAL_PRICES: PriceEntry[] = [
  { name: "포스터", price: 50, unit: "건", note: "기획+디자인 통합" },
  { name: "리플렛", price: 60, unit: "건", note: "3단접지(6면) 기준, 면당 30만원" },
  { name: "브로슈어·팸플릿", price: 30, unit: "면", note: "A4 1면 기준 (8p=120만, 12p=180만, 16p=240만)" },
  { name: "현수막·배너", price: 15, unit: "개", note: "현수막, X배너, 롤배너 동일" },
  { name: "자료집·교재", price: 48, unit: "건", note: "표지+목차 20만 + 내지 7,000원/p (40p=48만, 80p=76만, 120p=104만)" },
  { name: "카드뉴스", price: 10, unit: "장", note: "5장=50만, 10장=100만" },
  { name: "PPT 디자인", price: 5, unit: "슬라이드", note: "10p=50만, 20p=100만" },
  { name: "전시 부스 디자인", price: 60, unit: "면", note: "2m×3m(1면) 기준, 면 추가 시 비례" },
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
  { title: "케이터링·식음", items: CATERING_PRICES },
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
    range: "600만 원~",
    includes: ["기획", "운영인력", "포스터", "현수막·배너", "결과보고서"],
  },
  {
    title: "중규모 컨퍼런스",
    scale: "100~200명",
    range: "1,500만 원~",
    includes: ["기획", "운영인력", "포스터", "현수막·배너", "자료집", "스케치 영상", "연사 섭외", "결과보고서"],
  },
  {
    title: "대규모 포럼·국제행사",
    scale: "300~500명",
    range: "3,000만 원~",
    includes: ["기획", "운영인력", "포스터", "현수막·배너", "자료집", "스케치 영상", "연사 섭외", "동시통역", "하이브리드 중계", "결과보고서"],
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
      { name: "기획", price: p(PLANNING_PRICES, "기획 (세미나·컨퍼런스)"), unit: "식" },
      { name: "현장 운영인력", price: p(PLANNING_PRICES, "현장 운영인력"), unit: "인/일" },
      { name: "포스터", price: p(DESIGN_PRICES, "포스터"), unit: "종" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "연사 섭외", price: p(SPECIAL_PRICES, "연사 섭외"), unit: "명" },
      { name: "사회자 섭외", price: p(SPECIAL_PRICES, "사회자 섭외"), unit: "회" },
      { name: "음향 시스템", price: p(SPECIAL_PRICES, "음향 시스템"), unit: "식" },
      { name: "행사 스케치 영상", price: p(MEDIA_PRICES, "행사 스케치 영상"), unit: "건" },
      { name: "커피·다과", price: p(CATERING_PRICES, "커피·다과 (1인당)"), unit: "인" },
      { name: "다과 케이터링", price: p(CATERING_PRICES, "다과 케이터링 (1인당)"), unit: "인" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건" },
    ],
  },
  {
    id: "forum",
    name: "포럼",
    desc: "토론·패널 중심의 전문가 회의",
    items: [
      { name: "기획", price: p(PLANNING_PRICES, "기획 (포럼)"), unit: "식" },
      { name: "현장 운영인력", price: p(PLANNING_PRICES, "현장 운영인력"), unit: "인/일" },
      { name: "포스터", price: p(DESIGN_PRICES, "포스터"), unit: "종" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "연사 섭외", price: p(SPECIAL_PRICES, "연사 섭외"), unit: "명" },
      { name: "사회자 섭외", price: p(SPECIAL_PRICES, "사회자 섭외"), unit: "회" },
      { name: "음향 시스템", price: p(SPECIAL_PRICES, "음향 시스템"), unit: "식" },
      { name: "동시통역", price: p(SPECIAL_PRICES, "동시통역"), unit: "언어" },
      { name: "하이브리드 중계", price: p(MEDIA_PRICES, "하이브리드 중계"), unit: "건" },
      { name: "행사 스케치 영상", price: p(MEDIA_PRICES, "행사 스케치 영상"), unit: "건" },
      { name: "커피·다과", price: p(CATERING_PRICES, "커피·다과 (1인당)"), unit: "인" },
      { name: "다과 케이터링", price: p(CATERING_PRICES, "다과 케이터링 (1인당)"), unit: "인" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건" },
    ],
  },
  {
    id: "editorial",
    name: "편집 디자인",
    desc: "포스터·리플렛·자료집 등 편집 디자인",
    items: [
      { name: "포스터", price: p(EDITORIAL_PRICES, "포스터"), unit: "건" },
      { name: "리플렛", price: p(EDITORIAL_PRICES, "리플렛"), unit: "건" },
      { name: "브로슈어·팸플릿", price: p(EDITORIAL_PRICES, "브로슈어·팸플릿"), unit: "면" },
      { name: "현수막·배너", price: p(EDITORIAL_PRICES, "현수막·배너"), unit: "개" },
      { name: "자료집·교재", price: p(EDITORIAL_PRICES, "자료집·교재"), unit: "건" },
      { name: "카드뉴스", price: p(EDITORIAL_PRICES, "카드뉴스"), unit: "장" },
      { name: "PPT 디자인", price: p(EDITORIAL_PRICES, "PPT 디자인"), unit: "슬라이드" },
      { name: "전시 부스 디자인", price: p(EDITORIAL_PRICES, "전시 부스 디자인"), unit: "면" },
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
  if (price < 1) {
    return `${(price * 10000).toLocaleString()}원`;
  }
  if (price < 10 && price % 1 !== 0) {
    const man = Math.floor(price);
    const cheon = Math.round((price - man) * 10);
    if (man === 0) return `${cheon}천원`;
    return `${man}만 ${cheon}천원`;
  }
  return `${price.toLocaleString()}만원`;
}

export function formatPriceRange(price: number): string {
  if (price < 1) {
    return `${(price * 10000).toLocaleString()}원~`;
  }
  if (price < 10 && price % 1 !== 0) {
    const man = Math.floor(price);
    const cheon = Math.round((price - man) * 10);
    if (man === 0) return `${cheon}천 원~`;
    return `${man}만 ${cheon}천 원~`;
  }
  return `${price.toLocaleString()}만 원~`;
}
