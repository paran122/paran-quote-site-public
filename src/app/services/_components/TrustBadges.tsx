import { CheckCircle } from "lucide-react";

const badges = [
  "250+ 프로젝트",
  "공공기관 다수 실적",
  "여성기업 인증",
];

interface Props {
  variant?: "light" | "dark";
}

export default function TrustBadges({ variant = "light" }: Props) {
  const isDark = variant === "dark";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {badges.map((b) => (
        <span
          key={b}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
            isDark
              ? "bg-white/10 border border-white/15 text-slate-200"
              : "bg-white border border-slate-200/80 text-slate-600"
          }`}
        >
          <CheckCircle className={`w-3.5 h-3.5 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
          {b}
        </span>
      ))}
    </div>
  );
}
