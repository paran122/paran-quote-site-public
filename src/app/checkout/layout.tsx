import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "장바구니 & 견적 요청",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
