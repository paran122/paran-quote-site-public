import type { Metadata } from "next";

const SITE_URL = "https://parancompany.co.kr";
const WORK_DESCRIPTION =
  "파란컴퍼니가 디자인한 행사 사례입니다. 경기도교육청, 해군, 한국문화예술교육진흥원 등 공공기관 행사의 포스터·리플렛·부스 디자인과 제작을 확인하세요.";

export const metadata: Metadata = {
  title: "진행 사례",
  description: WORK_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
  openGraph: {
    title: "진행 사례 | 파란컴퍼니",
    description: WORK_DESCRIPTION,
    url: `${SITE_URL}/work`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "파란컴퍼니 진행 사례" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "진행 사례 | 파란컴퍼니",
    description:
      "파란컴퍼니가 디자인한 행사 사례입니다. 경기도교육청, 해군, 한국문화예술교육진흥원 등 공공기관 행사의 포스터·리플렛·부스 디자인과 제작을 확인하세요.",
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
