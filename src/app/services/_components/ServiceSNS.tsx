"use client";

/* 블로그 SocialSidebar와 동일한 브랜드 아이콘 사용 */

function NaverBlogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.56 0H6.44C2.88 0 0 2.88 0 6.44v7.12C0 17.12 2.88 20 6.44 20h7.12C17.12 20 20 17.12 20 13.56V6.44C20 2.88 17.12 0 13.56 0zm-1.59 14.4L8.52 9.67v4.73H5.6V5.6h3.45l3.45 4.73V5.6h2.93v8.8h-3.46z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <span
      className="inline-block"
      style={{
        width: 18,
        height: 18,
        background:
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='5'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='17.5' cy='6.5' r='1.5' fill='black' stroke='none'/%3E%3C/svg%3E")`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='5'/%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Ccircle cx='17.5' cy='6.5' r='1.5' fill='black' stroke='none'/%3E%3C/svg%3E")`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
      }}
    />
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const links = [
  {
    url: "https://blog.naver.com/paran-company",
    label: "네이버 블로그",
    Icon: NaverBlogIcon,
    color: "text-[#03C75A] border-[#03C75A]/25",
    hoverColor: "hover:text-[#02a34a] hover:border-[#02a34a]/40 hover:bg-[#03C75A]/5",
  },
  {
    url: "https://www.instagram.com/parancompany",
    label: "인스타그램",
    Icon: InstagramIcon,
    color: "border-[#E1306C]/25",
    hoverColor: "hover:border-[#C13584]/40 hover:bg-[#E1306C]/5",
  },
  {
    url: "https://www.youtube.com/@parancompany",
    label: "유튜브",
    Icon: YoutubeIcon,
    color: "text-[#FF0000] border-[#FF0000]/25",
    hoverColor: "hover:text-[#cc0000] hover:border-[#cc0000]/40 hover:bg-[#FF0000]/5",
  },
];

export default function ServiceSNS({ layout = "horizontal" }: { layout?: "horizontal" | "vertical" }) {
  return (
    <div className={layout === "vertical" ? "flex flex-col items-center gap-3" : "flex items-center gap-3"}>
      {links.map(({ url, label, Icon, color, hoverColor }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${color} ${hoverColor}`}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
