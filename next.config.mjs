import { readFileSync } from "node:fs";

// 서비스 사이트(정적 생성물, public/store)가 차지하는 주소. 서비스 사이트 생성기가 store-routes.json 을 만든다.
const store = JSON.parse(
  readFileSync(new URL("./store-routes.json", import.meta.url), "utf8")
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      // 메인과 목록 주소는 새 서비스 사이트가 먼저 받는다. 그 밖의 주소(/blog, /work/[slug], /services/government 등)는 기존 그대로.
      beforeFiles: [
        { source: "/", destination: "/store/index.html" },
        ...store.pages.map((page) => ({
          source: `/${page}`,
          destination: `/store/${page}/index.html`,
        })),
        {
          source: `/services/:id(${store.services.join("|")})`,
          destination: "/store/services/:id/index.html",
        },
      ],
      // 기존 public/assets 에 없는 파일만 서비스 사이트 자산으로 넘긴다
      afterFiles: [
        { source: "/assets/:path*", destination: "/store/assets/:path*" },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aiarnrhftmuffmcninyl.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Cloudflare R2 (행사장 이미지 — 무료 egress)
        protocol: "https",
        hostname: "pub-85713526e67048ca8cd0fb733b2fe10e.r2.dev",
      },
    ],
  },
  async redirects() {
    return [
      // 서비스 라우트 재편 (2026-06): 발주처축 → 행사 형식축 3그룹
      { source: "/services/seminar", destination: "/services/education", permanent: true },
      { source: "/services/corporate", destination: "/services/booth", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
