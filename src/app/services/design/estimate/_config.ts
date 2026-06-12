/**
 * 디자인 셀프 견적 계산기 설정
 * 가격 공식은 parandesign estimate.html 원본을 그대로 이식 (하드코딩 유지).
 * 전 품목 VAT 포함, 수정 3회 기준.
 */

export interface FieldChoice {
  label: string;
  /** 가격 계산에 들어가는 숫자값 (배수, 직접수량, 또는 가산금액) */
  value: number;
}

export interface ProductField {
  id: string;
  label: string;
  kind: "chips" | "stepper";
  /** chips 용 선택지 */
  choices?: FieldChoice[];
  /** stepper 용 */
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** true면 가격에 영향 없는 표시용 옵션 */
  display?: boolean;
}

export interface ProductDef {
  key: string;
  name: string;
  /** 품목 한 줄 설명 */
  note: string;
  fields: ProductField[];
  initial: Record<string, number>;
  price: (s: Record<string, number>) => number;
}

export const PRODUCTS: ProductDef[] = [
  {
    key: "leaflet",
    name: "리플렛",
    note: "기획+편집디자인 · 단면/양면 · A4/A3",
    fields: [
      {
        id: "fold",
        label: "접지 방식",
        kind: "chips",
        display: true,
        choices: [
          { label: "2단접지", value: 0 },
          { label: "3단접지", value: 1 },
          { label: "날개접지", value: 2 },
        ],
      },
      {
        id: "side",
        label: "인쇄면",
        kind: "chips",
        choices: [
          { label: "단면", value: 1 },
          { label: "양면", value: 2 },
        ],
      },
      {
        id: "size",
        label: "사이즈",
        kind: "chips",
        choices: [
          { label: "A4", value: 1 },
          { label: "A3", value: 1.4 },
        ],
      },
      { id: "qty", label: "수량", kind: "stepper", min: 1, max: 10, step: 1, unit: "종" },
    ],
    initial: { fold: 0, side: 2, size: 1, qty: 1 },
    price: (s) => s.side * 330000 * s.size * s.qty,
  },
  {
    key: "poster",
    name: "포스터",
    note: "웹용·인쇄용 동시 제작",
    fields: [
      {
        id: "size",
        label: "사이즈",
        kind: "chips",
        choices: [
          { label: "B2", value: 0.6 },
          { label: "A3", value: 0.8 },
          { label: "A2", value: 1 },
          { label: "B1", value: 1.4 },
          { label: "A1", value: 1.6 },
        ],
      },
      {
        id: "qty",
        label: "디자인 수량",
        kind: "chips",
        unit: "종",
        choices: [
          { label: "1종", value: 1 },
          { label: "2종", value: 2 },
          { label: "3종", value: 3 },
          { label: "5종", value: 5 },
        ],
      },
    ],
    initial: { size: 1, qty: 1 },
    price: (s) => s.qty * 550000 * s.size,
  },
  {
    key: "catalog",
    name: "카탈로그·자료집",
    note: "편집 디자인 + 제본",
    fields: [
      {
        id: "pages",
        label: "페이지 수",
        kind: "chips",
        unit: "p",
        choices: [
          { label: "8p", value: 8 },
          { label: "12p", value: 12 },
          { label: "16p", value: 16 },
          { label: "24p", value: 24 },
          { label: "32p", value: 32 },
          { label: "48p", value: 48 },
          { label: "64p", value: 64 },
        ],
      },
      {
        id: "cover",
        label: "표지 디자인",
        kind: "chips",
        choices: [
          { label: "미포함", value: 0 },
          { label: "포함 (+11만)", value: 110000 },
        ],
      },
    ],
    initial: { pages: 8, cover: 0 },
    price: (s) => s.pages * 75000 + s.cover,
  },
  {
    key: "banner",
    name: "배너·현수막",
    note: "X배너 / 현수막 · 추가 리사이즈",
    fields: [
      {
        id: "base",
        label: "종류",
        kind: "chips",
        choices: [
          { label: "X배너", value: 55000 },
          { label: "현수막", value: 110000 },
        ],
      },
      {
        id: "resize",
        label: "추가 리사이즈",
        kind: "chips",
        choices: [
          { label: "없음", value: 0 },
          { label: "1건", value: 1 },
          { label: "2건", value: 2 },
          { label: "3건", value: 3 },
        ],
      },
      { id: "qty", label: "수량", kind: "stepper", min: 1, max: 10, step: 1, unit: "종" },
    ],
    initial: { base: 55000, resize: 0, qty: 1 },
    price: (s) => (s.base + s.resize * 33000) * s.qty,
  },
  {
    key: "ppt",
    name: "PPT",
    note: "발표·보고용 슬라이드 디자인",
    fields: [
      {
        id: "slides",
        label: "슬라이드 수",
        kind: "chips",
        unit: "장",
        choices: [
          { label: "10장", value: 10 },
          { label: "15장", value: 15 },
          { label: "20장", value: 20 },
          { label: "30장", value: 30 },
          { label: "50장", value: 50 },
        ],
      },
      {
        id: "use",
        label: "용도",
        kind: "chips",
        display: true,
        choices: [
          { label: "보고서용", value: 0 },
          { label: "발표용", value: 1 },
          { label: "홍보용", value: 2 },
        ],
      },
    ],
    initial: { slides: 10, use: 0 },
    price: (s) => s.slides * 55000,
  },
  {
    key: "booth",
    name: "전시부스",
    note: "3D 시안 + 시공도면",
    fields: [
      {
        id: "scale",
        label: "부스 규모",
        kind: "chips",
        choices: [
          { label: "1부스 (3×3m)", value: 1 },
          { label: "2부스 (6×3m)", value: 2 },
          { label: "3부스 (9×3m)", value: 3 },
          { label: "4부스 (12×3m)", value: 4 },
        ],
      },
    ],
    initial: { scale: 1 },
    price: (s) => s.scale * 660000,
  },
  {
    key: "cardnews",
    name: "카드뉴스",
    note: "SNS·홍보용 카드뉴스",
    fields: [
      {
        id: "count",
        label: "장 수",
        kind: "chips",
        unit: "장",
        choices: [
          { label: "5장", value: 5 },
          { label: "8장", value: 8 },
          { label: "10장", value: 10 },
          { label: "12장", value: 12 },
          { label: "15장", value: 15 },
        ],
      },
      {
        id: "channel",
        label: "게시 채널",
        kind: "chips",
        display: true,
        choices: [
          { label: "SNS", value: 0 },
          { label: "카카오채널", value: 1 },
          { label: "블로그·뉴스레터", value: 2 },
        ],
      },
    ],
    initial: { count: 5 },
    price: (s) => s.count * 110000,
  },
];

/** 2품목 이상 담을 때 10% 세트 할인 */
export const SET_DISCOUNT_RATE = 0.1;
export const SET_DISCOUNT_MIN_ITEMS = 2;

export const REFERRAL_OPTIONS = [
  "네이버 검색",
  "구글 검색",
  "블로그",
  "SNS·유튜브",
  "광고",
  "지인·동료 추천",
  "기타",
];
