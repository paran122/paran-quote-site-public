export default function JsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://paran-quote.netlify.app";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "파란컴퍼니",
    url: siteUrl,
    logo: `${siteUrl}/og-image.png`,
    description:
      "공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-2-6342-2801",
      contactType: "customer service",
      availableLanguage: "Korean",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "파란컴퍼니",
    image: `${siteUrl}/og-image.png`,
    url: siteUrl,
    telephone: "+82-2-6342-2801",
    address: {
      "@type": "PostalAddress",
      addressLocality: "서울",
      addressCountry: "KR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: {
      "@type": "Country",
      name: "대한민국",
    },
    priceRange: "$$",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "파란컴퍼니",
    url: siteUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
