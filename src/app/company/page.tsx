import { Suspense } from "react";
import type { Metadata } from "next";
import CompanyPage from "@/components/company/CompanyPage";
import { fetchCompanyBlogPosts } from "@/lib/queries";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "회사소개 - 파란컴퍼니 | 행사 전문 에이전시",
  description:
    "파란컴퍼니는 2015년 설립 이래 공공기관·기업의 세미나, 컨퍼런스, 포럼, 축제를 기획부터 운영까지 원스톱으로 제공하는 행사 전문 에이전시입니다. 250+ 프로젝트, 90% 재계약률.",
  alternates: {
    canonical: `${siteUrl}/company`,
  },
  openGraph: {
    title: "회사소개 - 파란컴퍼니 | 행사 전문 에이전시",
    description:
      "2015년 설립, 250+ 프로젝트 수행. 공공기관·기업 행사 기획·디자인·운영 전문 에이전시.",
    url: `${siteUrl}/company`,
  },
};

export default async function Company() {
  let blogPosts: Awaited<ReturnType<typeof fetchCompanyBlogPosts>> = [];
  try {
    blogPosts = await fetchCompanyBlogPosts();
  } catch {
    blogPosts = [];
  }

  return (
    <Suspense>
      <CompanyPage blogPosts={blogPosts} />
    </Suspense>
  );
}
