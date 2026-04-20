import type { Metadata } from "next";
import Link from "next/link";
import { fetchPublishedBlogPosts } from "@/lib/queries";

const SITE_URL = "https://parancompany.co.kr";

export const metadata: Metadata = {
  title: "김미경 대표 | 파란컴퍼니",
  description:
    "파란컴퍼니 대표 김미경. 행사 기획 경력 10년, 250건 이상의 공공기관·기업 행사 프로젝트를 총괄한 행사 기획 전문가입니다.",
  alternates: { canonical: `${SITE_URL}/authors/kim-mikyung` },
  openGraph: {
    title: "김미경 대표 | 파란컴퍼니",
    description: "행사 기획 경력 10년 · 250+ 프로젝트 총괄. 파란컴퍼니 대표.",
    type: "profile",
    url: `${SITE_URL}/authors/kim-mikyung`,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "김미경",
  jobTitle: "대표",
  worksFor: {
    "@type": "Organization",
    name: "파란컴퍼니",
    url: SITE_URL,
  },
  knowsAbout: [
    "행사 기획",
    "세미나 대행",
    "컨퍼런스 운영",
    "포럼 기획",
    "공공기관 행사",
  ],
  url: `${SITE_URL}/authors/kim-mikyung`,
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "김미경 대표", item: `${SITE_URL}/authors/kim-mikyung` },
  ],
};

export default async function AuthorPage() {
  let posts: Awaited<ReturnType<typeof fetchPublishedBlogPosts>> = [];
  try {
    posts = await fetchPublishedBlogPosts(undefined, 100);
  } catch {
    // ignore
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="mx-auto max-w-[720px] px-6">
          {/* 프로필 헤더 */}
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              김
            </div>
            <div>
              <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-[32px]">
                김미경
              </h1>
              <p className="mt-1 text-[15px] text-slate-500">
                파란컴퍼니 주식회사 대표
              </p>
              <p className="mt-0.5 text-[14px] text-slate-400">
                행사 기획 경력 10년 · 250+ 프로젝트 총괄
              </p>
            </div>
          </div>

          {/* 소개 */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">소개</h2>
            <p className="text-[14px] leading-[1.8] text-slate-600">
              2015년부터 공공기관과 기업을 대상으로 세미나, 컨퍼런스, 포럼, 학술대회 등
              다양한 행사를 기획하고 운영하고 있습니다. 교육부, 해군, 경기도교육청, 수원시 등
              정부 부처 및 지자체, 공기업의 행사를 수행하며 쌓은 경험을 바탕으로
              행사 기획의 실무 노하우를 공유합니다.
            </p>
          </div>

          {/* 전문 분야 */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">전문 분야</h2>
            <ul className="space-y-2 text-[14px] text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                공공기관 행사 기획·대행 (세미나, 포럼, 컨퍼런스)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                기업행사 기획 (산업 세미나, 워크숍, 비전선포식)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                행사 디자인 총괄 (포스터, 현수막, 자료집, 공간연출)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                전국 순회 교육·시리즈 행사 운영
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                행사 결과보고서·정산 자료 작성
              </li>
            </ul>
          </div>

          {/* 주요 고객 */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">주요 고객</h2>
            <p className="text-[14px] leading-[1.8] text-slate-600">
              교육부, 해군, 경기도교육청, 수원시, 한국예술인복지재단, 경기도평생교육진흥원 등
              정부 부처·지자체·공기업과 민간기업
            </p>
          </div>

          {/* 소속 회사 */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">소속 회사</h2>
            <div className="text-[14px] leading-[1.8] text-slate-600 space-y-1">
              <p><span className="font-medium text-slate-700">파란컴퍼니 주식회사</span></p>
              <p>설립 2015년 · 여성기업 인증 · 직접생산확인증명서 보유</p>
              <p>경기도 수원시 팔달구 효원로 278, 6층 603호</p>
            </div>
          </div>

          {/* 문의 */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">문의 및 협업</h2>
            <div className="text-[14px] text-slate-600 space-y-1">
              <p>
                이메일:{" "}
                <a href="mailto:info@parancompany.co.kr" className="text-primary hover:underline">
                  info@parancompany.co.kr
                </a>
              </p>
              <p>
                전화:{" "}
                <a href="tel:02-6342-2800" className="text-primary hover:underline">
                  02-6342-2800
                </a>
                <span className="text-slate-400"> (평일 09:00~18:00)</span>
              </p>
              <p>
                카카오톡:{" "}
                <a
                  href="https://pf.kakao.com/_xkexdLG"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  파란컴퍼니
                </a>
              </p>
            </div>
          </div>

          {/* 작성한 글 */}
          {posts.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-6 text-[14px] font-semibold tracking-[0.12em] text-slate-900">
                작성한 글 ({posts.length})
              </h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <h3 className="text-[15px] font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 text-[13px] text-slate-500 line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-[12px] text-slate-400">
                      {post.category && <span>{post.category}</span>}
                      {post.category && <span>·</span>}
                      <span>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
