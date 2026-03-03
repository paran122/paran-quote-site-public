import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "견적 빌더",
  description:
    "행사 유형과 서비스를 선택하여 맞춤 견적을 간편하게 만들어보세요.",
  openGraph: {
    title: "견적 빌더 | 파란컴퍼니",
    description:
      "행사 유형과 서비스를 선택하여 맞춤 견적을 간편하게 만들어보세요.",
  },
};

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
