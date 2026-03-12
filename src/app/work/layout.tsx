import type { Metadata } from "next";

const SITE_URL = "https://parancompany.co.kr";
const WORK_DESCRIPTION =
  "파란컴퍼니의 행사 대행 포트폴리오입니다. 경기도교육청, 해군, 한국문화예술교육진흥원 등 다양한 고객사의 세미나, 포럼, 전시, 행사운영 사례를 확인하세요.";

export const metadata: Metadata = {
  title: "포트폴리오 · 행사 대행 사례",
  description: WORK_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "포트폴리오 · 행사 대행 사례 | 파란컴퍼니",
    description: WORK_DESCRIPTION,
    url: `${SITE_URL}/work`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "파란컴퍼니 행사 대행 포트폴리오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "포트폴리오 · 행사 대행 사례 | 파란컴퍼니",
    description:
      "파란컴퍼니의 행사 대행 포트폴리오입니다. 다양한 고객사의 행사 사례를 확인하세요.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
