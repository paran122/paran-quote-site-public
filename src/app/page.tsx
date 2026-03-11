import { Suspense } from "react";
import type { Metadata } from "next";
import LandingPage from "@/components/landing-v2/LandingPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "파란컴퍼니 - 행사 전문 에이전시 | 세미나·컨퍼런스·포럼 기획",
  description:
    "공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지 원스톱 서비스. 250+ 프로젝트 수행 실적, 합리적인 견적으로 성공적인 행사를 만듭니다.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "파란컴퍼니 - 행사 전문 에이전시 | 세미나·컨퍼런스·포럼 기획",
    description:
      "공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지 원스톱 서비스. 250+ 프로젝트 수행 실적.",
    url: siteUrl,
  },
};

export default function Home() {
  return (
    <Suspense>
      <LandingPage />
    </Suspense>
  );
}
