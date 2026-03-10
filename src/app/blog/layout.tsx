import type { Metadata } from "next";

const BLOG_DESCRIPTION =
  "행사 기획 노하우, 트렌드, 체크리스트, 고객 후기까지. 파란컴퍼니의 행사 전문 인사이트를 만나보세요.";

export const metadata: Metadata = {
  title: "블로그",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "https://parancompany.co.kr/blog",
  },
  openGraph: {
    title: "블로그 | 파란컴퍼니",
    description: BLOG_DESCRIPTION,
    type: "website",
    url: "https://parancompany.co.kr/blog",
  },
  twitter: {
    card: "summary",
    title: "블로그 | 파란컴퍼니",
    description: BLOG_DESCRIPTION,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
