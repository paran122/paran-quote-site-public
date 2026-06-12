import {
  Image,
  BookOpen,
  Megaphone,
  Books,
  DeviceMobile,
  Presentation,
  Cube,
  Package,
  PenNib,
  UsersThree,
  Buildings,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export interface DesignItem {
  icon: PhosphorIcon;
  /** 앵커 id — parandesign 서비스 슬러그와 일치시켜 301 #앵커로 연결 */
  anchor: string;
  name: string;
  desc: string;
  specs: string;
  examples: string;
}

export interface DesignGroup {
  key: "print" | "digital" | "space";
  label: string;
  h1: string;
  intro: string;
  /** 디자인 필터 deep-link (포트폴리오) */
  workFilter?: string;
  items: DesignItem[];
  faq: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const DESIGN_GROUPS: Record<DesignGroup["key"], DesignGroup> = {
  print: {
    key: "print",
    label: "현수막·포스터",
    h1: "현수막·포스터·배너 제작",
    intro:
      "현수막·포스터·리플렛·배너·카탈로그 등 공공기관 행사·업무용 인쇄물 전문. 주제만 전달하면 카피라이팅·디자인·인쇄용 파일까지 원스톱 해결. 시안 3~5일, 수정 3회 포함.",
    workFilter: "인쇄물",
    items: [
      {
        icon: Image,
        anchor: "poster",
        name: "포스터",
        desc: "행사·공모전·축제·공공기관 포스터 전문 — 표준 규격·맞춤 사이즈 대응",
        specs: "기획+디자인 50만원~ · 시안 3~5일 · 수정 3회",
        examples: "공공기관 포스터, 지자체 행사 안내, 공모전 홍보, 축제·캠페인 포스터",
      },
      {
        icon: BookOpen,
        anchor: "leaflet",
        name: "리플렛·팜플렛",
        desc: "3단·4단·병풍접지 등 모든 접지 방식 대응 — 목차 구성·콘텐츠 기획 포함",
        specs: "기획+디자인 30만원~ · 시안 3~5일 · 수정 3회",
        examples: "사업 소개 팜플렛, 행사 안내 리플렛, 제품 카탈로그",
      },
      {
        icon: Megaphone,
        anchor: "banner",
        name: "배너·현수막",
        desc: "현수막·X배너·포디움 전문 — 표준 규격·지정게시대 규격 대응",
        specs: "기획+디자인 15만원~ · 시안 2~3일 · 수정 3회",
        examples: "행사 현수막, X배너, 포디움, 캠페인 배너",
      },
      {
        icon: Books,
        anchor: "catalog",
        name: "카탈로그·자료집",
        desc: "소책자부터 200페이지 자료집까지 — 목차 기획·카피라이팅 포함",
        specs: "기획+디자인 4만원~/페이지 · 시안 5~7일 · 수정 3회",
        examples: "공공기관 사업보고서, 정책·교육 자료집, 제품·서비스 카탈로그",
      },
    ],
    faq: [
      {
        q: "현수막·포스터 디자인 비용은 얼마인가요?",
        a: "파란컴퍼니 기준 현수막·배너는 15만 원, 리플렛은 30만 원, 포스터는 50만 원부터 시작합니다. 시안 3~5일, 수정 3회가 기본 포함이며 수량과 규격에 따라 조정됩니다.",
      },
      {
        q: "텍스트 없이 주제만 알려도 되나요?",
        a: "네, 주제만 알려주시면 카피라이팅부터 시작합니다. 행사명, 목표, 대상 정보만 있으면 문구 기획과 콘텐츠 구성을 저희가 제안합니다.",
      },
      {
        q: "인쇄까지 한 번에 맡길 수 있나요?",
        a: "디자인은 저희가 전담하고, 인쇄는 CMYK 세팅 완료 파일로 납품한 후 신뢰할 수 있는 인쇄소 연계를 지원합니다.",
      },
      {
        q: "행사가 임박했는데 빠르게 받을 수 있나요?",
        a: "네, 일정 협의 후 우선 작업으로 진행합니다. 현수막·배너는 기본 시안 2~3일이며, 행사가 임박한 경우 당일~익일 시안도 별도 협의로 가능합니다.",
      },
    ],
    metaTitle: "현수막·포스터·리플렛 제작 — 인쇄물 디자인",
    metaDescription:
      "공공기관 행사·업무용 인쇄물 디자인 전문. 현수막·포스터·리플렛·카탈로그를 기획부터 인쇄용 파일까지 원스톱 제작. 시안 3~5일, 수정 3회 포함. 무료 견적.",
    keywords: ["현수막디자인", "포스터디자인", "리플렛디자인", "카탈로그디자인", "인쇄물디자인", "배너디자인"],
  },
  digital: {
    key: "digital",
    label: "PPT·카드뉴스·편집디자인",
    h1: "PPT·카드뉴스·편집디자인",
    intro:
      "SNS 카드뉴스·발표용 PPT·자료집 등 편집디자인 전문. 기획부터 디자인까지 신속 납품 — 공공기관·기업 홍보·보고 지원. 시안 2~3일, 모든 플랫폼 규격 대응.",
    workFilter: "디지털",
    items: [
      {
        icon: DeviceMobile,
        anchor: "card-news",
        name: "카드뉴스·SNS 콘텐츠",
        desc: "공공기관·기업 SNS 정보형·홍보형 카드뉴스 전문 — 플랫폼별 최적 사이즈 제공",
        specs: "기획+디자인 5만원~/장 · 시안 2~3일 · 수정 3회",
        examples: "정부·지자체 SNS 공지, 기업 상품·서비스 홍보, 캠페인 정보 전달, 뉴스형 카드",
      },
      {
        icon: Presentation,
        anchor: "ppt",
        name: "PPT 디자인·발표자료",
        desc: "사업보고서·제안서·발표 자료 전문 — 인포그래픽·차트 디자인 포함",
        specs: "기획+디자인 5만원~/장 · 시안 3~5일 · 수정 3회",
        examples: "공공기관 사업보고, 기업 제안서, 정책 발표 자료, 세미나 강의 자료",
      },
      {
        icon: Books,
        anchor: "catalog",
        name: "자료집·책자 편집디자인",
        desc: "포럼 자료집·결과보고서·교재·백서 등 책자 편집디자인 — 표지부터 내지·인쇄까지 원스톱",
        specs: "표지+내지(100p 내외) 60만원~ · 시안 3~5일 · 인쇄 연계",
        examples: "포럼·학술대회 자료집, 사업 결과보고서, 교육 워크북, 공모전 작품집",
      },
    ],
    faq: [
      {
        q: "카드뉴스·PPT 가격은 어떻게 되나요?",
        a: "파란컴퍼니 기준 카드뉴스·PPT 모두 장당 5만원~부터 시작합니다. 장수와 콘텐츠 복잡도에 따라 조정되며, 정확한 견적은 상담 후 안내드립니다.",
      },
      {
        q: "행사 자료집·결과보고서 제작도 가능한가요?",
        a: "네, 포럼 자료집·결과자료집·운영 매뉴얼 등 편집 디자인을 표지부터 내지 레이아웃, 인쇄 연계까지 원스톱으로 제작합니다.",
      },
      {
        q: "자료집·책자 편집디자인 비용은 얼마인가요?",
        a: "표지+내지 100페이지 내외 기준 60만원~부터 시작합니다. 페이지 수와 디자인 난이도에 따라 조정되며, 인쇄까지 연계 시 인쇄비는 별도 견적으로 안내드립니다.",
      },
      {
        q: "플랫폼별 자동 리사이즈가 가능한가요?",
        a: "네, 카드뉴스는 인스타그램·페이스북·블로그 등 주요 플랫폼 규격으로 변환하여 각각 납품합니다.",
      },
      {
        q: "PPT 템플릿만 받을 수도 있나요?",
        a: "네, 마스터 슬라이드 기반 템플릿 제작도 가능합니다. 직접 내용을 편집할 수 있도록 편집 가능한 PPTX 파일로 납품합니다.",
      },
      {
        q: "인포그래픽·차트 제작도 포함되나요?",
        a: "네, PPT 디자인에는 기본 차트·그래프부터 커스텀 인포그래픽까지 모두 포함됩니다. 데이터 시각화로 보고 내용을 강화합니다.",
      },
    ],
    metaTitle: "편집디자인·PPT·카드뉴스 — 자료집·책자·발표자료 제작",
    metaDescription:
      "PPT 디자인·카드뉴스·편집디자인 전문. 발표자료·SNS 카드뉴스·자료집·책자를 기획부터 디자인까지 신속 제작. 플랫폼별 규격 대응, 수정 3회 포함. 무료 견적.",
    keywords: ["PPT디자인", "카드뉴스디자인", "편집디자인", "책자디자인", "책자제작", "자료집디자인", "인포그래픽디자인", "발표자료디자인", "소책자인쇄"],
  },
  space: {
    key: "space",
    label: "전시부스·포토존",
    h1: "전시부스·포토존 디자인",
    intro:
      "박람회·전시회·공공행사 전시부스·이벤트 포토존 디자인·시공 전문. 부스 카피 기획부터 3D 시뮬레이션, 시공 도면 제공까지 원스톱 — 현장 실측·설치까지 지원.",
    workFilter: "공간",
    items: [
      {
        icon: Cube,
        anchor: "booth",
        name: "전시부스·포토존",
        desc: "1부스부터 대형 부스까지 — 배치도 맞춤 디자인",
        specs: "기획+디자인 60만원~ · 시안 5~7일",
        examples: "박람회 전시부스, 행사부스, 포토존",
      },
      {
        icon: Package,
        anchor: "package",
        name: "행사 디자인 통합 패키지",
        desc: "행사에 필요한 디자인 일체 통합 제작",
        specs: "패키지 90만원~ · 초기 시안 72시간",
        examples: "공공기관 행사, 지자체 축제, 기업 컨퍼런스",
      },
    ],
    faq: [
      {
        q: "부스 시공까지 맡길 수 있나요?",
        a: "네, 파란컴퍼니는 디자인부터 현장 실측, 구조물 제작, 그래픽 출력·설치까지 모두 진행합니다. 협력사와 함께 A/S까지 책임집니다.",
      },
      {
        q: "기존 부스 구조물에 그래픽만 교체할 수 있나요?",
        a: "네, 기존 부스 구조에 맞춰 새로운 그래픽 패널만 디자인·출력·설치하는 것도 가능합니다.",
      },
      {
        q: "패키지에서 필요 없는 품목을 빼거나 교체할 수 있나요?",
        a: "네, 필요한 품목만 선택하거나 교체 가능합니다. 기관 예산과 행사 규모에 맞춰 맞춤 구성합니다.",
      },
      {
        q: "공공기관 행사 디자인을 수의계약으로 진행할 수 있나요?",
        a: "네, 여성기업 인증으로 5,000만 원 이하 수의계약이 가능합니다. 세금계산서·대가산정서 등 서류 일체를 발급합니다.",
      },
    ],
    metaTitle: "전시부스·포토존 디자인 — 박람회 부스 제작·시공",
    metaDescription:
      "전시부스·포토존 디자인 전문. 박람회·전시회 부스를 3D 시뮬레이션부터 시공·설치까지 원스톱. 행사 디자인 통합 패키지, 공공기관 수의계약 가능. 무료 견적.",
    keywords: ["전시부스디자인", "포토존디자인", "부스디자인", "박람회부스", "행사디자인패키지"],
  },
};

/* ── 디자인 페이지 공통 섹션 (parandesign 원본 카피 그대로 이관) ── */

export interface SolutionCard {
  icon: PhosphorIcon;
  kicker: string;
  title: string;
  desc: string;
}
export interface ComparisonRow {
  label: string;
  general: string;
  ours: string;
}
export interface StatItem {
  num: string;
  label: string;
}
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}
export interface ProcessStep {
  badge: string;
  title: string;
  desc: string;
}
export interface GalleryImage {
  src: string;
  alt: string;
}
export interface DesignPainSolution {
  pain: string;
  answer: string;
}
export interface DesignCase {
  client: string;
  event: string;
  badge: string;
  image: string;
  challenge: string;
  solutions: string[];
  result: string;
}

export const DESIGN_COMMON = {
  // parandesign 원본 PAIN POINTS 5종
  painPoints: [
    { num: "01", title: "뭘 써야 할지 모르겠어요", desc: "업체에서는 텍스트를 작성해 달라는데, 뭘 써야 할지 몰라 시간만 보내고 있습니다." },
    { num: "02", title: "제작이 급한데 업체를 못 찾겠어요", desc: "일정은 다가오는데 디자인 업체에 문의하면 일주일 이상 걸린다고 합니다. 시안 3~5일 납품이 가능한 곳이 필요하죠." },
    { num: "03", title: "공공기관 톤을 이해 못 하는 업체가 많아요", desc: "관공서 특유의 격식과 가독성 기준을 모르는 업체에 맡기면 수정만 반복됩니다. 공공기관 경험이 풍부한 업체가 필요합니다." },
    { num: "04", title: "결과물이 기대와 다를까 불안해요", desc: "레퍼런스를 보내도 톤이 안 맞고, 수정을 거듭해도 원하는 방향이 안 나옵니다. 시안 단계에서 1~2안을 비교할 수 있어야 합니다." },
    { num: "05", title: "견적이 불투명하고 추가 비용이 걱정돼요", desc: "처음 안내받은 금액과 최종 청구액이 다른 경험, 한두 번이 아닙니다. 수정 3회 포함, 원본 제공까지 명확한 견적이 필요합니다." },
  ] as { num: string; title: string; desc: string }[],

  // parandesign 원본 솔루션 ("다른 이유") + 공공기관 카드
  solutionCards: [
    { icon: PenNib, kicker: "COPYWRITING", title: "텍스트 기획부터", desc: "주제만 알려주시면 카피라이터가 핵심 문구를 기획합니다. 행사 목적과 타겟에 맞는 카피라이팅으로 메시지 전달력을 높여드립니다." },
    { icon: UsersThree, kicker: "ONE-STOP", title: "기획→디자인→인쇄 원스톱", desc: "기획·디자인·시안·수정·인쇄 연계까지 한 팀이 처음부터 끝까지 책임집니다. 커뮤니케이션 비용이 줄어듭니다." },
    { icon: Lightning, kicker: "FAST DELIVERY", title: "3~5일 빠른 납기", desc: "의뢰 후 3~5일 내 첫 시안을 받아보실 수 있습니다. 급한 일정도 별도 협의로 대응 가능합니다." },
    { icon: Buildings, kicker: "PUBLIC SECTOR", title: "공공기관 250+ 경험", desc: "관공서 격식과 가독성 기준을 압니다. 과업지시서·수의계약 요건을 충족하고 세금계산서·산출내역서 등 서류 일체를 발급합니다." },
  ] as SolutionCard[],

  // parandesign 원본 비교표 6행
  comparisonRows: [
    { label: "텍스트(카피)", general: "담당자 직접 준비", ours: "카피라이터가 기획" },
    { label: "작업 범위", general: "디자인만", ours: "기획 → 디자인 → 인쇄" },
    { label: "공공기관 경험", general: "부족", ours: "250+ 프로젝트 완료" },
    { label: "시안 납품", general: "7~10일", ours: "3~5일" },
    { label: "수정", general: "1~2회 / 추가비용", ours: "3회 포함" },
    { label: "납품 파일", general: "JPG/PDF만", ours: "AI+PSD+PDF 원본 전체" },
  ] as ComparisonRow[],

  // parandesign 원본 실적
  stats: [
    { num: "250+", label: "프로젝트 완료" },
    { num: "90%", label: "재계약률" },
    { num: "8년+", label: "공공기관 전문" },
    { num: "3회", label: "수정 기본 포함" },
  ] as StatItem[],

  clients: ["경기도교육청", "한국예술인복지재단", "대한민국 해군", "서울시", "국립중앙박물관", "한국관광공사", "자동차부품산업진흥재단", "경기도교육연수원"],

  // parandesign 원본 후기 (익명 대표 사례)
  testimonials: [
    { quote: "주제만 던졌는데 카피까지 잡아주시니 우리 쪽은 검토만 하면 되더라고요.", name: "K교육청 교육과 과장", role: "교육 행사 포스터 3건 의뢰" },
    { quote: "급하게 맡겼는데 3일 만에 시안이 왔고, 수정 한 번에 바로 확정됐어요. 일정 맞춰줘서 감사했습니다.", name: "○○시청 주무관", role: "시 행사 홍보물 의뢰" },
    { quote: "공공기관 특유의 격식을 정확히 이해하고 있어서, 설명 없이도 톤이 딱 맞게 나왔습니다.", name: "○○재단 담당자", role: "홍보물 의뢰" },
  ] as Testimonial[],

  // parandesign 원본 프로세스 (D+0 ~ D+7)
  process: [
    { badge: "D+0", title: "의뢰접수", desc: "문의 확인, 요구사항 정리" },
    { badge: "D+1", title: "기획", desc: "카피라이팅, 컨셉 방향 제안" },
    { badge: "D+3~5", title: "시안", desc: "첫 시안 납품, 피드백 수렴" },
    { badge: "D+5~6", title: "수정", desc: "최대 3회 수정 반영" },
    { badge: "D+7", title: "납품", desc: "원본 파일 전달, 인쇄 연계" },
  ] as ProcessStep[],

  /** 고민 ↔ 해결 매핑 (담당자 불안 → 파란컴퍼니의 답) */
  painSolutions: [
    { pain: "뭘 써야 할지 모르겠어요", answer: "주제만 전달 — 카피라이터가 핵심 문구 기획부터 시작" },
    { pain: "제작이 급한데 업체를 못 찾겠어요", answer: "첫 시안 3~5일 납품 — 급한 일정은 별도 협의로 단축" },
    { pain: "공공기관 톤을 이해 못 하는 업체가 많아요", answer: "250건+ 공공기관 작업으로 격식·가독성 기준 숙지 — 설명 없이도 톤 일치" },
    { pain: "결과물이 기대와 다를까 불안해요", answer: "시안 단계 1~2안 비교, 수정 3회 기본 포함" },
    { pain: "견적이 불투명하고 추가 비용이 걱정돼요", answer: "품목별 단가 사이트 공개, AI·PSD·PDF 원본까지 견적서 그대로 제공" },
  ] as DesignPainSolution[],

  // parandesign 원본 보장 뱃지
  guarantees: [
    { title: "수정 3회 보장", desc: "추가 비용 없이 3회 수정" },
    { title: "원본 100% 제공", desc: "AI+PSD+PDF 모든 원본" },
    { title: "만족 보장", desc: "90% 재의뢰율이 증명" },
  ] as { title: string; desc: string }[],
};

/* ── 그룹별 작업 사례 이미지 (parandesign /assets/images 이관본) ── */

const IMG = (cat: string, sub: string, file: string, alt: string): GalleryImage => ({
  src: `/assets/images/${cat}/${sub}/${file}`,
  alt,
});

/* ── 그룹별 대표 사례 (CASE STUDY — 실제 수행 프로젝트 기반) ── */
export const DESIGN_CASE: Record<DesignGroup["key"], DesignCase> = {
  print: {
    client: "경기도교육청",
    event: "찾아가는 경기학부모교육 홍보물",
    badge: "5개 도시 순회 · 인쇄물 6종",
    image: "/assets/images/poster/portfolio/01_poster-2025-gyeonggi-parent-edu1.webp",
    challenge: "성남·고양·수원·남양주·안산 5개 도시 순회 교육 — 포스터부터 명찰까지 인쇄물 전체를 통일 컨셉으로 제작 필요.",
    solutions: [
      "포스터·카드뉴스·리플렛·현수막·명찰·엑스배너 6종 동시 제작",
      "도시별 정보만 교체 — 다섯 차수 모두 일관된 톤 유지",
      "인쇄 연계, 회차별 납품 일정 관리",
    ],
    result: "5개 차수 전 회차 홍보물 일정 내 납품.",
  },
  digital: {
    client: "합동참모본부",
    event: "공식 SNS 콘텐츠 제작",
    badge: "연간 운영 · 카드뉴스·기념일 디자인",
    image: "/assets/images/services/case-jcs-cardnews.webp",
    challenge: "합동참모본부 공식 SNS — 군 기관 격식과 대국민 소통을 모두 만족하는 콘텐츠 연간 제작 필요.",
    solutions: [
      "카드뉴스·기념일 디자인 등 연간 콘텐츠 제작",
      "기관 아이덴티티 가이드에 맞춘 일관된 비주얼",
      "회차별 빠른 시안·피드백 사이클 운영",
    ],
    result: "연간 단위 콘텐츠를 안정적으로 공급.",
  },
  space: {
    client: "경기도교육청",
    event: "KLS 국제학술대회 부스·포토존",
    badge: "약 400명 · 국제행사",
    image: "/assets/images/booth/portfolio/booth-large-2025-kls.webp",
    challenge: "400명 규모 국제학술대회장 부스·포토존 — 도면만으로 결정 불가, 시공 전 완성 모습 확인 필요.",
    solutions: [
      "3D 시뮬레이션으로 시공 전 완성 모습 확인",
      "전시부스·포토존·등신대 그래픽 일체 제작",
      "현장 실측부터 설치·철거까지 직접 진행",
    ],
    result: "행사 당일 변수 없이 설치 완료 — 이듬해 후속 행사 재수주.",
  },
};

export const DESIGN_HERO_IMAGE: Record<DesignGroup["key"], string> = {
  print: "/assets/images/poster/landing/poster-2026-goyang.webp",
  digital: "/assets/images/ppt/landing/ppt-community-energy.webp",
  space: "/assets/images/booth/landing/photozone-2026-international-forum.webp",
};

export const DESIGN_GALLERY: Record<DesignGroup["key"], GalleryImage[]> = {
  print: [
    IMG("poster", "portfolio", "poster-2025-artist-rights1.webp", "포스터 디자인 - 예술인 권리보호 캠페인"),
    IMG("poster", "portfolio", "01_poster-2025-gyeonggi-parent-edu1.webp", "포스터 디자인 - 찾아가는 경기학부모교육"),
    IMG("poster", "portfolio", "poster-2025-goyang-sports-conference.webp", "포스터 디자인 - 고양 학교체육 컨퍼런스"),
    IMG("leaflet", "portfolio", "leaflet-2025-kls.webp", "리플렛 디자인 - KLS 국제학술대회"),
    IMG("leaflet", "portfolio", "leaflet-2025-cultural-arts-club.webp", "리플렛 디자인 - 문화예술동아리"),
    IMG("banner", "portfolio", "banner-2025-kls.webp", "현수막 디자인 - KLS 국제학술대회"),
    IMG("banner", "portfolio", "01_x-banner-2025-artist-rights-edu.webp", "X배너 디자인 - 예술인 권리교육"),
    IMG("catalog", "portfolio", "catalog-forum-proceedings.webp", "자료집 디자인 - 포럼 프로시딩"),
    IMG("catalog", "portfolio", "catalog-kls-site-manual.webp", "자료집 디자인 - KLS 운영 매뉴얼"),
  ],
  digital: [
    IMG("ppt", "portfolio", "infographic-2026-multicultural-plan.webp", "인포그래픽 디자인 - 사업계획 인포그래픽"),
    IMG("card-news", "portfolio", "cardnews-2025-cultural-arts-club.webp", "카드뉴스 디자인 - 문화예술동아리"),
    IMG("card-news", "portfolio", "cardnews-liberation-80th-2025-jcs.webp", "카드뉴스 디자인 - 광복 80주년"),
    IMG("ppt", "portfolio", "01_ppt-community-capacity.webp", "PPT 디자인 - 지역역량강화 발표자료"),
    IMG("ppt", "portfolio", "ppt-auto-parts.webp", "PPT 디자인 - 자동차부품 산업"),
    IMG("ppt", "portfolio", "ppt-navy.webp", "PPT 디자인 - 해군 발표자료"),
    IMG("catalog", "portfolio", "catalog-goyang-essay.webp", "자료집 디자인 - 고양 에세이 공모전 작품집"),
    IMG("catalog", "portfolio", "catalog-community-carbon-proceedings.webp", "자료집 디자인 - 지역사회 탄소중립 자료집"),
  ],
  space: [
    IMG("booth", "portfolio", "booth-2026-arontier-biokorea.webp", "전시부스 디자인 - 아론티어 바이오코리아"),
    IMG("booth", "portfolio", "booth-2025-goyang-sports-conference.webp", "전시부스 디자인 - 고양 학교체육 컨퍼런스"),
    IMG("booth", "portfolio", "01_photozone-2025-goyang.webp", "포토존 디자인 - 고양"),
    IMG("booth", "portfolio", "01_photozone-2026-intl-cooperation-forum.webp", "포토존 디자인 - 중앙아시아 교육협력포럼"),
    IMG("booth", "portfolio", "photozone-2026-intl-cooperation-forum-traditional-experience.webp", "전통체험존 디자인 - 중앙아시아 교육협력포럼"),
    IMG("booth", "portfolio", "photozone-cultural-arts-club.webp", "포토존 디자인 - 문화예술동아리"),
  ],
};
