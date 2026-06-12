/**
 * 통합 가격 데이터 (2026-06-10 실견적 68건 기반 보정 · 06-11 실견적 반복 항목 12종 추가)
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
  { name: "기획 (세미나·컨퍼런스)", price: 100, unit: "식", note: "기획안, 운영 매뉴얼, 타임테이블, 예산안 포함" },
  { name: "기획 (포럼)", price: 100, unit: "식", note: "패널 토론 구성, 동시통역 연계 포함" },
  { name: "PM(총괄)", price: 30, unit: "인/일", note: "실거래 기준 (조달청 연구원급 373,144원/일 적용 가능)" },
  { name: "현장 스텝", price: 20, unit: "인/일", note: "실거래 기준 (조달청 연구보조원급 249,434원/일 적용 가능)" },
  { name: "행사계획서·시나리오", price: 50, unit: "건", note: "행사계획서 및 진행 시나리오 작성" },
  { name: "결과보고서", price: 50, unit: "건", note: "행사 성과 분석 및 결과 보고서 작성" },
];

/** 디자인·시안물 */
export const DESIGN_PRICES: PriceEntry[] = [
  { name: "포스터", price: 50, unit: "종", note: "웹용·인쇄용 동시 제작" },
  { name: "웹포스터", price: 30, unit: "식", note: "온라인 홍보용 웹포스터" },
  { name: "메인 현수막", price: 20, unit: "개", note: "디자인+출력+설치 포함, 크기에 따라 10~50만 변동" },
  { name: "배너·엑스배너", price: 6, unit: "개", note: "디자인+프레임 포함, 600×1800mm 기준" },
  { name: "자료집·리플렛", price: 100, unit: "건", note: "편집 디자인 + 인쇄·제본" },
  { name: "명찰(목걸이형)", price: 0.2, unit: "개", note: "디자인+제작 포함" },
  { name: "네임텐트·좌석명패", price: 0.3, unit: "개", note: "2천~4천 원/개, 수량에 따라 변동" },
  { name: "안내 폼보드(거치대 포함)", price: 7, unit: "개", note: "디자인+출력+거치대 포함" },
];

/** 영상·촬영 */
export const MEDIA_PRICES: PriceEntry[] = [
  { name: "행사 스케치 영상", price: 150, unit: "건", note: "촬영감독+편집 포함 (150~200만)" },
  { name: "사진 촬영", price: 50, unit: "건", note: "행사 스케치 사진 촬영" },
  { name: "하이브리드 중계", price: 200, unit: "건", note: "카메라 2~3대+스위처+송출, 대수·시간에 따라 변동" },
  { name: "온라인 회의 시스템(Zoom)", price: 50, unit: "식", note: "엔터프라이즈 계정·운영 인력 포함" },
];

/** 콘솔·장비 */
export const EQUIPMENT_PRICES: PriceEntry[] = [
  { name: "음향 시스템", price: 130, unit: "식", note: "기본 P.A+유무선 마이크 130만~, 컨퍼런스급 300만" },
  { name: "무대 시스템(중계 포함)", price: 135, unit: "식", note: "무대·중계 일체, 규모에 따라 변동" },
  { name: "LED 전광판", price: 300, unit: "식", note: "무대 LED 전광판, 크기에 따라 변동" },
  { name: "프롬프트(발표자 모니터)", price: 15, unit: "대", note: "40인치 이상 발표자 모니터링용" },
];

/** 특수 서비스 */
export const SPECIAL_PRICES: PriceEntry[] = [
  { name: "연사 섭외", price: 200, unit: "명", note: "200~700만, 유명도·전문성에 따라 변동" },
  { name: "명사급 특강 강사", price: 200, unit: "명", note: "인지도에 따라 변동, 실견적 중앙값 기준" },
  { name: "강사 초빙", price: 40, unit: "인", note: "40~400만, 분야·인지도에 따라 변동" },
  { name: "교육 강사(주강사+보조강사)", price: 27.5, unit: "회", note: "교육·워크숍 회당 기준" },
  { name: "사회자 섭외", price: 120, unit: "회", note: "전문 사회자 기준, 실견적 중앙값 120만" },
  { name: "동시통역", price: 315, unit: "식", note: "통역사 2인+부스·장비 포함, 언어당" },
  { name: "안전관리", price: 500, unit: "식", note: "행사 규모·장소 특성에 따라 변동" },
];

