import type { Metadata } from "next";
import { fetchLecturers } from "@/lib/queries";
import type { Lecturer } from "@/types";
import LecturersClient from "./LecturersClient";

export const metadata: Metadata = {
  title: "명사 정보 | 파란컴퍼니",
  description:
    "분야별 강사 정보입니다. 강의 주제·약력을 확인하고 문의해 주세요.",
  alternates: { canonical: "https://parancompany.co.kr/lecturers" },
};

export default async function LecturersPage() {
  let lecturers: Lecturer[] = [];
  try {
    lecturers = await fetchLecturers();
  } catch {
    lecturers = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "파란컴퍼니 강사 정보",
    description: "파란컴퍼니 강사 정보 목록입니다.",
    url: "https://parancompany.co.kr/lecturers",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: lecturers.length,
      itemListElement: lecturers.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: l.name,
          url: `https://parancompany.co.kr/lecturers/${l.slug}`,
          jobTitle: "강사",
          ...(l.coverUrl ? { image: l.coverUrl } : {}),
          ...(l.category ? { knowsAbout: l.category } : {}),
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
      { "@type": "ListItem", position: 3, name: "명사 정보", item: "https://parancompany.co.kr/lecturers" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LecturersClient lecturers={lecturers} />
    </>
  );
}
