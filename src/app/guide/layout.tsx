import type { Metadata } from "next";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: {
    template: "%s | 행사 가이드 | 파란컴퍼니",
    default: "행사 가이드 | 파란컴퍼니",
  },
  description:
    "행사 준비 체크리스트, 진행 절차, 비용 가이드, 장소 선택, 규모별 가이드까지. 행사 기획에 필요한 모든 정보를 확인하세요.",
  alternates: { canonical: `${SITE_URL}/guide` },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
