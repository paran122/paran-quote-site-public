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
    default: "파란컴퍼니 - 행사 디자인·제작",
    template: "%s | 파란컴퍼니",
  },
  description:
    "공공기관 행사 디자인 전문 파란컴퍼니. 포스터·리플렛·현수막·포토월·부스·자료집까지 행사 디자인과 제작을 홈페이지에서 바로 견적 내고 맡길 수 있습니다.",
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
    title: "파란컴퍼니 - 행사 디자인·제작",
    description:
      "공공기관 행사 디자인 전문 파란컴퍼니. 포스터·리플렛·현수막·포토월·부스·자료집까지 행사 디자인과 제작을 홈페이지에서 바로 견적 내고 맡길 수 있습니다.",
    images: [
      {
        url: "/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "파란컴퍼니 - 행사 디자인·제작",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "파란컴퍼니 - 행사 디자인·제작",
    description:
      "공공기관 행사 디자인 전문 파란컴퍼니. 포스터·리플렛·현수막·포토월·부스·자료집까지 행사 디자인과 제작을 홈페이지에서 바로 견적 내고 맡길 수 있습니다.",
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
            // 2026-11-19 generate_lead 는 실제 접수가 끝난 화면(견적 요청)에서만 보낸다. 여기서는 전화·메일 누름과 견적 요청 이동만 기록(개인정보 없음)
            document.addEventListener('click', function(e){
              var a=e.target && e.target.closest ? e.target.closest('a[href]') : null;
              if(!a || !window.gtag) return;
              var h=a.getAttribute('href')||'';
              if(h.indexOf('tel:')===0){ window.gtag('event','contact_click',{method:'tel',page:location.pathname}); }
              else if(h.indexOf('mailto:')===0){ window.gtag('event','contact_click',{method:'email',page:location.pathname}); }
              else if(h.indexOf('/request')===0){ window.gtag('event','begin_checkout',{lead_type:h.indexOf('mode=consult')>-1?'consult':'quote',page:location.pathname}); }
              else if(/^\\/services\\/[a-z-]+\\/?$/.test(h) && location.pathname.indexOf('/blog/')===0){ window.gtag('event','blog_service_click',{service_id:h.split('/')[2],page:location.pathname}); }
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
