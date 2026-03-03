import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "파란컴퍼니 | 행사 기획·디자인·운영 전문 에이전시",
    short_name: "파란컴퍼니",
    description:
      "공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
