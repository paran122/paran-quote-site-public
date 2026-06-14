import {
  Globe,
  BookBookmark,
  Megaphone,
  Monitor,
  GraduationCap,
  Handshake,
  Tent,
  CalendarCheck,
  Cube,
  Camera,
  Storefront,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/* ── 행사 서비스 페이지 (디자인 페이지와 동일 구조로 통일) ── */

export interface EventLineupItem {
  icon: PhosphorIcon;
  name: string;
  desc: string;
  examples: string;
}

export interface EventService {
  key: "conference" | "education" | "booth" | "government";
  label: string;
  h1: string;
  intro: string;
  badges: string[];
  /** 히어로/하단 CTA — 수행 사례 딥링크 */
  workHref: string;
  /** JSON-LD */
  serviceType: string;
  price: string;
  priceNote: string;
  /** 대행 항목 (LINEUP) */
  lineup: EventLineupItem[];
  faq: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

/* 공유 타입 (디자인 _groups.ts와 동일 형태) */
export interface EventComparisonRow {
  label: string;
  general: string;
  ours: string;
}
export interface EventStatItem {
  num: string;
  label: string;
}
export interface EventTestimonial {
  quote: string;
  name: string;
  role: string;
}
export interface EventProcessStep {
  badge: string;
  title: string;
  desc: string;
}
export interface EventGalleryImage {
  src: string;
  alt: string;
  /** 실명 캡션 — 행사명 / 발주 기관 / 규모 */
  event: string;
  client: string;
  meta?: string;
}
export interface EventPainSolution {
  pain: string;
  answer: string;
}
export interface EventCase {
  client: string;
  event: string;
  /** 규모·기간 등 한 줄 배지 */
  badge: string;
  image: string;
  challenge: string;
  solutions: string[];
  result: string;
}

const SB = "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/qs-portfolio";

/* ── 행사 대행 공통 섹션 (전 서비스 공유) ── */
export const EVENT_COMMON = {
  /** 고민 ↔ 해결 매핑 (담당자 불안 → 파란컴퍼니의 답) */
  painSolutions: [
    { pain: "본업과 병행하기엔 손이 부족해요", answer: "기획·시안물 제작·현장 운영·결과보고까지 한 팀이 전담 — 담당자는 검토만" },
    { pain: "기획·디자인·운영을 따로 맡기니 손발이 안 맞아요", answer: "자체 디자인팀이 행사당 6~9종 시안물 직접 제작 — 외주 없이 컨셉 일관" },
    { pain: "행정·정산 서류가 막막해요", answer: "산출내역서·결과보고서·참석자명부·사진대지 기본 제공 — 250건+ 공공 행사로 감사 기준 숙지" },
    { pain: "당일 현장에서 사고가 날까 불안해요", answer: "운영 매뉴얼·시나리오 사전 작성, 리허설 점검 후 당일 진행" },
    { pain: "견적이 불투명하고 추가 비용이 걱정돼요", answer: "항목별 단가 사이트 공개 — 견적서에 없는 비용 청구 없음" },
  ] as EventPainSolution[],

  comparisonRows: [
    { label: "작업 범위", general: "현장 운영만", ours: "기획 → 디자인 → 운영 → 결과보고" },
    { label: "디자인", general: "외주 의뢰", ours: "자체 디자인팀 (6~9종)" },
    { label: "공공기관 경험", general: "부족", ours: "250+ 프로젝트 · 수의계약·입찰" },
    { label: "행정 서류", general: "별도 비용/미제공", ours: "산출내역서·결과보고서 기본 제공" },
    { label: "현장 운영", general: "협력사 의존", ours: "직접 운영 · 사전 리허설" },
    { label: "견적", general: "추가 비용 빈번", ours: "항목별 투명 견적" },
  ] as EventComparisonRow[],

  stats: [
    { num: "250+", label: "프로젝트 완료" },
    { num: "90%", label: "재계약률" },
    { num: "93점", label: "참가자 만족도" },
    { num: "8년+", label: "공공기관 전문" },
  ] as EventStatItem[],

  clients: ["교육부", "대한민국 해군", "경기도교육청", "수원시", "고양시", "한국에너지정보문화재단", "자동차부품산업진흥재단", "한국문화예술교육진흥원"],

  testimonials: [
    { quote: "기획부터 디자인, 현장까지 한 팀이 맡아주니 저희는 검토만 하면 됐어요. 손이 정말 덜 갔습니다.", name: "K교육청 주무관", role: "교육 행사 대행 의뢰" },
    { quote: "결과보고서와 정산 서류를 빠짐없이 챙겨주셔서 감사 대비가 수월했습니다. 공공기관 행사 경험이 확실히 다르더라고요.", name: "○○시청 담당자", role: "시 행사 대행 의뢰" },
    { quote: "당일 현장이 정말 매끄러웠어요. 사전 리허설 덕분에 진행에 사고가 하나도 없었습니다.", name: "○○재단 사무국", role: "포럼·세미나 대행 의뢰" },
  ] as EventTestimonial[],

  process: [
    { badge: "STEP 1", title: "의뢰·기획", desc: "요구사항 정리, 행사 컨셉·프로그램 기획" },
    { badge: "STEP 2", title: "디자인·섭외", desc: "시안물 제작, 연사·장소·장비 섭외" },
    { badge: "STEP 3", title: "준비·제작", desc: "제작물 출력, 참가자 관리, 리허설 준비" },
    { badge: "STEP 4", title: "현장 운영", desc: "음향·조명·영상 세팅, 당일 진행·의전" },
    { badge: "STEP 5", title: "결과보고", desc: "결과보고서·정산 서류·사진대지 납품" },
  ] as EventProcessStep[],

  guarantees: [
    { title: "여성기업 수의계약", desc: "5천만 원 이하 수의계약 가능" },
    { title: "행정 서류 일체", desc: "산출내역서·결과보고서 기본" },
    { title: "재계약률 90%", desc: "다시 찾는 만족도가 증명" },
  ] as { title: string; desc: string }[],
};

/* ── 서비스별 히어로 이미지 (검증된 portfolio 사진) ── */
export const EVENT_HERO_IMAGE: Record<EventService["key"], string> = {
  conference: "/assets/images/services/hero-conference-auto-seminar.webp",
  education: "/assets/images/services/hero-education-community.webp",
  booth: "/assets/images/services/hero-booth-nhis.webp",
  government: `${SB}/goyang-conference/photo-10.webp`,
};

/* ── 서비스별 수행 사례 갤러리 (검증된 portfolio 사진 + 실명 캡션) ── */
export const EVENT_GALLERY: Record<EventService["key"], EventGalleryImage[]> = {
  conference: [
    { src: `${SB}/kls/photo-03.webp`, alt: "컨퍼런스 대행 - KLS 한국어교육 국제학술대회 현장", event: "KLS 한국어교육 국제학술대회", client: "경기도교육청", meta: "약 400명" },
    { src: `${SB}/kls/photo-10.webp`, alt: "학술대회 대행 - KLS 행사장 전경", event: "KLS 국제학술대회 행사장 전경", client: "경기도교육청", meta: "약 400명" },
    { src: `${SB}/international-forum/photo-05.webp`, alt: "포럼 대행 - 중앙아시아 교육협력포럼", event: "중앙아시아 교육협력포럼", client: "경기도교육청", meta: "약 300명" },
    { src: "/assets/images/services/conf-goyang-essay.webp", alt: "컨퍼런스 대행 - 고양 학교체육 성장 컨퍼런스 에세이 전시", event: "고양 학교체육 성장 컨퍼런스", client: "고양교육청", meta: "약 200명" },
    { src: `${SB}/auto-seminar-fall/photo-02.webp`, alt: "세미나 대행 - 추계 자동차부품산업 세미나", event: "추계 자동차부품산업 세미나", client: "자동차부품산업진흥재단", meta: "약 200명" },
    { src: `${SB}/auto-seminar-summer/photo-01.webp`, alt: "세미나 대행 - 하계 자동차부품산업 세미나", event: "하계 자동차부품산업 세미나", client: "자동차부품산업진흥재단", meta: "약 200명" },
  ],
  education: [
    { src: "/assets/images/services/edu-community-busan.webp", alt: "교육 대행 - 지역사회 역량강화 프로그램 현장 단체사진", event: "지역사회 역량강화 프로그램", client: "한국에너지정보문화재단", meta: "약 100명" },
    { src: "/assets/images/services/edu-community-lecture.webp", alt: "교육 대행 - 지역사회 역량강화 강연 세션", event: "지역사회 역량강화 강연 세션", client: "한국에너지정보문화재단", meta: "약 100명" },
    { src: "/assets/images/services/edu-parent-lecture.webp", alt: "교육 대행 - 찾아가는 경기학부모교육 강연", event: "찾아가는 경기학부모교육", client: "경기도교육청", meta: "5개 도시 순회" },
    { src: `${SB}/parent-education/photo-17.webp`, alt: "교육 대행 - 찾아가는 경기학부모교육 현장", event: "찾아가는 경기학부모교육 현장", client: "경기도교육청", meta: "회당 약 150명" },
    { src: `${SB}/navy-camp/photo-01.webp`, alt: "캠프 대행 - 필승해군캠프", event: "필승해군캠프", client: "대한민국 해군", meta: "약 300명" },
    { src: "/assets/images/services/edu-artist-rights.webp", alt: "교육 대행 - 예술인 권리보호 교육 강의", event: "예술인 권리보호 교육", client: "한국예술인복지재단", meta: "약 100명" },
  ],
  booth: [
    { src: "/assets/images/services/booth-kls-experience.webp", alt: "체험부스 운영 - KLS 국제학술대회 체험부스", event: "KLS 국제학술대회 체험부스", client: "경기도교육청" },
    { src: "/assets/images/services/booth-goyang-wall.webp", alt: "전시월 - 고양 학교체육 컨퍼런스", event: "고양 학교체육 컨퍼런스", client: "고양교육청" },
    { src: "/assets/images/services/booth-forum-culture.webp", alt: "전통문화 체험존 - 중앙아시아 교육협력 포럼", event: "중앙아시아 교육협력 포럼", client: "경기도교육청" },
    { src: "/assets/images/services/booth-council-kls.webp", alt: "전시부스 - 교육감협의회 부스 설치", event: "교육감협의회 부스 설치", client: "경기도교육청" },
    { src: "/assets/images/services/booth-incheon-metaverse.webp", alt: "체험부스 - 인천공항 메타버스 체험부스", event: "인천공항 메타버스 체험부스", client: "국립온라인과학관" },
    { src: "/assets/images/services/booth-science-class.webp", alt: "체험부스 운영 - 찾아가는 과학교실", event: "찾아가는 과학교실 운영", client: "국립온라인과학관" },
  ],
  government: [
    { src: `${SB}/goyang-conference/photo-10.webp`, alt: "공공기관 행사 대행 - 고양 학교체육 컨퍼런스", event: "고양 학교체육 성장 컨퍼런스", client: "고양교육청", meta: "약 200명" },
    { src: `${SB}/kls/photo-12.webp`, alt: "공공기관 행사 대행 - KLS 국제학술대회", event: "KLS 한국어교육 국제학술대회", client: "경기도교육청", meta: "약 400명" },
    { src: `${SB}/community-energy/photo-12.webp`, alt: "공공기관 행사 대행 - 지역사회 역량강화", event: "지역사회 역량강화 프로그램", client: "한국에너지정보문화재단", meta: "약 100명" },
    { src: `${SB}/navy-camp/photo-16.webp`, alt: "공공기관 행사 대행 - 필승해군캠프", event: "필승해군캠프", client: "대한민국 해군", meta: "약 300명" },
    { src: `${SB}/parent-education/photo-17.webp`, alt: "관공서 행사 대행 - 찾아가는 경기학부모교육", event: "찾아가는 경기학부모교육", client: "경기도교육청", meta: "5개 도시 순회" },
    { src: `${SB}/kls/photo-07.webp`, alt: "공공기관 행사 대행 - KLS 전시 부스", event: "KLS 국제학술대회 부스 운영", client: "경기도교육청" },
  ],
};

/* ── 실적 섹션 현장 사진 스트립 (갤러리와 중복되지 않는 검증 사진) ── */
export const EVENT_STRIP: Record<EventService["key"], EventGalleryImage[]> = {
  conference: [
    { src: "/assets/images/services/conf-goyang-students.webp", alt: "고양 학교체육 성장 컨퍼런스 참가 학생들", event: "고양 학교체육 성장 컨퍼런스", client: "고양교육청" },
    { src: `${SB}/international-forum/photo-07.webp`, alt: "중앙아시아 교육협력포럼 현장", event: "중앙아시아 교육협력포럼", client: "경기도교육청" },
    { src: `${SB}/auto-seminar-spring/photo-06.webp`, alt: "춘계 자동차부품산업 세미나 현장", event: "춘계 자동차부품산업 세미나", client: "자동차부품산업진흥재단" },
    { src: `${SB}/auto-seminar-spring/photo-12.webp`, alt: "춘계 자동차부품산업 세미나 진행", event: "춘계 자동차부품산업 세미나", client: "자동차부품산업진흥재단" },
  ],
  education: [
    { src: `${SB}/community-energy/photo-15.webp`, alt: "지역사회 역량강화 워크숍", event: "지역사회 역량강화", client: "한국에너지정보문화재단" },
    { src: `${SB}/community-energy/photo-06.webp`, alt: "지역사회 역량강화 케이터링", event: "지역사회 역량강화", client: "한국에너지정보문화재단" },
    { src: "/assets/images/services/edu-community-seminar.webp", alt: "지역사회 역량강화 교육 세미나 현장", event: "지역사회 역량강화 세미나", client: "한국에너지정보문화재단" },
    { src: "/assets/images/services/edu-energy-village.webp", alt: "지역사회 에너지 교육 - 에너지자립마을 견학", event: "에너지자립마을 견학 교육", client: "한국에너지정보문화재단" },
  ],
  booth: [
    { src: "/assets/images/services/strip-namwon-festival.webp", alt: "남원 동동동화축제 야외 행사 운영", event: "남원 동동동화축제", client: "남원시청" },
    { src: "/assets/images/services/strip-incheon-vr.webp", alt: "인천국제공항 온라인과학관 VR 체험존 운영", event: "인천공항 온라인과학관 홍보부스", client: "국립온라인과학관" },
    { src: "/assets/images/services/strip-daejeon-metaply.webp", alt: "대전사이언스페스티벌 메타플리 체험존 부스", event: "대전사이언스페스티벌 체험존", client: "국립온라인과학관" },
    { src: "/assets/images/services/strip-culture-club.webp", alt: "문화예술클럽 결과공유회 전시월", event: "문화예술클럽 결과공유회", client: "한국문화예술교육진흥원" },
  ],
  government: [
    { src: `${SB}/kls/photo-03.webp`, alt: "KLS 국제학술대회 현장", event: "KLS 국제학술대회", client: "경기도교육청" },
    { src: `${SB}/international-forum/photo-05.webp`, alt: "중앙아시아 교육협력포럼 현장", event: "중앙아시아 교육협력포럼", client: "경기도교육청" },
    { src: `${SB}/community-energy/photo-01.webp`, alt: "지역사회 역량강화 현장", event: "지역사회 역량강화", client: "한국에너지정보문화재단" },
    { src: `${SB}/parent-education/photo-15.webp`, alt: "찾아가는 경기학부모교육 현장", event: "찾아가는 경기학부모교육", client: "경기도교육청" },
  ],
};

/* ── 서비스별 대표 사례 (CASE STUDY — 실제 수행 프로젝트 기반) ── */
export const EVENT_CASE: Record<EventService["key"], EventCase> = {
  conference: {
    client: "경기도교육청",
    event: "KLS 한국어교육 국제학술대회",
    badge: "약 400명 · 국제행사",
    image: "/assets/images/services/case-kls-hall.webp",
    challenge: "해외 연사·참가자 400명 규모 국제학술대회 — 기획, 공간 연출, 영상 송출, 현장 진행까지 전 영역 한 팀 전담 필요.",
    solutions: [
      "운영 매뉴얼·진행 시나리오 사전 작성, 리허설 점검",
      "전시부스·포토존 등 공간 연출, 시안물 9종 자체 제작",
      "현장 영상 송출(PIP)·음향 등 시스템 직접 운영",
    ],
    result: "행사 종료 후 결과보고서 납품까지 완료 — 이듬해 KLS 후속 워크숍 운영 재수주.",
  },
  education: {
    client: "경기도교육청",
    event: "찾아가는 경기학부모교육",
    badge: "성남·고양·수원·남양주·안산 5개 도시 · 회당 약 150명",
    image: "/assets/images/services/case-parent-edu.webp",
    challenge: "5개 도시 순회 교육 행사 — 도시·장소가 바뀌어도 매 회차 동일 품질 운영 필요.",
    solutions: [
      "공통 운영 매뉴얼 기반 — 도시가 바뀌어도 같은 기준 운영",
      "포스터·카드뉴스·리플렛·현수막·명찰·엑스배너 6종 홍보물 자체 제작",
      "회차별 참가자 관리, 현장 운영 인력 배치",
    ],
    result: "5개 차수 전 일정 무사고 완수, 결과보고까지 완료.",
  },
  booth: {
    client: "아론티어",
    event: "기업 홍보부스 운영",
    badge: "바이오코리아 2026 · 코엑스 · 조립부스",
    image: "/assets/images/services/case-arontier-booth.webp",
    challenge: "AI 신약개발 기업의 바이오코리아 참가 — 행사 3주 전 의뢰, 부스 그래픽부터 홍보물까지 촉박한 일정 내 제작 필요.",
    solutions: [
      "족자봉 커버(3패널 연결형)·벽면 랩핑·X배너 등 부스 그래픽 일체 디자인",
      "3단 리플렛·A4 전단 4종 제작 — 도표·인포그래픽 리디자인 포함 급행 진행",
      "코엑스 현장 설치까지 완료",
    ],
    result: "행사 일정 내 납품·설치 완료 — 리플렛 추가 의뢰에 이어 후속 행사(광교 양자바이오서밋)까지 연이어 수주.",
  },
  government: {
    client: "경기도교육청",
    event: "중앙아시아 교육협력포럼",
    badge: "약 300명 · 국제 포럼",
    image: `${SB}/international-forum/photo-05.webp`,
    challenge: "국제 교육협력 포럼 — 공공기관 조달 기준에 맞춘 기획부터 정산까지 전 과정 수행.",
    solutions: [
      "포스터·자료집·전시부스·포토존 등 시안물 9종 자체 제작",
      "행사 기획·연출, 현장 운영 인력 배치",
      "산출내역서·결과보고서 등 행정 서류 일체 제공",
    ],
    result: "같은 기관의 다문화교육 국제학술대회 연이어 수주 — 재계약이 만족도의 증거.",
  },
};

/* ── 서비스별 데이터 ── */
export const EVENT_SERVICES: Record<EventService["key"], EventService> = {
  conference: {
    key: "conference",
    label: "컨퍼런스·세미나",
    h1: "컨퍼런스·세미나·포럼 대행",
    intro:
      "학술대회·국제 컨퍼런스·정책 포럼·세미나를 기획부터 운영까지 원스톱 대행. 연사 섭외, 동시통역, 하이브리드 중계, 자료집 제작까지 한 팀이 전담.",
    badges: ["연사 섭외·동시통역", "하이브리드 중계", "자료집·명찰 제작"],
    workHref: "/work?view=event&category=컨퍼런스·세미나",
    serviceType: "Conference Planning",
    price: "25000000",
    priceNote: "중규모 컨퍼런스(100~200명) 2,500만 원부터, 대규모 포럼(300명 이상) 5,000만 원부터",
    lineup: [
      { icon: Globe, name: "국제 컨퍼런스", desc: "동시통역·VIP 의전·네트워킹 세션 포함 국내외 연사 초청 행사 기획·운영", examples: "국제 컨퍼런스, 글로벌 포럼, 해외 연사 초청 행사" },
      { icon: BookBookmark, name: "학술대회·심포지엄", desc: "논문 발표·포스터 세션 운영, 참가자 등록 시스템 지원", examples: "학회 학술대회, 연구 심포지엄, 논문 발표회" },
      { icon: Megaphone, name: "세미나·정책 포럼", desc: "전문 사회자 섭외, 토론 패널 구성, 속기록 서비스 제공", examples: "정책 포럼, 전문 세미나, 공청회, 토론회" },
      { icon: Monitor, name: "하이브리드 컨퍼런스", desc: "실시간 영상 중계, 온라인 참가자 관리·Q&A 운영", examples: "온·오프라인 동시 행사, 실시간 중계 세미나" },
    ],
    faq: [
      { q: "컨퍼런스·세미나 대행 비용은 얼마인가요?", a: "파란컴퍼니 기준 중규모 컨퍼런스(100~200명)는 약 2,500만 원부터, 300명 이상 대규모 포럼은 약 5,000만 원부터 시작합니다. 연사 섭외, 동시통역, 하이브리드 운영 여부에 따라 달라지며, 상세 견적서를 제공합니다." },
      { q: "하이브리드(온·오프라인) 행사도 가능한가요?", a: "네, 온라인 실시간 중계와 오프라인 행사를 동시에 운영하는 하이브리드 컨퍼런스를 지원합니다. 영상 중계 세팅, 온라인 참가자 관리, 실시간 Q&A 운영까지 포함됩니다." },
      { q: "국제 컨퍼런스 동시통역도 가능한가요?", a: "네, 영어·중국어·일본어 등 동시통역 서비스를 제공합니다. 통역 장비 세팅, 전문 통역사 섭외, 발표 자료 번역 등을 지원합니다." },
      { q: "준비 기간은 얼마나 필요한가요?", a: "100명 규모는 최소 6~8주, 300명 이상 대규모 행사는 최소 10~12주 전 의뢰를 권장합니다. 연사 섭외, 장소 예약, 프로그램 구성, 홍보물 제작 등을 고려한 기간입니다." },
      { q: "컨퍼런스 대행 업체는 어떻게 선택해야 하나요?", a: "컨퍼런스 대행 업체를 고를 때는 ① 유사 규모·유형의 학술대회·국제 컨퍼런스 실적, ② 기획·디자인·운영을 한 팀이 전담하는지(외주 분산 여부), ③ 동시통역·하이브리드 중계 등 기술 운영 역량, ④ 결과보고서까지 책임지는지를 확인하는 것이 좋습니다. 파란컴퍼니는 KLS 국제학술대회(약 400명) 등 다수 실적을 기획부터 결과보고까지 한 팀이 전담합니다." },
    ],
    metaTitle: "컨퍼런스 대행 업체 — 학술대회·세미나·포럼 기획 운영 전문",
    metaDescription:
      "컨퍼런스 대행 업체를 찾으신다면. 학술대회·세미나·심포지엄·국제 컨퍼런스·정책 포럼을 기획부터 운영까지 원스톱 대행하는 전문 에이전시입니다. 하이브리드·동시통역 지원, KLS 국제학술대회 등 다수 실적. 무료 견적.",
    keywords: ["컨퍼런스 대행 업체", "컨퍼런스 대행", "컨퍼런스 대행사", "세미나 대행 업체", "컨퍼런스대행", "세미나대행", "포럼대행", "학술대회대행", "행사대행", "컨퍼런스기획", "세미나기획", "심포지엄"],
  },

  education: {
    key: "education",
    label: "교육·워크숍",
    h1: "워크숍·교육행사 대행",
    intro:
      "임직원 연수, 역량강화 워크숍, 직무교육, 청소년 캠프를 기획부터 운영까지 원스톱 대행. 커리큘럼 설계, 강사 섭외, 교재 제작, 현장 운영까지 한 팀이 전담.",
    badges: ["커리큘럼 설계", "강사·퍼실리테이터 섭외", "교재·워크북 제작"],
    workHref: "/work?view=event&category=교육·워크숍",
    serviceType: "Education Workshop Planning",
    price: "6000000",
    priceNote: "소규모 교육·워크숍(30~50명) 600만 원부터, 중규모 연수(100~200명) 2,000만 원부터",
    lineup: [
      { icon: GraduationCap, name: "임직원 교육·연수", desc: "커리큘럼 설계부터 강사 섭외, 교육 자료 제작까지 지원", examples: "임직원 연수, 직무교육, 신규자 교육, 공무원 연수" },
      { icon: Handshake, name: "참여형 워크숍·팀빌딩", desc: "퍼실리테이터 섭외·도구 준비 포함 참여형 워크숍 설계", examples: "팀빌딩 워크숍, 아이디어 워크숍, 조직활성화" },
      { icon: Tent, name: "캠프·수련회·체험", desc: "숙박·이동·안전 관리 포함 체험형 프로그램 현장 운영", examples: "청소년 캠프, 임직원 수련회, 체험 프로그램" },
      { icon: CalendarCheck, name: "정기 교육·시리즈", desc: "연간 계획 수립부터 회차별 운영, 만족도 추적까지 지속 관리", examples: "정기 교육, 연간 연수 시리즈, 역량강화 과정" },
    ],
    faq: [
      { q: "교육·워크숍 대행 비용은 얼마인가요?", a: "파란컴퍼니 기준 소규모 교육·워크숍(30~50명)은 약 600만 원부터, 100명 이상 연수는 약 1,200만 원부터 시작합니다. 무대·음향 장비가 컨퍼런스보다 가볍게 들어가 비용 부담이 적으며, 강사 섭외·교육자료 제작·현장 운영 범위에 따라 달라집니다." },
      { q: "워크숍 프로그램·커리큘럼 설계도 해주시나요?", a: "네, 교육 목표에 맞는 커리큘럼을 직접 설계합니다. 참여형 활동, 그룹 토론, 실습 세션, 팀빌딩 등을 포함한 맞춤 프로그램을 제안하며, 퍼실리테이터 섭외도 가능합니다." },
      { q: "강사·퍼실리테이터 섭외도 포함되나요?", a: "네, 교육 주제에 맞는 전문 강사·퍼실리테이터를 섭외합니다. 분야별 전문가 네트워크를 보유하고 있어 적합한 강사를 추천해 드립니다." },
      { q: "캠프·수련회 같은 숙박형 프로그램도 운영하나요?", a: "네, 청소년 캠프·임직원 수련회 등 숙박형 교육 프로그램을 운영합니다. 프로그램 기획부터 숙박·이동·식사·안전 관리까지 현장 운영 전반을 책임집니다." },
    ],
    metaTitle: "교육·워크숍 대행 — 임직원 연수·역량강화·캠프 기획 전문",
    metaDescription:
      "교육·워크숍 대행 전문 에이전시. 임직원 연수·역량강화 워크숍·직무교육·청소년 캠프를 기획부터 운영까지 원스톱 대행. 커리큘럼 설계·강사 섭외·교재 제작 포함. 무료 견적.",
    keywords: ["교육행사대행", "연수대행", "워크숍대행", "역량강화", "임직원교육", "수련회", "직무교육", "캠프대행"],
  },

  booth: {
    key: "booth",
    label: "전시·홍보부스",
    h1: "전시부스·박람회·홍보부스 운영",
    intro:
      "박람회 전시부스, 체험부스, 홍보부스, 포토존을 디자인부터 시공·현장 운영까지 원스톱 대행. 3D 시뮬레이션, 현장 실측, 설치·철거까지 한 팀이 전담.",
    badges: ["3D 시뮬레이션 제공", "시공·설치·철거", "현장 운영 인력"],
    workHref: "/work?view=design&design=공간",
    serviceType: "Exhibition Booth Operation",
    price: "6000000",
    priceNote: "부스 디자인 60만 원부터, 시공·운영 포함 패키지는 규모에 따라 별도 견적",
    lineup: [
      { icon: Cube, name: "박람회 전시부스", desc: "1부스(3×3m)부터 대형 부스까지 — 3D 시뮬레이션, 시공·설치·철거 일체", examples: "박람회 부스, 전시회 부스, 대형 구조물 부스" },
      { icon: Storefront, name: "체험부스·홍보관", desc: "동선 설계, 체험 콘텐츠, 현장 진행 인력 배치 포함", examples: "체험부스, 정책 홍보관, 사업 홍보관" },
      { icon: Camera, name: "포토존·이벤트존", desc: "행사 컨셉에 맞는 조형물·배경 그래픽으로 참여·SNS 확산 유도", examples: "행사 포토존, SNS 인증존, 이벤트 조형물" },
      { icon: Megaphone, name: "홍보부스·캠페인 부스", desc: "현수막·배너·조형물 등 구성물 일체 제작, 현장 운영 지원", examples: "캠페인 부스, 거리 홍보부스, 지자체 행사부스" },
    ],
    faq: [
      { q: "전시부스 디자인·시공 비용은 얼마인가요?", a: "파란컴퍼니의 부스 디자인은 60만 원부터 시작하며, 1부스(3×3m) 기준 시공·설치 포함 패키지는 규모와 구조물에 따라 달라집니다. 3D 시뮬레이션 확인 후 항목별 상세 견적서를 제공합니다." },
      { q: "부스 시공·설치·철거까지 맡길 수 있나요?", a: "네, 디자인부터 현장 실측, 구조물 제작, 그래픽 출력·설치, 행사 후 철거까지 모두 진행합니다. 코엑스·킨텍스 등 전시장 배치도와 규정에 맞춰 진행합니다." },
      { q: "체험부스·포토존도 함께 운영해 주시나요?", a: "네, 관람객 참여형 체험부스와 SNS 인증용 포토존을 함께 기획·제작·운영합니다. 현장 진행 인력 배치와 체험 이벤트 운영까지 지원합니다." },
      { q: "부스 준비 기간은 얼마나 필요한가요?", a: "기본 부스는 최소 2~3주, 구조물이 포함된 대형 부스·체험관은 최소 4~6주 전 의뢰를 권장합니다. 디자인 시안, 3D 시뮬레이션, 제작·시공 일정을 고려한 기간입니다." },
    ],
    metaTitle: "전시·홍보부스 대행 — 부스 운영·체험부스·포토존 제작 전문",
    metaDescription:
      "전시·홍보부스 대행 전문 에이전시. 박람회 전시부스·체험부스·홍보부스·포토존을 디자인부터 시공·현장 운영까지 원스톱 대행. 3D 시뮬레이션·실측·설치 포함. 무료 견적.",
    keywords: ["전시부스", "부스운영", "체험부스", "홍보부스", "포토존", "박람회부스", "부스제작", "부스디자인"],
  },

  government: {
    key: "government",
    label: "공공기관 행사 대행",
    h1: "공공기관·지자체 행사 대행",
    intro:
      "정부 부처·지자체·공기업의 세미나·포럼·교육·전시를 조달 규정에 맞춰 기획·운영. 직접생산확인증명서·여성기업확인서 보유 — 나라장터 입찰·수의계약 모두 가능.",
    badges: ["여성기업 수의계약", "직접생산확인증명서", "결과보고·정산 일체"],
    workHref: "/work",
    serviceType: "Government Event Planning",
    price: "8000000",
    priceNote: "행사 규모·유형에 따라 별도 견적. 나라장터 입찰·수의계약 모두 대응",
    lineup: [
      { icon: Megaphone, name: "정책 세미나·토론회", desc: "전문 사회자 섭외, 속기록, 토론 패널 구성·질의응답 진행 포함", examples: "정책 세미나, 공청회, 토론회, 정책 포럼" },
      { icon: Globe, name: "학술 포럼·국제 컨퍼런스", desc: "연사 섭외, 동시통역, 논문 발표 세션, 하이브리드 운영 지원", examples: "학술 포럼, 국제 컨퍼런스, 학회 행사" },
      { icon: GraduationCap, name: "교육·연수 프로그램", desc: "커리큘럼 설계부터 강사 섭외, 현장 운영, 만족도 조사까지 전담", examples: "공무원 연수, 역량강화 교육, 직무교육" },
      { icon: Buildings, name: "기관 행사·전시 운영", desc: "기관 아이덴티티를 반영한 공간 연출·참가자 경험 설계", examples: "장병 캠프, 문화 행사, 전시부스, 기관 행사" },
    ],
    faq: [
      { q: "수의계약으로 진행할 수 있나요?", a: "네, 파란컴퍼니는 여성기업 인증 보유로 5,000만 원 이하 수의계약이 가능합니다. 직접생산확인증명서(행사대행업)도 보유하여 나라장터 입찰도 가능합니다. 세금계산서·산출내역서 등 서류 일체를 발급합니다." },
      { q: "행정·정산 서류도 챙겨주시나요?", a: "네, 행사 기획서, 산출내역서, 결과보고서, 참석자명부, 사진대지 등 공공기관에서 요구하는 행정 서류를 기본으로 제공합니다. 감사 대비 정산 자료까지 빠짐없이 준비합니다." },
      { q: "어떤 공공기관 행사 경험이 있나요?", a: "교육부, 해군, 경기도교육청, 수원시, 고양시 등 다수의 공공기관 행사를 수행했습니다. 세미나·포럼·교육·캠프·전시 등 다양한 유형의 행사 경험이 있습니다." },
      { q: "기획부터 디자인·운영까지 한 번에 맡길 수 있나요?", a: "네, 기획부터 시안물 디자인, 음향·조명·영상 현장 운영, 결과보고서 납품까지 한 팀이 원스톱으로 처리합니다. 외주 없이 진행되어 빠르고 일관됩니다." },
    ],
    metaTitle: "공공기관 행사 대행 — 조달·수의계약·여성기업 전문",
    metaDescription:
      "공공기관 행사 대행 전문 에이전시. 정부·지자체·공기업 세미나·포럼·교육·전시를 조달 규정에 맞춰 원스톱 대행. 여성기업 수의계약·나라장터 입찰 가능, 결과보고·정산 서류 일체. 무료 견적.",
    keywords: ["공공기관행사대행", "관공서행사대행", "지자체행사대행", "수의계약", "여성기업", "나라장터", "행사대행"],
  },
};
