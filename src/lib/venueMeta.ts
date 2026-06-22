// 행사장 표시용 상수/헬퍼 (목록·상세 공용)

export const VENUE_TYPE_LABEL: Record<string, string> = {
  convention: "컨벤션·전시장",
  hotel: "호텔 연회장",
  training: "연수원·교육시설",
  public: "공공·관공서",
  etc: "기타·특수",
};

export const VENUE_TYPE_BADGE: Record<string, string> = {
  convention: "bg-sky-100 text-sky-700",
  hotel: "bg-indigo-100 text-indigo-700",
  training: "bg-amber-100 text-amber-700",
  public: "bg-emerald-100 text-emerald-700",
  etc: "bg-slate-100 text-slate-600",
};

export const CAP_MODE_LABEL: Record<string, string> = {
  theater: "강의식",
  banquet: "연회식",
  classroom: "교실식",
  reception: "리셉션",
  u_shape: "U자형",
  floor1: "1층석",
  floor2: "2층석",
};

export const CAP_MODE_ORDER = ["theater", "banquet", "classroom", "reception", "u_shape", "floor1", "floor2"];

// 홀 보유 시설 코드 → 한글
export const FACILITY_LABEL: Record<string, string> = {
  audio: "음향 시스템",
  wireless_mic: "무선 마이크",
  led: "LED 스크린",
  projector: "빔 프로젝터",
  interpretation: "동시통역 부스",
  lighting: "조명 시스템",
  recording: "녹화·송출",
  broadcast: "방송실",
};

export function facilityLabel(f: string): string {
  return FACILITY_LABEL[f] || f;
}

// 사진 카테고리 (인트라넷 photo_category와 동일)
export const PHOTO_CAT_LABEL: Record<string, string> = {
  exterior: "외관",
  front: "정면",
  side: "측면",
  back: "후면",
  lobby: "로비",
  stage: "무대",
  waiting: "대기실",
  setup: "셋업 사례",
  loading: "로딩·반입",
  etc: "기타",
};

export const PHOTO_CAT_ORDER = ["exterior", "front", "side", "back", "lobby", "stage", "waiting", "setup", "loading", "etc"];

export function photoCatLabel(c?: string | null): string {
  return (c && PHOTO_CAT_LABEL[c]) || "기타";
}

export const CAP_BUCKETS = ["~100명", "100~300명", "300~500명", "500명+"];

export function capBucket(n?: number): string | null {
  if (!n) return null;
  if (n <= 100) return "~100명";
  if (n <= 300) return "100~300명";
  if (n <= 500) return "300~500명";
  return "500명+";
}

export function typeLabel(t?: string): string {
  return (t && VENUE_TYPE_LABEL[t]) || "기타";
}

// ── 지역(시도) 정규화 ── region/주소 텍스트에서 17개 시도 추출 (시군구는 카드에 그대로 표시)
export const SIDO_ORDER = [
  "서울", "경기", "인천", "강원", "대전", "세종", "충북", "충남",
  "부산", "대구", "울산", "경북", "경남", "광주", "전북", "전남", "제주",
];

// 시도별 매칭 키워드 (시도명 + 대표 시군구). 앞쪽 시도부터 우선 매칭.
const SIDO_KEYWORDS: Record<string, string[]> = {
  서울: ["서울"],
  인천: ["인천"],
  세종: ["세종"],
  대전: ["대전"],
  부산: ["부산"],
  대구: ["대구"],
  울산: ["울산"],
  경기: ["경기", "수원", "성남", "고양", "용인", "부천", "안산", "안양", "남양주", "화성", "평택", "의정부", "시흥", "파주", "김포", "군포", "하남", "오산", "양주", "구리", "안성", "포천", "의왕", "여주", "동두천", "과천", "가평", "연천", "이천", "양평"],
  강원: ["강원", "춘천", "원주", "강릉", "속초", "동해", "삼척", "태백"],
  충북: ["충북", "청주", "충주", "제천"],
  충남: ["충남", "천안", "아산", "당진", "서산", "공주", "논산"],
  경북: ["경북", "포항", "경주", "구미", "안동", "김천", "영주", "상주"],
  경남: ["경남", "창원", "김해", "진주", "양산", "거제", "통영", "사천", "밀양"],
  광주: ["광주광역", "광산구"],
  전북: ["전북", "전주", "익산", "군산", "정읍", "남원"],
  전남: ["전남", "여수", "순천", "목포", "광양", "나주"],
  제주: ["제주", "서귀포"],
};

export function sidoOf(region?: string | null, address?: string | null): string {
  const text = `${address ?? ""} ${region ?? ""}`.trim();
  if (!text) return "기타";
  for (const sido of Object.keys(SIDO_KEYWORDS)) {
    if (SIDO_KEYWORDS[sido].some((kw) => text.includes(kw))) return sido;
  }
  // 단독 '광주'는 광주광역시로 간주 (경기 광주는 위 키워드/주소로 이미 분기)
  if ((region ?? "").trim() === "광주" || (address ?? "").includes("광주")) return "광주";
  return (region ?? "").trim() || "기타";
}

export function sidoSort(a: string, b: string): number {
  const ia = SIDO_ORDER.indexOf(a), ib = SIDO_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}
