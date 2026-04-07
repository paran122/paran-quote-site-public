/** 디자인 작업물 데이터 — /work 디자인별 뷰에서 사용 */

export interface DesignWork {
  id: string;
  category: string;
  title: string;
  event: string;
  slug: string; // 연결할 행사 포트폴리오 slug
  image: string;
  sortOrder: number;
  year: number;
}

/** slug → 연도 매핑 */
const SLUG_YEAR: Record<string, number> = {
  "international-forum": 2026,
  "education-council-booth": 2026,
};

const _RAW: Omit<DesignWork, "year">[] = [
  // ── 전시부스 디자인 ──
  { id: "b01", category: "전시부스", title: "포토존 디자인", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/전시부스 디자인/01_photozone-2025-goyang.webp", sortOrder: 1 },
  { id: "b02", category: "전시부스", title: "포토존 디자인", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/전시부스 디자인/01_photozone-2026-intl-cooperation-forum.webp", sortOrder: 2 },
  { id: "b03", category: "전시부스", title: "포토존 시안", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/전시부스 디자인/01_photozone-preview-2026-intl-cooperation-forum.webp", sortOrder: 3 },
  { id: "b04", category: "전시부스", title: "체험부스 디자인", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/전시부스 디자인/01_booth-experience-2025-kls.webp", sortOrder: 4 },
  { id: "b05", category: "전시부스", title: "대형 전시부스", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/전시부스 디자인/booth-large-2025-kls.webp", sortOrder: 5 },
  { id: "b06", category: "전시부스", title: "전시부스 디자인", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/전시부스 디자인/booth-2025-goyang-sports-conference.webp", sortOrder: 6 },
  { id: "b07", category: "전시부스", title: "전통체험 포토존", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/전시부스 디자인/photozone-2026-intl-cooperation-forum-traditional-experience.webp", sortOrder: 7 },
  { id: "b08", category: "전시부스", title: "포토존 디자인", event: "직장인 문화예술클럽", slug: "culture-club-operation", image: "/design/전시부스 디자인/photozone-cultural-arts-club.webp", sortOrder: 8 },
  { id: "b09", category: "전시부스", title: "포토존 디자인", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/전시부스 디자인/photozone-kls.webp", sortOrder: 9 },

  // ── 포스터 디자인 ──
  { id: "p01", category: "포스터", title: "행사 포스터", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/포스터 디자인/01_poster-2025-gyeonggi-parent-edu1.webp", sortOrder: 1 },
  { id: "p02", category: "포스터", title: "행사 포스터 B", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/포스터 디자인/01_poster-2025-gyeonggi-parent-edu2.webp", sortOrder: 2 },
  { id: "p03", category: "포스터", title: "행사 포스터", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/포스터 디자인/01_poster-2026-goyang.webp", sortOrder: 3 },
  { id: "p04", category: "포스터", title: "행사 포스터", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/포스터 디자인/poster-2025-artist-rights1.webp", sortOrder: 4 },
  { id: "p05", category: "포스터", title: "행사 포스터 B", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/포스터 디자인/poster-2025-artist-rights2.webp", sortOrder: 5 },
  { id: "p06", category: "포스터", title: "행사 포스터 C", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/포스터 디자인/poster-2025-artist-rights3.webp", sortOrder: 6 },
  { id: "p07", category: "포스터", title: "행사 포스터", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/포스터 디자인/poster-2025-goyang-sports-conference.webp", sortOrder: 7 },
  { id: "p08", category: "포스터", title: "회차별 포스터 3", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/포스터 디자인/poster-2025-gyeonggi-parent-edu3.webp", sortOrder: 8 },
  { id: "p09", category: "포스터", title: "회차별 포스터 4", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/포스터 디자인/poster-2025-gyeonggi-parent-edu4.webp", sortOrder: 9 },
  { id: "p10", category: "포스터", title: "회차별 포스터 5", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/포스터 디자인/poster-2025-gyeonggi-parent-edu5.webp", sortOrder: 10 },
  { id: "p11", category: "포스터", title: "회차별 포스터 6", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/포스터 디자인/poster-2025-gyeonggi-parent-edu6.webp", sortOrder: 11 },
  { id: "p12", category: "포스터", title: "행사 포스터", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/포스터 디자인/poster-2025-kls.webp", sortOrder: 12 },
  { id: "p13", category: "포스터", title: "세미나 포스터", event: "하계 자동차부품산업 세미나", slug: "auto-seminar-summer", image: "/design/포스터 디자인/poster-2025-summer-auto-seminar.webp", sortOrder: 13 },
  { id: "p14", category: "포스터", title: "행사 포스터", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/포스터 디자인/poster-2026-intl-cooperation-forum.webp", sortOrder: 14 },
  { id: "p15", category: "포스터", title: "행사 포스터", event: "직장인 문화예술클럽", slug: "culture-club-operation", image: "/design/포스터 디자인/poster-cultural-arts-club.webp", sortOrder: 15 },
  { id: "p16", category: "포스터", title: "행사 포스터", event: "필승해군캠프", slug: "navy-camp", image: "/design/포스터 디자인/poster-navy.webp", sortOrder: 16 },

  // ── 리플렛 디자인 ──
  { id: "l01", category: "리플렛", title: "행사 리플렛", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/리플렛 디자인/01_leaflet-2025-goyang.webp", sortOrder: 1 },
  { id: "l02", category: "리플렛", title: "행사 리플렛 B", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/리플렛 디자인/01_leaflet-2025-goyang-sports-conference2.webp", sortOrder: 2 },
  { id: "l03", category: "리플렛", title: "행사 리플렛", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/리플렛 디자인/01_leaflet-2026-intl-cooperation-forum.webp", sortOrder: 3 },
  { id: "l04", category: "리플렛", title: "교육 리플렛", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/리플렛 디자인/leaflet-2025-artist-rights-edu.webp", sortOrder: 4 },
  { id: "l05", category: "리플렛", title: "행사 리플렛", event: "직장인 문화예술클럽", slug: "culture-club-operation", image: "/design/리플렛 디자인/leaflet-2025-cultural-arts-club.webp", sortOrder: 5 },
  { id: "l06", category: "리플렛", title: "행사 리플렛", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/리플렛 디자인/leaflet-2025-goyang-sports-conference1.webp", sortOrder: 6 },
  { id: "l07", category: "리플렛", title: "행사 리플렛", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/리플렛 디자인/leaflet-2025-kls.webp", sortOrder: 7 },

  // ── 카탈로그 디자인 ──
  { id: "c01", category: "카탈로그", title: "세미나 자료집", event: "지역사회 역량강화 프로그램", slug: "community-energy", image: "/design/카탈로그 디자인/catalog-community-capacity-proceedings.webp", sortOrder: 1 },
  { id: "c02", category: "카탈로그", title: "결과공유회 자료집", event: "직장인 문화예술클럽", slug: "culture-club-operation", image: "/design/카탈로그 디자인/catalog-cultural-arts-club-proceedings.webp", sortOrder: 2 },
  { id: "c03", category: "카탈로그", title: "포럼 자료집", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/카탈로그 디자인/catalog-forum-proceedings.webp", sortOrder: 3 },
  { id: "c04", category: "카탈로그", title: "에세이집", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/카탈로그 디자인/catalog-goyang-essay.webp", sortOrder: 4 },
  { id: "c05", category: "카탈로그", title: "현장 매뉴얼", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/카탈로그 디자인/catalog-kls-site-manual.webp", sortOrder: 5 },

  // ── 배너·현수막 디자인 ──
  { id: "bn01", category: "배너·현수막", title: "행사 현수막", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/배너·현수막 디자인/01_banner-goyang-sports-conference.webp", sortOrder: 1 },
  { id: "bn02", category: "배너·현수막", title: "엑스배너", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/배너·현수막 디자인/01_x-banner-2025-artist-rights-edu.webp", sortOrder: 2 },
  { id: "bn03", category: "배너·현수막", title: "행사 배너", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/배너·현수막 디자인/banner-2025-2025-goyang-sports-conference.webp", sortOrder: 3 },
  { id: "bn04", category: "배너·현수막", title: "행사 현수막", event: "지역사회 역량강화 프로그램", slug: "community-energy", image: "/design/배너·현수막 디자인/banner-2025-community-capacity.webp", sortOrder: 4 },
  { id: "bn05", category: "배너·현수막", title: "행사 현수막", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/배너·현수막 디자인/banner-2025-kls.webp", sortOrder: 5 },
  { id: "bn06", category: "배너·현수막", title: "세미나 배너", event: "춘계 자동차부품산업 세미나", slug: "auto-seminar-spring", image: "/design/배너·현수막 디자인/banner-2025-spring-auto-seminar.webp", sortOrder: 6 },
  { id: "bn07", category: "배너·현수막", title: "포럼 현수막", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/배너·현수막 디자인/banner-2026-intl-cooperation-forum.webp", sortOrder: 7 },
  { id: "bn08", category: "배너·현수막", title: "포럼 배너 B", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/배너·현수막 디자인/banner-2026-intl-cooperation-forum2.webp", sortOrder: 8 },
  { id: "bn09", category: "배너·현수막", title: "가로 현수막", event: "KLS 한국어교육 국제학술대회", slug: "kls", image: "/design/배너·현수막 디자인/banner-h-2025-kls.webp", sortOrder: 9 },
  { id: "bn10", category: "배너·현수막", title: "엑스배너", event: "지역사회 역량강화 프로그램", slug: "community-energy", image: "/design/배너·현수막 디자인/x-banner-2025-community-capacity.webp", sortOrder: 10 },
  { id: "bn11", category: "배너·현수막", title: "엑스배너", event: "고양 학교체육 성장 컨퍼런스", slug: "goyang-conference", image: "/design/배너·현수막 디자인/x-banner-2025-goyang-sports-conference.webp", sortOrder: 11 },
  { id: "bn12", category: "배너·현수막", title: "엑스배너 A", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/배너·현수막 디자인/x-banner-2025-gyeonggi-parent-edu-1.webp", sortOrder: 12 },
  { id: "bn13", category: "배너·현수막", title: "엑스배너 B", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/배너·현수막 디자인/x-banner-2025-gyeonggi-parent-edu-2.webp", sortOrder: 13 },
  { id: "bn14", category: "배너·현수막", title: "엑스배너", event: "중앙아시아 교육협력포럼", slug: "international-forum", image: "/design/배너·현수막 디자인/x-banner-2026-intl-cooperation-forum.webp", sortOrder: 14 },
  { id: "bn15", category: "배너·현수막", title: "엑스배너", event: "필승해군캠프", slug: "navy-camp", image: "/design/배너·현수막 디자인/x-banner-navy.webp", sortOrder: 15 },

  // ── PPT 디자인 ──
  { id: "pp01", category: "PPT", title: "제안서 PPT", event: "지역사회 역량강화 프로그램", slug: "community-energy", image: "/design/PPT 디자인/01_ppt-community-capacity.webp", sortOrder: 1 },
  { id: "pp02", category: "PPT", title: "기획서 PPT", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/PPT 디자인/01_ppt-outreach.webp", sortOrder: 2 },
  { id: "pp03", category: "PPT", title: "결과보고 PPT", event: "직장인 문화예술클럽", slug: "culture-club-operation", image: "/design/PPT 디자인/_ppt-cultural-arts-club.webp", sortOrder: 3 },
  { id: "pp04", category: "PPT", title: "제안서 PPT", event: "필승해군캠프", slug: "navy-camp", image: "/design/PPT 디자인/ppt-navy.webp", sortOrder: 4 },

  // ── 카드뉴스 디자인 ──
  { id: "cn01", category: "카드뉴스", title: "교육 홍보 카드뉴스", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/카드뉴스 디자인/cardnews-2025-artist-rights-edu.webp", sortOrder: 1 },
  { id: "cn02", category: "카드뉴스", title: "교육 안내 카드뉴스", event: "예술인 권리보호 교육", slug: "artist-rights", image: "/design/카드뉴스 디자인/cardnews-2025-artist-rights-edu-1.webp", sortOrder: 2 },
  { id: "cn03", category: "카드뉴스", title: "활동 안내 카드뉴스", event: "직장인 문화예술클럽", slug: "culture-club-operation", image: "/design/카드뉴스 디자인/cardnews-2025-cultural-arts-club.webp", sortOrder: 3 },
  { id: "cn04", category: "카드뉴스", title: "교육 홍보 카드뉴스", event: "찾아가는 경기학부모교육", slug: "parent-education", image: "/design/카드뉴스 디자인/cardnews-2025-gyeonggi-parent-edu.webp", sortOrder: 4 },
  { id: "cn05", category: "카드뉴스", title: "빼빼로데이 콘텐츠", event: "합동참모본부 SNS 콘텐츠", slug: "jcs-sns", image: "/design/카드뉴스 디자인/cardnews-1111-2025-jcs-sns.webp", sortOrder: 5 },
  { id: "cn06", category: "카드뉴스", title: "창설기념 콘텐츠", event: "합동참모본부 SNS 콘텐츠", slug: "jcs-sns", image: "/design/카드뉴스 디자인/cardnews-jcs-founding-2025-jcs-sns.webp", sortOrder: 6 },
  { id: "cn07", category: "카드뉴스", title: "광복 80주년 콘텐츠", event: "합동참모본부 SNS 콘텐츠", slug: "jcs-sns", image: "/design/카드뉴스 디자인/cardnews-liberation-80th-2025-jcs.webp", sortOrder: 7 },
  { id: "cn08", category: "카드뉴스", title: "파병 콘텐츠", event: "합동참모본부 SNS 콘텐츠", slug: "jcs-sns", image: "/design/카드뉴스 디자인/cardnews-troop-dispatch-2025-jcs-sns.webp", sortOrder: 8 },
];

/** slug 기반으로 year 자동 매핑 (기본값 2025) */
export const DESIGN_WORKS: DesignWork[] = _RAW.map((d) => ({
  ...d,
  year: SLUG_YEAR[d.slug] ?? 2025,
}));
