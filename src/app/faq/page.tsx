import type { Metadata } from "next";
import FAQClient from "./FAQClient";

const FAQ_DESCRIPTION =
  "파란컴퍼니 행사 대행 서비스, 비용, 진행 절차, 실적에 대한 자주 묻는 질문과 답변을 확인하세요.";

export const metadata: Metadata = {
  title: "자주 묻는 질문 (FAQ)",
  description: FAQ_DESCRIPTION,
  alternates: {
    canonical: "https://parancompany.co.kr/faq",
  },
  openGraph: {
    title: "자주 묻는 질문 (FAQ) | 파란컴퍼니",
    description: FAQ_DESCRIPTION,
    type: "website",
    url: "https://parancompany.co.kr/faq",
  },
  twitter: {
    card: "summary",
    title: "자주 묻는 질문 (FAQ) | 파란컴퍼니",
    description: FAQ_DESCRIPTION,
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
