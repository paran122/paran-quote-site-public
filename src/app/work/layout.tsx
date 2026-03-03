import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오",
  description:
    "파란컴퍼니가 성공적으로 진행한 1,200건 이상의 행사 포트폴리오를 확인하세요.",
  openGraph: {
    title: "포트폴리오 | 파란컴퍼니",
    description:
      "파란컴퍼니가 성공적으로 진행한 1,200건 이상의 행사 포트폴리오를 확인하세요.",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
