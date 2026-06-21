// 강사 표시용 상수/헬퍼 (목록·상세 공용) — 인트라넷 LECTURER_CATEGORIES와 동일 분류

export const LECTURER_CATEGORIES = [
  "심리·상담",
  "육아·부모",
  "진로·학습",
  "AI·미래",
  "경제·트렌드",
  "인문·역사",
  "과학·건강",
  "문화·기타",
];

export const LECTURER_CAT_BADGE: Record<string, string> = {
  "심리·상담": "bg-rose-100 text-rose-700",
  "육아·부모": "bg-amber-100 text-amber-700",
  "진로·학습": "bg-sky-100 text-sky-700",
  "AI·미래": "bg-indigo-100 text-indigo-700",
  "경제·트렌드": "bg-emerald-100 text-emerald-700",
  "인문·역사": "bg-orange-100 text-orange-700",
  "과학·건강": "bg-teal-100 text-teal-700",
  "문화·기타": "bg-slate-100 text-slate-600",
};

export function catLabel(c?: string | null): string {
  return c || "강사";
}

export function catBadge(c?: string | null): string {
  return (c && LECTURER_CAT_BADGE[c]) || "bg-slate-100 text-slate-600";
}
