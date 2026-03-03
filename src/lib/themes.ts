export type ThemeKey = "navy";

export const THEME_ORDER: ThemeKey[] = ["navy"];

export const THEME_META: Record<ThemeKey, { label: string; dot: string }> = {
  navy: { label: "Navy", dot: "bg-slate-300" },
};

/** 페이지 배경이 다크인가? */
export function isPageDark(): boolean {
  return false;
}

/** 크롬(GNB/사이드바/푸터)이 다크인가? — 둘 다 다크 크롬 */
export function isChromeDark(): boolean {
  return true;
}

/** 페이지 배경 클래스 */
export function pageBgClass(): string {
  return "bg-white";
}

/** 액센트 텍스트 색상 */
export function accentText(): string {
  return "text-blue-500";
}

/** 액센트 hover 텍스트 */
export function accentHover(): string {
  return "hover:text-blue-600";
}
