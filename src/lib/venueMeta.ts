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
};

export const CAP_MODE_ORDER = ["theater", "banquet", "classroom", "reception", "u_shape"];

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
