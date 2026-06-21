import type { Metadata } from "next";
import { fetchVenues } from "@/lib/queries";
import type { Venue } from "@/types";
import VenuesClient from "./VenuesClient";

export const metadata: Metadata = {
  title: "답사 행사장 — 파란컴퍼니가 직접 검증한 행사장 | 파란컴퍼니",
  description:
    "파란컴퍼니가 직접 답사·검증한 행사장 데이터베이스. 지역·수용 인원·행사 유형으로 후보를 찾고, 행사에 딱 맞는 장소를 추천받으세요.",
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
    name: "파란컴퍼니 답사 행사장",
    description: "파란컴퍼니가 직접 답사·검증한 행사장 목록입니다.",
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
      { "@type": "ListItem", position: 3, name: "행사장 추천", item: "https://parancompany.co.kr/venues" },
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
