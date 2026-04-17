import Link from "next/link";
import Image from "next/image";
import type { Portfolio, PortfolioMedia } from "@/types";
import CardCarousel from "./CardCarousel";

const categoryStyle: Record<string, string> = {
  포럼: "bg-purple-100 text-purple-700",
  세미나: "bg-emerald-100 text-emerald-700",
  행사운영: "bg-blue-100 text-blue-700",
  교육: "bg-amber-100 text-amber-700",
  콘텐츠: "bg-orange-100 text-orange-700",
  전시: "bg-pink-100 text-pink-700",
};

// 랜딩 카테고리 매핑 (event_type → 표시 카테고리)
function getDisplayCategory(portfolio: Portfolio): string {
  const title = portfolio.title;
  if (title.includes("포럼") || title.includes("학술대회")) return "포럼";
  if (title.includes("세미나") || title.includes("컨퍼런스")) return "세미나";
  if (title.includes("교육") && !title.includes("교육청")) return "교육";
  if (title.includes("부스") || title.includes("전시")) return "전시";
  if (title.includes("SNS") || title.includes("인쇄") || title.includes("디자인")) return "콘텐츠";
  return "행사운영";
}

function getFirstPhoto(
  portfolio: Portfolio,
  media: PortfolioMedia[]
): string | null {
  const m = media.find(
    (m) => m.eventSlug === portfolio.slug && m.type === "photo"
  );
  if (m) return m.url;
  return portfolio.imageUrl || null;
}

interface Props {
  title: string;
  portfolios: Portfolio[];
  media: PortfolioMedia[];
  altPrefix?: string;
  mobileCarousel?: boolean;
}

export default function ServicePortfolio({ title, portfolios, media, altPrefix, mobileCarousel }: Props) {
  const cards = portfolios.map((pf) => {
    const photo = getFirstPhoto(pf, media);
    const cat = getDisplayCategory(pf);
    const badgeStyle = categoryStyle[cat] || "bg-slate-100 text-slate-700";

    return (
      <Link
        key={pf.id}
        href={`/work/${pf.slug}`}
        className={`group block rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all ${
          mobileCarousel ? "snap-center shrink-0 w-[75vw] sm:w-auto sm:shrink" : ""
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {photo ? (
            <Image
              src={photo}
              alt={altPrefix ? `${altPrefix} - ${pf.title}` : pf.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
              사진 없음
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${badgeStyle}`}
            >
              {cat}
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-400 mb-1">{pf.client}</p>
          <h3 className="font-bold text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
            {pf.title}
          </h3>
          {pf.attendees && (
            <p className="text-xs text-slate-400 mt-1">{pf.attendees}</p>
          )}
        </div>
      </Link>
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <Link
          href="/work"
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          전체 포트폴리오 →
        </Link>
      </div>

      {mobileCarousel ? (
        <CardCarousel desktopGrid="sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {cards}
        </CardCarousel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards}
        </div>
      )}
    </div>
  );
}
