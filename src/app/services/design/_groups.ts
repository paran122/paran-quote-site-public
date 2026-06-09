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
    label: "디지털 디자인",
    h1: "디지털 디자인 — 카드뉴스·PPT 콘텐츠 제작",
    intro:
      "카드뉴스(SNS 콘텐츠)와 PPT(발표자료) 제작으로 온라인·오프라인 소통을 강화하세요. 기획부터 디자인까지 신속 납품으로 공공기관·기업의 대외 활동을 지원합니다. 시안 2~3일, 모든 플랫폼 규격 대응.",
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
    metaTitle: "디지털 디자인 — 카드뉴스·PPT 발표자료 제작",
    metaDescription:
      "카드뉴스·PPT 디지털 콘텐츠 디자인 전문. SNS 카드뉴스와 발표자료를 기획부터 디자인까지 신속 제작. 플랫폼별 규격 대응, 수정 3회 포함. 무료 견적.",
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

/* ── 디자인 페이지 공통 섹션 (전 그룹 공유) ── */

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

export const DESIGN_COMMON = {
  painPoints: [
    { num: "01", title: "맥락 설명이 번거롭다", desc: "디자인 업체에 행사 목적·대상·분위기를 매번 처음부터 설명해야 합니다." },
    { num: "02", title: "기획 의도와 따로 논다", desc: "막상 받은 시안이 기획서의 방향과 어긋나 처음부터 다시 잡는 경우가 많습니다." },
    { num: "03", title: "수정마다 추가 비용", desc: "한두 번 고치는데도 건당 비용이 붙어 예산이 계속 늘어납니다." },
    { num: "04", title: "제작물 톤이 제각각", desc: "포스터·현수막·자료집을 다른 곳에 맡기면 행사 전체의 톤이 흐트러집니다." },
    { num: "05", title: "공공기관 요건을 모른다", desc: "과업지시서 규격, 수의계약·정산 서류를 업체가 챙기지 못해 담당자가 떠안습니다." },
  ] as { num: string; title: string; desc: string }[],

  solutionCards: [
    { icon: PenNib, kicker: "ONE TEAM", title: "기획과 디자인이 한 팀", desc: "행사 컨셉이 확정되면 바로 디자인에 들어갑니다. 별도 브리핑이 필요 없고, 기획 변경이 실시간으로 시안에 반영됩니다." },
    { icon: UsersThree, kicker: "IN-HOUSE", title: "자체 디자인팀 보유", desc: "외주가 아닌 내부 디자인팀이 작업합니다. 커뮤니케이션 비용이 0이고, 수정은 1영업일 이내로 빠릅니다." },
    { icon: Buildings, kicker: "PUBLIC SECTOR", title: "공공기관 250+ 경험", desc: "과업지시서 규격, 수의계약·조달 요건을 이미 압니다. 세금계산서·산출내역서 등 서류 일체를 발급합니다." },
    { icon: Lightning, kicker: "ONE-STOP", title: "인쇄·제작까지 원스톱", desc: "디자인 파일 납품은 물론 인쇄물 제작과 행사장 배송까지 한 번에 처리해 담당자의 업무 부담을 줄입니다." },
  ] as SolutionCard[],

  comparisonRows: [
    { label: "행사 맥락 이해", general: "매번 처음부터 설명", ours: "기획팀이 직접 진행" },
    { label: "수정 비용", general: "건당 추가 청구", ours: "기본 3회 무료 포함" },
    { label: "제작물 톤 통일", general: "업체마다 제각각", ours: "행사 전체 톤 통일" },
    { label: "수정 반영 속도", general: "수일 소요", ours: "1영업일 이내" },
    { label: "공공기관 서류", general: "별도 요청 필요", ours: "세금계산서·산출내역서 발급" },
  ] as ComparisonRow[],

  stats: [
    { num: "250+", label: "누적 프로젝트" },
    { num: "자체", label: "디자인팀 보유" },
    { num: "3회", label: "수정 기본 포함" },
    { num: "1영업일", label: "수정 반영" },
  ] as StatItem[],
};