/** 운영 부대비용 */
export const OPERATION_PRICES: PriceEntry[] = [
  { name: "출결·QR 시스템", price: 80, unit: "식", note: "QR 체크인 구축·운영, 참석자 확인" },
  { name: "등록데스크 제작", price: 17, unit: "개", note: "그래픽 랩핑 등록데스크 제작·설치" },
  { name: "포토존 설치·철거", price: 35, unit: "식", note: "30~40만, 규모에 따라 변동 (디자인 별도)" },
  { name: "설문조사 제작·분석", price: 20, unit: "식", note: "QR 기반 온라인 설문, 결과 분석 포함" },
  { name: "행사보험", price: 30, unit: "식", note: "행사 상해·화재 보험" },
  { name: "응급구호·상비약", price: 10, unit: "식", note: "캠프·체험형 행사 안전 키트" },
  { name: "운반비", price: 50, unit: "식", note: "장비·물품 설치·철거 운반 (왕복)" },
];

/** 케이터링·식음 (만원 단위) */
export const CATERING_PRICES: PriceEntry[] = [
  { name: "커피·다과 (1인당)", price: 0.8, unit: "인", note: "메뉴 구성·바리스타 유무에 따라 변동" },
  { name: "도시락 (1인당)", price: 1.5, unit: "인", note: "메뉴 구성에 따라 변동" },
  { name: "다과 케이터링 (1인당)", price: 2.5, unit: "인", note: "메뉴 수·구성에 따라 변동" },
  { name: "VIP 다과", price: 30, unit: "식", note: "VIP 10인분 기준, 유리잔·고급 다과 포함" },
];

