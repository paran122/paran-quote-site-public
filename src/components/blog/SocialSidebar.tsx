"use client";

import { motion } from "framer-motion";

interface SocialLinksProps {
  naverBlogUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

const DEFAULT_NAVER = "https://blog.naver.com/paran-company";
const DEFAULT_INSTAGRAM = "https://www.instagram.com/parancompany";
const DEFAULT_YOUTUBE = "https://www.youtube.com/@parancompany";

/* ── Brand SVG Icons ── */

function NaverBlogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.56 0H6.44C2.88 0 0 2.88 0 6.44v7.12C0 17.12 2.88 20 6.44 20h7.12C17.12 20 20 17.12 20 13.56V6.44C20 2.88 17.12 0 13.56 0zm-1.59 14.4L8.52 9.67v4.73H5.6V5.6h3.45l3.45 4.73V5.6h2.93v8.8h-3.46z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const LINKS_CONFIG = [
  { key: "naver" as const, label: "네이버 블로그", Icon: NaverBlogIcon, color: "text-[#03C75A] border-[#03C75A]/25", hoverColor: "hover:text-[#02a34a] hover:border-[#02a34a]/40 hover:bg-[#03C75A]/5" },
  { key: "instagram" as const, label: "인스타그램", Icon: InstagramIcon, color: "text-[#E1306C] border-[#E1306C]/25", hoverColor: "hover:text-[#C13584] hover:border-[#C13584]/40 hover:bg-[#E1306C]/5" },
  { key: "youtube" as const, label: "유튜브", Icon: YoutubeIcon, color: "text-[#FF0000] border-[#FF0000]/25", hoverColor: "hover:text-[#cc0000] hover:border-[#cc0000]/40 hover:bg-[#FF0000]/5" },
] as const;

function getLinks(props: SocialLinksProps) {
  return LINKS_CONFIG.map((cfg) => ({
    ...cfg,
    url:
      cfg.key === "naver" ? (props.naverBlogUrl || DEFAULT_NAVER) :
      cfg.key === "instagram" ? (props.instagramUrl || DEFAULT_INSTAGRAM) :
      (props.youtubeUrl || DEFAULT_YOUTUBE),
  }));
}

/* ── Desktop: 왼쪽 고정 사이드바 (1400px+) ── */
export function SocialSidebarFixed(props: SocialLinksProps) {
  const links = getLinks(props);

  return (
    <aside className="fixed left-[max(1.5rem,calc(50vw-580px))] top-[46%] z-20 hidden flex-col items-center gap-3 min-[1400px]:flex">
      {links.map(({ url, label, Icon, color, hoverColor }, i) => (
        <motion.a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
          whileHover={{ scale: 1.12 }}
          className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${color} ${hoverColor}`}
          title={label}
        >
          <Icon />
        </motion.a>
      ))}

      {/* 구분선 */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="mt-1 h-8 w-px origin-top bg-slate-200"
      />
    </aside>
  );
}

/* ── 본문 왼쪽 세로 배치 (sticky, 800px~1399px) ── */
export function SocialLinksVertical(props: SocialLinksProps) {
  const links = getLinks(props);

  return (
    <div className="flex flex-col items-center gap-3">
      {links.map(({ url, label, Icon, color, hoverColor }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${color} ${hoverColor}`}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

/* ── Mobile: 인라인 가로 배치 (800px 미만) ── */
export function SocialLinksInline(props: SocialLinksProps) {
  const links = getLinks(props);

  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] font-medium tracking-wide text-slate-400">
        SNS
      </span>
      <div className="h-3 w-px bg-slate-200" />
      {links.map(({ url, label, Icon, color, hoverColor }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 hover:shadow-sm ${color} ${hoverColor}`}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
