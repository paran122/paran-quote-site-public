import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchVenueBySlug, fetchPortfolioBySlug } from "@/lib/queries";
import type { Portfolio } from "@/types";
import VenueDetailClient from "./VenueDetailClient";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const v = await fetchVenueBySlug(slug).catch(() => null);
  if (!v) return {};
  const url = `https://parancompany.co.kr/venues/${v.slug}`;
  return {
    title: v.metaTitle || `${v.name} 행사장 정보 | 파란컴퍼니`,
    description: v.metaDescription || `${v.region ?? ""} ${v.name} 행사장 정보입니다.`,
    alternates: { canonical: url },
    openGraph: {
      title: v.metaTitle || v.name,
      description: v.metaDescription || "",
      url,
      ...(v.coverUrl ? { images: [{ url: v.coverUrl }] } : {}),
    },
  };
}

export default async function VenueDetailPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const v = await fetchVenueBySlug(slug).catch(() => null);
  if (!v) notFound();

  let related: Portfolio[] = [];
  if (v.relatedPortfolioSlugs?.length) {
    const rows = await Promise.all(
      v.relatedPortfolioSlugs.map((s) => fetchPortfolioBySlug(s).catch(() => null))
    );
    related = rows.filter((r): r is Portfolio => !!r);
  }

  const url = `https://parancompany.co.kr/venues/${v.slug}`;
  const placeLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: v.name,
    url,
    ...(v.addressApprox ? { address: v.addressApprox } : {}),
    ...(v.coverUrl ? { photo: v.coverUrl } : {}),
    ...(v.maxCapacity ? { maximumAttendeeCapacity: v.maxCapacity } : {}),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://parancompany.co.kr" },
      { "@type": "ListItem", position: 2, name: "가이드", item: "https://parancompany.co.kr/guide" },
      { "@type": "ListItem", position: 3, name: "행사장 추천", item: "https://parancompany.co.kr/venues" },
      { "@type": "ListItem", position: 4, name: v.name, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <VenueDetailClient venue={v} related={related} />
    </>
  );
}
