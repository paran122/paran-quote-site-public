import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그",
  description:
    "행사 기획 노하우, 트렌드, 체크리스트, 고객 후기까지. 파란컴퍼니의 행사 전문 인사이트를 만나보세요.",
  openGraph: {
    title: "블로그 | 파란컴퍼니",
    description:
      "행사 기획 노하우, 트렌드, 체크리스트, 고객 후기까지. 파란컴퍼니의 행사 전문 인사이트를 만나보세요.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
