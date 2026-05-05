import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_KR, Plus_Jakarta_Sans, DM_Sans, Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import GNB from "@/components/layout/GNB";
import Footer from "@/components/layout/Footer";
import SiteShell from "@/components/layout/SiteShell";
import ToastContainer from "@/components/ui/Toast";
import KakaoChatButton from "@/components/common/KakaoChatButton";
import SiteDataLoader from "@/components/SiteDataLoader";
import PublicShell from "@/components/layout/PublicShell";
import JsonLd from "./JsonLd";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-kr",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://parancompany.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "파란컴퍼니 - 행사 대행 전문",
    template: "%s | 파란컴퍼니",
  },
  description:
    "행사 대행 전문 업체 파란컴퍼니. 공공기관·기업 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지 원스톱 대행. 250+ 프로젝트 수행 실적, 합리적인 견적으로 성공적인 행사를 만듭니다.",
  keywords: [
    "행사 대행",
    "행사 대행사",
    "행사 기획 대행",
    "세미나 대행",
    "컨퍼런스 대행",
    "포럼 기획",
    "행사 견적",
    "행사 비용",
    "이벤트 견적",
    "공공기관 행사",
    "관공서 행사 대행",
    "기업행사",
    "이벤트 기획",
    "행사 디자인",
    "행사 시안물",
    "행사 포스터 제작",
    "행사 운영 대행",
    "축제 기획",
    "파란컴퍼니",
  ],
  authors: [{ name: "파란컴퍼니" }],
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "파란컴퍼니",
    title: "파란컴퍼니 - 행사 대행 전문",
    description:
      "행사 대행 전문 업체 파란컴퍼니. 공공기관·기업 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지 원스톱 대행. 250+ 프로젝트 수행 실적.",
    images: [
      {
        url: "/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "파란컴퍼니 - 행사 기획·디자인·운영 전문 에이전시",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "파란컴퍼니 - 행사 전문 에이전시",
    description:
      "공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지.",
    images: ["/og-image.png?v=2"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "AQlwyaqjv-Oq41I0ovA0CySBh2Ji-TOAoRg7I5vxuDE",
    other: { "naver-site-verification": "e08c3d5025076398553ebc132c64a7a63df8d3a4" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${plusJakartaSans.variable} ${dmSans.variable} ${inter.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MG8KFNPW');
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-323NGQ108L"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-323NGQ108L');
          gtag('config', 'AW-18041893092');
        `}
      </Script>
      <Script id="paran-engagement" strategy="afterInteractive">
        {`
          (function(){
            var engaged=false, scrolled=false;
            function onScroll(){ scrolled=true; window.removeEventListener('scroll', onScroll); }
            window.addEventListener('scroll', onScroll, {passive:true});
            setTimeout(function(){
              if(scrolled && !engaged){
                engaged=true;
                if(window.gtag){ window.gtag('event','engaged_view_60s',{event_category:'engagement',value:1}); }
                window.dataLayer.push({event:'engaged_view_60s'});
              }
            }, 60000);
            document.addEventListener('submit', function(e){
              var f=e.target;
              if(!f || f.tagName!=='FORM') return;
              var id=f.id || f.getAttribute('name') || 'unknown';
              if(window.gtag){
                window.gtag('event','generate_lead',{event_category:'conversion',form_id:id});
              }
              window.dataLayer.push({event:'generate_lead', form_id:id});
            }, true);
          })();
        `}
      </Script>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MG8KFNPW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PublicShell>
          <JsonLd />
          <SiteDataLoader />
          <GNB />
        </PublicShell>
        <SiteShell>
          <main className="flex-1">{children}</main>
        </SiteShell>
        <PublicShell>
          <Footer />
          <KakaoChatButton />
        </PublicShell>
        <ToastContainer />
      </body>
    </html>
  );
}
