import type { Metadata } from "next";
import DesignGroupPage from "../_components/DesignGroupPage";
import { DESIGN_GROUPS } from "../_groups";

const SITE_URL = "https://parancompany.co.kr";
const group = DESIGN_GROUPS.print;

export const metadata: Metadata = {
  title: `${group.metaTitle} | 파란컴퍼니`,
  description: group.metaDescription,
  keywords: group.keywords,
  alternates: { canonical: `${SITE_URL}/services/design/print` },
  openGraph: {
    title: `${group.metaTitle} | 파란컴퍼니`,
    description: group.metaDescription,
    type: "website",
    url: `${SITE_URL}/services/design/print`,
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: group.metaTitle }],
  },
  twitter: { card: "summary_large_image", title: `${group.metaTitle} | 파란컴퍼니`, description: group.metaDescription },
};

export default function PrintDesignPage() {
  return <DesignGroupPage group={group} />;
}
