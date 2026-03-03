"use client";

import { useThemeStore } from "@/stores/themeStore";
import { THEME_ORDER, THEME_META } from "@/lib/themes";

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      className="
        fixed top-[72px] right-6 z-50
        flex items-center gap-1 p-1 rounded-full
        bg-slate-800/90 backdrop-blur-md shadow-lg border border-slate-600/50
        transition-colors duration-300
      "
    >
      {THEME_ORDER.map((key) => {
        const meta = THEME_META[key];
        const active = key === theme;
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200 cursor-pointer whitespace-nowrap
              ${active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/10"
              }
            `}
            title={meta.label}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
            <span className="hidden sm:inline">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