/** 편집 디자인 (단품) */
export const EDITORIAL_PRICES: PriceEntry[] = [
  { name: "포스터", price: 50, unit: "건", note: "기획+디자인 통합" },
  { name: "리플렛", price: 40, unit: "건", note: "A4 3단접지(6면) 기준" },
  { name: "브로슈어·팸플릿", price: 30, unit: "면", note: "A4 1면 기준 (8p=120만, 12p=180만, 16p=240만)" },
  { name: "현수막·배너", price: 15, unit: "개", note: "현수막, X배너, 롤배너 동일" },
  { name: "자료집·교재", price: 48, unit: "건", note: "표지+목차 20만 + 내지 7,000원/p (40p=48만, 80p=76만, 120p=104만)" },
  { name: "카드뉴스", price: 5, unit: "장", note: "8장=40만, 10장=50만" },
  { name: "PPT 디자인", price: 5, unit: "슬라이드", note: "10p=50만, 20p=100만" },
  { name: "PPT 템플릿", price: 15, unit: "식", note: "10~20만, 마스터 슬라이드 세트" },
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
  { title: "콘솔·장비", items: EQUIPMENT_PRICES },
  { title: "케이터링·식음", items: CATERING_PRICES },
  { title: "운영 부대비용", items: OPERATION_PRICES },
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
    range: "800만 원~",
    includes: ["기획", "PM(총괄)", "현장 스텝", "포스터", "현수막·배너", "음향 시스템", "결과보고서"],
  },
  {
    title: "중규모 컨퍼런스",
    scale: "100~200명",
    range: "2,500만 원~",
    includes: ["기획", "PM(총괄)", "현장 스텝", "포스터", "현수막·배너", "자료집", "음향 시스템", "스케치 영상", "사회자 섭외", "결과보고서"],
  },
  {
    title: "대규모 포럼·국제행사",
    scale: "300~500명",
    range: "5,000만 원~",
    includes: ["기획", "PM(총괄)", "현장 스텝", "포스터", "현수막·배너", "자료집", "음향 시스템", "LED 전광판", "스케치 영상", "사회자 섭외", "하이브리드 중계", "동시통역", "결과보고서"],
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

/** 서비스 6종(행사 3 + 디자인 3)과 1:1 정렬 — GNB·/work 분류와 동일 */
export const ESTIMATE_EVENT_TYPES: EstimateEventType[] = [
  {
    id: "conference",
    name: "컨퍼런스·세미나",
    desc: "학술대회·포럼·심포지엄·세미나",
    items: [
      { name: "기획", price: p(PLANNING_PRICES, "기획 (세미나·컨퍼런스)"), unit: "식" },
      { name: "PM(총괄)", price: p(PLANNING_PRICES, "PM(총괄)"), unit: "인/일" },
      { name: "현장 스텝", price: p(PLANNING_PRICES, "현장 스텝"), unit: "인/일" },
      { name: "포스터", price: p(DESIGN_PRICES, "포스터"), unit: "종" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "자료집·교재", price: p(EDITORIAL_PRICES, "자료집·교재"), unit: "건" },
      { name: "연사 섭외", price: p(SPECIAL_PRICES, "연사 섭외"), unit: "명" },
      { name: "사회자 섭외", price: p(SPECIAL_PRICES, "사회자 섭외"), unit: "회" },
      { name: "동시통역", price: p(SPECIAL_PRICES, "동시통역"), unit: "식" },
      { name: "음향 시스템", price: p(EQUIPMENT_PRICES, "음향 시스템"), unit: "식" },
      { name: "LED 전광판", price: p(EQUIPMENT_PRICES, "LED 전광판"), unit: "식" },
      { name: "하이브리드 중계", price: p(MEDIA_PRICES, "하이브리드 중계"), unit: "건" },
      { name: "행사 스케치 영상", price: p(MEDIA_PRICES, "행사 스케치 영상"), unit: "건" },
      { name: "사진 촬영", price: p(MEDIA_PRICES, "사진 촬영"), unit: "건" },
      { name: "출결·QR 시스템", price: p(OPERATION_PRICES, "출결·QR 시스템"), unit: "식" },
      { name: "커피·다과", price: p(CATERING_PRICES, "커피·다과 (1인당)"), unit: "인" },
      { name: "다과 케이터링", price: p(CATERING_PRICES, "다과 케이터링 (1인당)"), unit: "인" },
      { name: "행사보험", price: p(OPERATION_PRICES, "행사보험"), unit: "식" },
      { name: "운반비", price: p(OPERATION_PRICES, "운반비"), unit: "식" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건" },
    ],
  },
  {
    id: "education",
    name: "교육·워크숍",
    desc: "임직원 연수·역량강화·캠프",
    items: [
      { name: "기획", price: p(PLANNING_PRICES, "기획 (세미나·컨퍼런스)"), unit: "식" },
      { name: "PM(총괄)", price: p(PLANNING_PRICES, "PM(총괄)"), unit: "인/일" },
      { name: "현장 스텝", price: p(PLANNING_PRICES, "현장 스텝"), unit: "인/일" },
      { name: "강사 초빙", price: p(SPECIAL_PRICES, "강사 초빙"), unit: "인" },
      { name: "사회자 섭외", price: p(SPECIAL_PRICES, "사회자 섭외"), unit: "회" },
      { name: "자료집·교재", price: p(EDITORIAL_PRICES, "자료집·교재"), unit: "건" },
      { name: "포스터", price: p(DESIGN_PRICES, "포스터"), unit: "종" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "음향 시스템", price: p(EQUIPMENT_PRICES, "음향 시스템"), unit: "식" },
      { name: "출결·QR 시스템", price: p(OPERATION_PRICES, "출결·QR 시스템"), unit: "식" },
      { name: "설문조사 제작·분석", price: p(OPERATION_PRICES, "설문조사 제작·분석"), unit: "식" },
      { name: "사진 촬영", price: p(MEDIA_PRICES, "사진 촬영"), unit: "건" },
      { name: "커피·다과", price: p(CATERING_PRICES, "커피·다과 (1인당)"), unit: "인" },
      { name: "다과 케이터링", price: p(CATERING_PRICES, "다과 케이터링 (1인당)"), unit: "인" },
      { name: "행사보험", price: p(OPERATION_PRICES, "행사보험"), unit: "식" },
      { name: "운반비", price: p(OPERATION_PRICES, "운반비"), unit: "식" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건" },
    ],
  },
  {
    id: "booth",
    name: "전시·홍보부스",
    desc: "박람회 부스·체험부스·포토존 운영",
    items: [
      { name: "전시 부스 디자인", price: p(EDITORIAL_PRICES, "전시 부스 디자인"), unit: "면" },
      { name: "PM(총괄)", price: p(PLANNING_PRICES, "PM(총괄)"), unit: "인/일" },
      { name: "현장 스텝", price: p(PLANNING_PRICES, "현장 스텝"), unit: "인/일" },
      { name: "현수막", price: p(DESIGN_PRICES, "메인 현수막"), unit: "개" },
      { name: "엑스배너", price: p(DESIGN_PRICES, "배너·엑스배너"), unit: "개" },
      { name: "리플렛", price: p(EDITORIAL_PRICES, "리플렛"), unit: "건" },
      { name: "사진 촬영", price: p(MEDIA_PRICES, "사진 촬영"), unit: "건" },
      { name: "행사보험", price: p(OPERATION_PRICES, "행사보험"), unit: "식" },
      { name: "운반비", price: p(OPERATION_PRICES, "운반비"), unit: "식" },
      { name: "결과보고서", price: p(PLANNING_PRICES, "결과보고서"), unit: "건" },
    ],
  },
  {
    id: "print",
    name: "현수막·포스터",
    desc: "포스터·리플렛·배너·자료집 인쇄물",
    items: [
      { name: "포스터", price: p(EDITORIAL_PRICES, "포스터"), unit: "건" },
      { name: "리플렛", price: p(EDITORIAL_PRICES, "리플렛"), unit: "건" },
      { name: "브로슈어·팸플릿", price: p(EDITORIAL_PRICES, "브로슈어·팸플릿"), unit: "면" },
      { name: "현수막·배너", price: p(EDITORIAL_PRICES, "현수막·배너"), unit: "개" },
      { name: "자료집·교재", price: p(EDITORIAL_PRICES, "자료집·교재"), unit: "건" },
    ],
  },
  {
    id: "digital",
    name: "카드뉴스·PPT",
    desc: "SNS 카드뉴스·발표자료 디자인",
    items: [
      { name: "카드뉴스", price: p(EDITORIAL_PRICES, "카드뉴스"), unit: "장" },
      { name: "PPT 디자인", price: p(EDITORIAL_PRICES, "PPT 디자인"), unit: "슬라이드" },
    ],
  },
  {
    id: "space",
    name: "전시부스·포토존",
    desc: "부스·포토존 디자인·제작",
    items: [
      { name: "전시 부스 디자인", price: p(EDITORIAL_PRICES, "전시 부스 디자인"), unit: "면" },
      { name: "현수막·배너", price: p(EDITORIAL_PRICES, "현수막·배너"), unit: "개" },
    ],
  },
];

/** 견적 시뮬레이터 좌측 리스트 섹션 구분 (행사/디자인) */
export const ESTIMATE_GROUPS: { label: string; ids: string[] }[] = [
  { label: "행사 대행", ids: ["conference", "education", "booth"] },
  { label: "디자인", ids: ["print", "digital", "space"] },
];

/** 디자인 계열 id — 패널에 정밀 견적 계산기 링크 노출 */
export const ESTIMATE_DESIGN_IDS = ["print", "digital", "space"];

/* ── 간편 견적: 유형×규모 → 예상 범위 (2026-06 실견적 49건 총액 분포 기반) ── */

export interface EstimateScaleBand {
  id: string;
  label: string;
  /** 만원 단위. max=null → "X만 원~" */
  min: number;
  max: number | null;
}

export const ESTIMATE_SCALES: Record<string, EstimateScaleBand[]> = {
  conference: [
    { id: "s", label: "~50명", min: 800, max: 1500 },
    { id: "m", label: "~100명", min: 1500, max: 2500 },
    { id: "l", label: "~200명", min: 2500, max: 4000 },
    { id: "xl", label: "300명 이상", min: 4000, max: null },
  ],
  education: [
    { id: "s", label: "~50명", min: 600, max: 1200 },
    { id: "m", label: "~100명", min: 1200, max: 2000 },
    { id: "l", label: "~200명", min: 2000, max: 3500 },
    { id: "xl", label: "300명+ · 숙박형", min: 3500, max: null },
  ],
  booth: [
    { id: "s", label: "기본 부스 (1~2면)", min: 400, max: 1000 },
    { id: "m", label: "체험형 부스", min: 1000, max: 2000 },
    { id: "l", label: "박람회 운영형", min: 2000, max: 5000 },
    { id: "xl", label: "대형 구조물", min: 5000, max: null },
  ],
};

/** 유형별 "포함" 한 줄 */
export const ESTIMATE_INCLUDES: Record<string, string> = {
  conference: "기획 · 연사/사회자 섭외 · 시안물 디자인 · 현장 운영 · 결과보고",
  education: "커리큘럼 기획 · 강사 섭외 · 교재 제작 · 현장 운영 · 결과보고",
  booth: "부스 디자인 · 제작/시공 · 현장 운영 · 철거 · 결과보고",
};

/** 유형별 포함/제외 상세 (범위 카드 하단 접이식) */
export const ESTIMATE_DETAIL: Record<string, { included: string[]; excluded: string[] }> = {
  conference: {
    included: [
      "행사 기획 · 운영 매뉴얼 · 시나리오",
      "전문 사회자 섭외",
      "연사 섭외 대행",
      "포스터 · 현수막 · 배너 · 자료집 · 명찰 디자인",
      "음향 및 중계 등 시스템 세팅",
      "현장 운영 인력 · 리허설 · 의전",
      "사진 기록 · 결과보고서 · 정산 서류",
    ],
    excluded: [
      "연사 · 강사 사례비",
      "대관료 (행사장 임차)",
      "식음 — 커피 · 다과 · 케이터링 (실비)",
      "동시통역 부스",
      "스케치 영상 제작 (옵션)",
    ],
  },
  education: {
    included: [
      "커리큘럼 기획 · 프로그램 설계",
      "강사 · 퍼실리테이터 섭외 (강사료 별도)",
      "교재 · 워크북 · 포스터 · 명찰 디자인",
      "현장 운영 인력 · 교육 진행",
      "출결 관리 · 만족도 조사",
      "결과보고서 · 정산 서류",
    ],
    excluded: [
      "대관료 (교육장 임차)",
      "식음 — 도시락 · 다과 (실비)",
      "강사료 (사례비)",
      "숙박 · 차량 (숙박형 행사 실비)",
      "스케치 영상 제작 (옵션)",
    ],
  },
  booth: {
    included: [
      "부스 컨셉 기획 · 3D 시안",
      "부스 그래픽 · 현수막 · 배너 디자인",
      "구조물 제작 · 그래픽 출력",
      "현장 실측 · 설치 · 철거",
      "부스 운영 인력 (선택 시)",
      "현장 사진 · 결과보고",
    ],
    excluded: [
      "전시장 부스 참가비 (주최측 납부)",
      "전기 · 통신 · 인터넷 사용료",
      "식음 · 기념품 (실비)",
      "대형 특수 구조물 (별도 견적)",
    ],
  },
};

/** 디자인 3종: 품목 가격칩 (실견적 검증 단가) */
export const ESTIMATE_CHIPS: Record<string, { name: string; text: string }[]> = {
  print: [
    { name: "포스터", text: "50만 원~" },
    { name: "리플렛", text: "40만 원~" },
    { name: "현수막·배너", text: "15만 원~" },
    { name: "자료집·교재", text: "48만 원~ (40p)" },
  ],
  digital: [
    { name: "카드뉴스", text: "5만 원/장 (10장 50만)" },
    { name: "PPT 디자인", text: "5만 원/슬라이드 (20p 100만)" },
    { name: "PPT 템플릿", text: "10만 원~" },
  ],
  space: [
    { name: "전시부스 디자인", text: "60만 원/면 (2×3m)" },
    { name: "포토존 디자인", text: "60만 원" },
    { name: "전시부스·포토존 구조물", text: "별도 견적" },
  ],
};

/** 범위 표기: "1,500만 ~ 2,500만 원" / "4,000만 원~" */
export function formatRangeText(band: EstimateScaleBand): string {
  const f = (n: number) => (n >= 10000 ? `${(n / 10000).toLocaleString()}억` : `${n.toLocaleString()}만`);
  if (band.max === null) return `${f(band.min)} 원~`;
  return `${f(band.min)} ~ ${f(band.max)} 원`;
}

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
