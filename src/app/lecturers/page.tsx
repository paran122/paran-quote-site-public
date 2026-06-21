import type { Metadata } from "next";
import { fetchLecturers } from "@/lib/queries";
import type { Lecturer } from "@/types";
import LecturersClient from "./LecturersClient";

export const metadata: Metadata = {
  title: "강사 섭외 — 파란컴퍼니가 검증한 강사 풀 | 파란컴퍼니",
  description:
    "파란컴퍼니가 직접 협업·검증한 강사 데이터베이스. 분야별로 강사를 찾고 강의 주제·약력을 확인한 뒤, 섭외부터 일정 조율까지 대행받으세요.",
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
    name: "파란컴퍼니 강사 풀",
    description: "파란컴퍼니가 협업·검증한 강사 목록입니다.",
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
      { "@type": "ListItem", position: 3, name: "강사 섭외", item: "https://parancompany.co.kr/lecturers" },
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
