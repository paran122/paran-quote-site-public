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
    label: "인쇄물 디자인",
    h1: "인쇄물 디자인 — 기획부터 인쇄까지 원스톱",
    intro:
      "포스터·리플렛·배너·카탈로그 등 공공기관 행사·업무용 인쇄물 전문. 주제만 알려주시면 카피라이팅·디자인·인쇄용 파일까지 한 번에 해결합니다. 시안 3~5일, 수정 3회 포함.",
    workFilter: "포스터",
    items: [
      {
        icon: Image,
        anchor: "poster",
        name: "포스터",
        desc: "행사·공모전·축제·공공기관 포스터 전문. 주제만 알려주시면 카피라이팅부터 시작하며, A1·A2·B1·B2 등 표준 규격과 맞춤 사이즈에 대응합니다.",
        specs: "기획+디자인 50만원~ · 시안 3~5일 · 수정 3회 · CMYK 인쇄용 파일 납품",
        examples: "공공기관 포스터, 지자체 행사 안내, 공모전 홍보, 축제·캠페인 포스터",
      },
      {
        icon: BookOpen,
        anchor: "leaflet",
        name: "리플렛·팜플렛",
        desc: "3단접지·4단접지·DL접지·병풍접지 등 모든 접지 방식에 대응합니다. 기본 정보만 전달하시면 목차 구성부터 콘텐츠 기획까지 진행합니다.",
        specs: "기획+디자인 30만원~ · 시안 3~5일 · 수정 3회 · AI+PSD+PDF 원본 납품",
        examples: "사업 소개 팜플렛, 행사 안내 리플렛, 제품 카탈로그",
      },
      {
        icon: Megaphone,
        anchor: "banner",
        name: "배너·현수막",
        desc: "지자체·행사·축제·캠페인용 현수막, X배너, 포디움 전문. 표준 규격(900×90cm, 60×180cm)과 지정게시대 규격에 대응합니다.",
        specs: "기획+디자인 15만원~ · 시안 2~3일 · 수정 3회 · 실사출력 업체 연계 가능",
        examples: "행사 현수막, X배너, 포디움, 캠페인 배너",
      },
      {
        icon: Books,
        anchor: "catalog",
        name: "카탈로그·자료집",
        desc: "4페이지 소책자부터 200페이지 이상 대용량 자료집까지 대응합니다. 무선제본·중철제본·스프링제본·양장제본을 지원하며 목차 기획과 카피라이팅을 포함합니다.",
        specs: "기획+디자인 4만원~/페이지 · 시안 5~7일 · 수정 3회 · 목차 기획+카피라이팅 포함",
        examples: "공공기관 사업보고서, 정책·교육 자료집, 제품·서비스 카탈로그",
      },
    ],
    faq: [
      {
        q: "포스터·배너·카탈로그 사이즈를 지정할 수 있나요?",
        a: "표준 규격은 물론 맞춤 사이즈도 가능합니다. 포스터(A1~A4), 배너(900×90cm~), 카탈로그(20~200페이지)까지 설치 장소와 용도에 맞춰 추천하고 제작합니다.",
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
        q: "수정은 몇 번까지 가능한가요?",
        a: "기본 3회 수정이 포함됩니다. 추가 수정은 건당 별도 비용이 발생하지만, 대부분 3회 이내에 최종 확정됩니다.",
      },
    ],
    metaTitle: "인쇄물 디자인 — 포스터·리플렛·현수막·카탈로그 제작",
    metaDescription:
      "공공기관 행사·업무용 인쇄물 디자인 전문. 포스터·리플렛·현수막·카탈로그를 기획부터 인쇄용 파일까지 원스톱 제작. 시안 3~5일, 수정 3회 포함. 무료 견적.",
    keywords: ["포스터디자인", "리플렛디자인", "현수막디자인", "카탈로그디자인", "인쇄물디자인", "자료집디자인"],
  },
  digital: {
    key: "digital",
    label: "콘텐츠 디자인",
    h1: "콘텐츠 디자인 — 카드뉴스·PPT 제작",
    intro:
      "SNS 카드뉴스와 발표용 PPT로 행사·사업 소식을 효과적으로 전달하세요. 기획부터 디자인까지 신속 납품으로 공공기관·기업의 홍보와 보고를 지원합니다. 시안 2~3일, 모든 플랫폼 규격 대응.",
    workFilter: "카드뉴스",
    items: [
      {
        icon: DeviceMobile,
        anchor: "card-news",
        name: "카드뉴스·SNS 콘텐츠",
        desc: "공공기관·기업 SNS 정보형·홍보형 카드뉴스 전문. 인스타그램(1:1), 블로그(960×960px), 페이스북(1200×628px) 등 플랫폼별 최적 사이즈를 제공합니다.",
        specs: "기획+디자인 10만원~/장 · 시안 2~3일 · 수정 3회 · JPG/PNG/PDF 납품",
        examples: "정부·지자체 SNS 공지, 기업 상품·서비스 홍보, 캠페인 정보 전달, 뉴스형 카드",
      },
      {
        icon: Presentation,
        anchor: "ppt",
        name: "PPT 디자인·발표자료",
        desc: "사업보고서·제안서·컨퍼런스·세미나 발표 자료 전문. 슬라이드 구성 기획부터 인포그래픽·차트 디자인까지 포함합니다.",
        specs: "기획+디자인 5만원~/장 · 시안 3~5일 · 수정 3회 · 편집 가능 PPTX + 인쇄용 PDF 납품",
        examples: "공공기관 사업보고, 기업 제안서, 정책 발표 자료, 세미나 강의 자료",
      },
    ],
    faq: [
      {
        q: "카드뉴스·PPT 가격은 어떻게 되나요?",
        a: "카드뉴스는 장당 10만원~, PPT는 장당 5만원~부터 시작합니다. 장수와 콘텐츠 복잡도에 따라 조정되며, 정확한 견적은 상담 후 안내드립니다.",
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
    metaTitle: "콘텐츠 디자인 — 카드뉴스·PPT 발표자료 제작",
    metaDescription:
      "카드뉴스·PPT 콘텐츠 디자인 전문. SNS 카드뉴스와 발표자료를 기획부터 디자인까지 신속 제작. 플랫폼별 규격 대응, 수정 3회 포함. 무료 견적.",
    keywords: ["카드뉴스디자인", "PPT디자인", "발표자료디자인", "SNS콘텐츠", "인포그래픽"],
  },
  space: {
    key: "space",
    label: "공간 디자인",
    h1: "공간 디자인 — 전시부스·행사 패키지",
    intro:
      "박람회·전시회·공공행사 전시부스와 이벤트 포토존 디자인·시공 전문. 부스 카피 기획부터 3D 시뮬레이션, 시공 도면 제공까지 원스톱으로 진행하며 현장 실측과 설치까지 지원합니다.",
    workFilter: "전시부스",
    items: [
      {
        icon: Cube,
        anchor: "booth",
        name: "전시부스·포토존",
        desc: "1부스(3×3m)부터 대형 부스까지 모든 규모에 대응합니다. 박람회·전시회·코엑스·킨텍스 등 전시장 배치도에 맞춰 최적 디자인을 제안합니다.",
        specs: "기획+디자인 60만원~ · 시안 5~7일 · 수정 3회 · 3D 시뮬레이션 + 시공도면 제공",
        examples: "박람회 전시부스, 공공기관 행사부스, 포토존 설치, 구조물 포함 대형 부스",
      },
      {
        icon: Package,
        anchor: "package",
        name: "행사 디자인 통합 패키지",
        desc: "포스터·현수막·배너·PPT·리플렛·카드뉴스·명찰·팜플렛 등 행사에 필요한 모든 디자인을 통합 제작합니다. 맞춤 구성으로 필요한 품목만 선택할 수 있습니다.",
        specs: "LIGHT 90만원 / STANDARD 190만원 / PREMIUM 380만원 · 초기 시안 72시간 · 여성기업 수의계약 가능",
        examples: "공공기관 행사 전체 디자인, 지자체 축제·캠페인, 기업 컨퍼런스·세미나",
      },
    ],
    faq: [
      {
        q: "부스 시공까지 맡길 수 있나요?",
        a: "네, 디자인부터 현장 실측, 구조물 제작, 그래픽 출력·설치까지 모두 진행합니다. 협력사와 함께 A/S까지 책임집니다.",
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
    metaTitle: "공간 디자인 — 전시부스·행사 디자인 패키지 제작",
    metaDescription:
      "전시부스·포토존·행사 디자인 통합 패키지 전문. 3D 시뮬레이션부터 시공·설치까지 원스톱. 공공기관 수의계약 가능, 수정 3회 포함. 무료 견적.",
    keywords: ["전시부스디자인", "포토존디자인", "행사디자인패키지", "부스시공", "공공기관디자인"],
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

export const DESIGN_HERO_IMAGE: Record<DesignGroup["key"], string> = {
  print: "/assets/images/poster/landing/poster-2026-goyang.webp",
  digital: "/assets/images/ppt/landing/ppt-navy.webp",
  space: "/assets/images/booth/landing/booth-experience-2025-kls.webp",
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
    IMG("card-news", "portfolio", "cardnews-2025-artist-rights-edu.webp", "카드뉴스 디자인 - 예술인 권리교육"),
    IMG("card-news", "portfolio", "cardnews-2025-cultural-arts-club.webp", "카드뉴스 디자인 - 문화예술동아리"),
    IMG("card-news", "portfolio", "cardnews-jcs-founding-2025-jcs-sns.webp", "카드뉴스 디자인 - 창립기념 SNS"),
    IMG("card-news", "portfolio", "cardnews-liberation-80th-2025-jcs.webp", "카드뉴스 디자인 - 광복 80주년"),
    IMG("ppt", "portfolio", "01_ppt-community-capacity.webp", "PPT 디자인 - 지역역량강화 발표자료"),
    IMG("ppt", "portfolio", "01_ppt-outreach.webp", "PPT 디자인 - 찾아가는 사업 보고"),
    IMG("ppt", "portfolio", "ppt-auto-parts.webp", "PPT 디자인 - 자동차부품 산업"),
    IMG("ppt", "portfolio", "ppt-navy.webp", "PPT 디자인 - 해군 발표자료"),
  ],
  space: [
    IMG("booth", "portfolio", "01_booth-experience-2025-kls.webp", "전시부스 디자인 - KLS 체험부스"),
    IMG("booth", "portfolio", "booth-large-2025-kls.webp", "대형 전시부스 디자인 - KLS"),
    IMG("booth", "portfolio", "booth-2025-goyang-sports-conference.webp", "전시부스 디자인 - 고양 학교체육 컨퍼런스"),
    IMG("booth", "portfolio", "01_photozone-2025-goyang.webp", "포토존 디자인 - 고양"),
    IMG("booth", "portfolio", "01_photozone-2026-intl-cooperation-forum.webp", "포토존 디자인 - 중앙아시아 교육협력포럼"),
    IMG("booth", "portfolio", "photozone-cultural-arts-club.webp", "포토존 디자인 - 문화예술동아리"),
  ],
};
