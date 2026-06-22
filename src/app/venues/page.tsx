import type { Metadata } from "next";
import { fetchVenues } from "@/lib/queries";
import type { Venue } from "@/types";
import VenuesClient from "./VenuesClient";

export const metadata: Metadata = {
  title: "행사장 정보 | 파란컴퍼니",
  description:
    "지역·수용 인원·유형별 행사장 정보입니다. 문의 주시면 안내해 드립니다.",
  alternates: { canonical: "https://parancompany.co.kr/venues" },
};

export default async function VenuesPage() {
  let venues: Venue[] = [];
  try {
    venues = await fetchVenues();
  } catch {
    venues = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "파란컴퍼니 행사장 정보",
    description: "파란컴퍼니 행사장 정보 목록입니다.",
    url: "https://parancompany.co.kr/venues",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: venues.length,
      itemListElement: venues.map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Place",
          name: v.name,
          url: `https://parancompany.co.kr/venues/${v.slug}`,
          ...(v.coverUrl ? { image: v.coverUrl } : {}),
          ...(v.addressApprox ? { address: v.addressApprox } : {}),
        },
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://parancompany.co.kr" },
      { "@type": "ListItem", position: 2, name: "가이드", item: "https://parancompany.co.kr/guide" },
      { "@type": "ListItem", position: 3, name: "행사장 정보", item: "https://parancompany.co.kr/venues" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <VenuesClient venues={venues} />
    </>
  );
}
