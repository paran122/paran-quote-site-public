import type { Metadata } from "next";
import EventGroupPage from "../_components/EventGroupPage";
import { EVENT_SERVICES } from "../_events";

const SITE_URL = "https://parancompany.co.kr";
const service = EVENT_SERVICES.government;

export const metadata: Metadata = {
  title: `${service.metaTitle}`,
  description: service.metaDescription,
  keywords: service.keywords,
  alternates: { canonical: `${SITE_URL}/services/government` },
  openGraph: {
    title: `${service.metaTitle} | 파란컴퍼니`,
    description: service.metaDescription,
    type: "website",
    url: `${SITE_URL}/services/government`,
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: service.metaTitle }],
  },
  twitter: { card: "summary_large_image", title: `${service.metaTitle} | 파란컴퍼니`, description: service.metaDescription },
};

export default function GovernmentPage() {
  return <EventGroupPage service={service} />;
}
