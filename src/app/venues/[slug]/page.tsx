import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchVenueBySlug, fetchPortfolioBySlug } from "@/lib/queries";
import type { Portfolio, Venue } from "@/types";
import { facilityLabel, typeLabel } from "@/lib/venueMeta";
import VenueDetailClient from "./VenueDetailClient";

type Props = { params: { slug: string } };

const won = (n: number) => Number(n).toLocaleString("ko-KR");
function rentalText(min?: number | null, max?: number | null): string | null {
  if (min != null && max != null) return min === max ? `${won(min)}원` : `${won(min)}~${won(max)}원`;
  if (min != null) return `${won(min)}원부터`;
  if (max != null) return `${won(max)}원까지`;
  return null;
}

// 데이터 기반 FAQ (AEO/GEO — 기획자 실제 질문 + 직답)
function buildFaq(v: Venue): { q: string; a: string }[] {
  const faq: { q: string; a: string }[] = [];
  const halls = v.halls ?? [];
  if (v.maxCapacity) {
    const hallDesc = halls.filter((h) => h.max_capacity).map((h) => `${h.name} ${won(h.max_capacity!)}명`).slice(0, 4).join(", ");
    faq.push({
      q: `${v.name}은(는) 최대 몇 명까지 수용하나요?`,
      a: `${v.name}은(는) 최대 ${won(v.maxCapacity)}명까지 수용 가능합니다.${hallDesc ? ` ${halls.length}개 홀을 운영하며 ${hallDesc} 규모입니다.` : ""}`,
    });
  }
  if (v.eventFit?.length) {
    faq.push({ q: `${v.name}은(는) 어떤 행사에 적합한가요?`, a: `${v.eventFit.join(", ")} 등에 적합한 ${typeLabel(v.venueType)}입니다.` });
  }
  const rental = halls.map((h) => rentalText(h.rental_min, h.rental_max)).find(Boolean);
  faq.push({
    q: `${v.name} 대관료는 얼마인가요?`,
    a: rental ? `대관료는 약 ${rental} 수준이며, 행사 규모·일정에 따라 달라집니다. 정확한 견적은 파란컴퍼니로 문의 주세요.` : `대관료는 행사 규모·일정에 따라 달라집니다. 파란컴퍼니로 문의 주시면 안내드립니다.`,
  });
  if (v.region || v.addressApprox) {
    faq.push({ q: `${v.name}은(는) 어디에 위치해 있나요?`, a: `${[v.region, v.addressApprox].filter(Boolean).join(" ")}에 위치합니다.` });
  }
  if (v.facilities?.length) {
    faq.push({ q: `${v.name}은(는) 어떤 시설을 갖추고 있나요?`, a: `${v.facilities.map(facilityLabel).join(", ")} 등을 갖추고 있습니다.` });
  }
  return faq;
}

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
    "@type": "EventVenue",
    name: v.name,
    url,
    description: v.metaDescription || v.overview || undefined,
    ...(v.addressApprox || v.region
      ? { address: { "@type": "PostalAddress", ...(v.addressApprox ? { streetAddress: v.addressApprox } : {}), ...(v.region ? { addressRegion: v.region } : {}), addressCountry: "KR" } }
      : {}),
    ...(v.coverUrl ? { image: v.coverUrl } : {}),
    ...(v.images?.length ? { photo: v.images.slice(0, 12).map((i) => i.url) } : {}),
    ...(v.maxCapacity ? { maximumAttendeeCapacity: v.maxCapacity } : {}),
    ...(v.facilities?.length
      ? { amenityFeature: v.facilities.map((f) => ({ "@type": "LocationFeatureSpecification", name: facilityLabel(f), value: true })) }
      : {}),
    ...(v.halls?.length
      ? {
          containsPlace: v.halls.map((h) => ({
            "@type": "Place",
            name: h.name,
            ...(h.max_capacity ? { maximumAttendeeCapacity: h.max_capacity } : {}),
          })),
        }
      : {}),
  };
  const faq = buildFaq(v);
  const faqLd =
    faq.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;
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
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <VenueDetailClient venue={v} related={related} faq={faq} />
    </>
  );
}
