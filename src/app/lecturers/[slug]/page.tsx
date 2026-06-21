import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLecturerBySlug } from "@/lib/queries";
import type { Lecturer } from "@/types";
import { catLabel } from "@/lib/lecturerMeta";
import LecturerDetailClient from "./LecturerDetailClient";

type Props = { params: { slug: string } };

// 데이터 기반 FAQ (AEO/GEO — 강의 담당자 실제 질문 + 직답)
function buildFaq(l: Lecturer): { q: string; a: string }[] {
  const faq: { q: string; a: string }[] = [];
  if (l.lectureTitle) {
    faq.push({
      q: `${l.name} 강사는 어떤 주제로 강의하나요?`,
      a: `${l.name} 강사는 「${l.lectureTitle}」${l.category ? ` 등 ${l.category} 분야` : ""}를 강의합니다.${l.bio ? ` ${l.bio}` : ""}`,
    });
  }
  if (l.career?.length) {
    faq.push({
      q: `${l.name} 강사의 약력은 어떻게 되나요?`,
      a: `${l.career.slice(0, 6).join(", ")}.`,
    });
  }
  if (l.books?.length) {
    faq.push({
      q: `${l.name} 강사의 주요 강의 이력은 무엇인가요?`,
      a: `${l.books.join(", ")} 등이 있습니다.`,
    });
  }
  faq.push({
    q: `${l.name} 강사 섭외는 어떻게 하나요?`,
    a: `파란컴퍼니로 문의 주시면 ${l.name} 강사 섭외부터 일정 조율, 행사 운영까지 함께 진행해 드립니다.`,
  });
  return faq;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const l = await fetchLecturerBySlug(slug).catch(() => null);
  if (!l) return {};
  const url = `https://parancompany.co.kr/lecturers/${l.slug}`;
  return {
    title: l.metaTitle || `${l.name} 강사 — 강의 주제·약력 | 파란컴퍼니`,
    description: l.metaDescription || `${l.name} 강사 프로필. ${l.lectureTitle ?? ""}`.trim(),
    alternates: { canonical: url },
    openGraph: {
      title: l.metaTitle || `${l.name} 강사`,
      description: l.metaDescription || l.lectureTitle || "",
      url,
      ...(l.coverUrl ? { images: [{ url: l.coverUrl }] } : {}),
    },
  };
}

export default async function LecturerDetailPage({ params }: Props) {
  const slug = decodeURIComponent(params.slug);
  const l = await fetchLecturerBySlug(slug).catch(() => null);
  if (!l) notFound();

  const url = `https://parancompany.co.kr/lecturers/${l.slug}`;
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: l.name,
    url,
    jobTitle: "강사",
    description: l.metaDescription || l.bio || undefined,
    ...(l.coverUrl ? { image: l.coverUrl } : {}),
    ...(l.images?.length ? { image: l.images.slice(0, 8).map((i) => i.url) } : {}),
    ...(l.category ? { knowsAbout: l.category } : {}),
    worksFor: {
      "@type": "Organization",
      name: "파란컴퍼니",
      url: "https://parancompany.co.kr",
    },
  };
  const faq = buildFaq(l);
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
      { "@type": "ListItem", position: 3, name: "강사 섭외", item: "https://parancompany.co.kr/lecturers" },
      { "@type": "ListItem", position: 4, name: `${l.name} (${catLabel(l.category)})`, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <LecturerDetailClient lecturer={l} faq={faq} />
    </>
  );
}
