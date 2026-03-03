import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 목록",
  description:
    "컨퍼런스, 세미나, 기업행사에 필요한 모든 서비스를 한눈에 비교하고 견적을 받아보세요.",
  openGraph: {
    title: "서비스 목록 | 파란컴퍼니",
    description:
      "컨퍼런스, 세미나, 기업행사에 필요한 모든 서비스를 한눈에 비교하고 견적을 받아보세요.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
