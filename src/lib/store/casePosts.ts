// 진행 사례 글(인트라넷 총괄관리자 화면에서 쓰고 게시) — 서버에서 HTML 을 만들어 검색·AI 수집기가 바로 읽게 한다.
// 데이터: Supabase 공개 함수 site_public_posts(p_slug) (게시된 글의 공개 필드만, anon 키로 호출)
// 쓰는 곳: /work/p/[slug] (글 페이지), /api/store/cases, sitemap, /sitemap-cases.xml, /llms.txt
import catalog from "./data/catalog.json";

export const SITE_URL = "https://parancompany.co.kr";
export const STORE_URL = "https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/site-cases/";
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type PostFile = { path: string; w?: number | null; h?: number | null; alt?: string };
export type PostBlock =
  | { t: "h"; text?: string }
  | { t: "p"; text?: string }
  | { t: "img"; files?: string[]; caption?: string }
  | { t: "faq"; q?: string; a?: string };
export type QuoteItem = { serviceId: string; options?: Record<string, string>; design?: number; qty?: number; label?: string };
export type CasePost = {
  slug: string;
  title: string;
  client: string;
  date: string;
  venue: string;
  summary: string;
  cover: string | null;
  cover_alt?: string | null;
  published: string | null;
  updated?: string | null;
  body?: PostBlock[];
  quote?: QuoteItem[];
  files?: Record<string, PostFile>;
};

/** site_public_posts 호출. slug 가 있으면 그 글 하나(본문 포함), 없으면 목록. 실패하면 null */
export async function fetchCasePosts(slug?: string, revalidate = 60): Promise<CasePost[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (slug !== undefined && (!SLUG.test(slug) || slug.length > 80)) return [];
  try {
    const res = await fetch(`${url}/rest/v1/rpc/site_public_posts`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: slug ?? null }),
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`rpc ${res.status}`);
    const items = await res.json();
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error("[casePosts]", err instanceof Error ? err.message : err);
    return null;
  }
}

export const postUrl = (slug: string) => `${SITE_URL}/work/p/${slug}`;
export const fileUrl = (path: string) =>
  /^(https?:)?\//.test(path) ? path : STORE_URL + path.split("/").map(encodeURIComponent).join("/");

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const paras = (t?: string) =>
  String(t || "")
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((x) => `<p>${esc(x).replace(/\n/g, "<br>")}</p>`)
    .join("");
const oneLine = (t?: string | null) => String(t || "").replace(/\s+/g, " ").trim();

type Catalog = { id: string; name: string }[];
const serviceName = (id: string) => (catalog as Catalog).find((p) => p.id === id)?.name ?? "";

/** 사진 대체 문구: 사진마다 쓴 alt → 묶음 설명 → 제목 + 순번 */
export function altOf(post: CasePost, f: PostFile | undefined, caption: string | undefined, n: number) {
  return oneLine(f?.alt) || oneLine(caption) || `${post.title} 사진 ${n}`;
}

/** 본문 사진을 순서대로(대표 사진 먼저, 중복 없이) — 구조화 데이터·이미지 사이트맵용 */
export function postImages(post: CasePost) {
  const files = post.files || {};
  const out: { url: string; alt: string; caption: string; w?: number | null; h?: number | null }[] = [];
  const seen = new Set<string>();
  let n = 0;
  if (post.cover) {
    const f = Object.values(files).find((x) => x.path === post.cover);
    out.push({ url: fileUrl(post.cover), alt: oneLine(post.cover_alt) || oneLine(f?.alt) || `${post.title} 대표 사진`, caption: "", w: f?.w, h: f?.h });
    seen.add(post.cover);
  }
  for (const b of post.body || []) {
    if (b.t !== "img") continue;
    for (const id of b.files || []) {
      const f = files[id];
      n += 1;
      if (!f || seen.has(f.path)) continue;
      seen.add(f.path);
      out.push({ url: fileUrl(f.path), alt: altOf(post, f, b.caption, n), caption: oneLine(b.caption), w: f.w, h: f.h });
    }
  }
  return out;
}

export function postFaqs(post: CasePost) {
  return (post.body || [])
    .filter((b): b is { t: "faq"; q?: string; a?: string } => b.t === "faq")
    .map((b) => ({ q: oneLine(b.q), a: String(b.a || "").trim() }))
    .filter((x) => x.q && x.a);
}

/** 글이 맡은 서비스 이름(견적 구성에서) */
export function postServices(post: CasePost) {
  return Array.from(new Set((post.quote || []).map((q) => serviceName(q.serviceId)).filter(Boolean)));
}

/** 검색 설명: 요약 → 본문 첫 문단. 160자 안 */
export function postDescription(post: CasePost) {
  const first = (post.body || []).find((b) => b.t === "p" && b.text?.trim()) as { text?: string } | undefined;
  const d = oneLine(post.summary) || oneLine(first?.text) || `${post.title} — 파란컴퍼니 진행 사례`;
  return d.length > 160 ? d.slice(0, 157) + "…" : d;
}

/** 글 본문 HTML (화면 스크립트 site-cases_1.0.js 의 postView 와 같은 모양). 견적 구성은 [data-case-quote] 에 스크립트가 채움 */
export function renderPostHtml(post: CasePost) {
  const files = post.files || {};
  const services = postServices(post);
  const facts: [string, string][] = (
    [
      ["발주", post.client],
      ["행사일", post.date],
      ["장소", post.venue],
      ["맡은 일", services.join(", ")],
    ] as [string, string][]
  ).filter((x) => x[1]);
  let n = 0;
  const faqs: string[] = [];
  const body = (post.body || [])
    .map((b) => {
      if (b.t === "h") return b.text?.trim() ? `<h2>${esc(b.text)}</h2>` : "";
      if (b.t === "p") return paras(b.text);
      if (b.t === "faq") {
        if (b.q?.trim() && b.a?.trim()) faqs.push(`<div class="post-faq-item"><h3>${esc(oneLine(b.q))}</h3>${paras(b.a)}</div>`);
        return "";
      }
      if (b.t === "img") {
        const fs = (b.files || []).map((id) => ({ f: files[id], n: ++n })).filter((x) => x.f);
        if (!fs.length) return "";
        return `<figure class="post-photos n${Math.min(fs.length, 3)}">${fs
          .map(
            ({ f, n }) =>
              `<a href="${esc(fileUrl(f.path))}" target="_blank" rel="noopener"><img src="${esc(fileUrl(f.path))}" alt="${esc(altOf(post, f, b.caption, n))}" ${
                f.w ? `width="${f.w}" height="${f.h}"` : ""
              } loading="lazy" decoding="async"></a>`
          )
          .join("")}${b.caption?.trim() ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>`;
      }
      return "";
    })
    .join("");
  const cover = post.cover ? postImages(post)[0] : null;
  return `<article class="post">
  <header class="wrap post-head"><nav class="post-crumbs" aria-label="현재 위치"><a class="text-link back" href="/work/">← 진행 사례</a></nav><h1>${esc(post.title)}</h1>${
    post.summary ? `<p class="post-lead">${esc(post.summary)}</p>` : ""
  }
   ${facts.length ? `<dl class="case-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}</header>
  ${
    cover
      ? `<div class="wrap case-hero"><img src="${esc(cover.url)}" alt="${esc(cover.alt)}" ${cover.w ? `width="${cover.w}" height="${cover.h}"` : 'width="1400" height="900"'} fetchpriority="high" decoding="async"></div>`
      : ""
  }
  <div class="wrap post-body">${body}${faqs.length ? `<section class="post-faq" aria-labelledby="post-faq-h"><h2 id="post-faq-h">자주 묻는 질문</h2>${faqs.join("")}</section>` : ""}</div></article>
  <div data-case-quote></div>
  <section class="wrap"><div class="callout"><h2>비슷한 행사를 준비하고 계신가요?</h2><p>필요한 구성만 골라 맡기거나, 행사 전체를 상담할 수 있습니다.</p><a class="button primary" href="/request/?mode=consult">내 행사 상담하기 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></section>`;
}

/** 구조화 데이터(JSON-LD): 글(Article) + 사진(ImageObject) + 위치(BreadcrumbList) + 자주 묻는 질문(FAQPage) */
export function postJsonLd(post: CasePost) {
  const url = postUrl(post.slug);
  const org = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "파란컴퍼니", url: SITE_URL, logo: `${SITE_URL}/logo.svg` };
  const images = postImages(post).map((im) => ({
    "@type": "ImageObject",
    contentUrl: im.url,
    url: im.url,
    name: im.alt,
    description: im.caption || im.alt,
    ...(im.w ? { width: im.w, height: im.h } : {}),
    creator: { "@type": "Organization", name: "파란컴퍼니" },
    creditText: "파란컴퍼니",
    copyrightNotice: "© 파란컴퍼니",
  }));
  const text = (post.body || [])
    .filter((b) => b.t === "p" || b.t === "h")
    .map((b) => oneLine((b as { text?: string }).text))
    .filter(Boolean)
    .join(" ");
  const services = postServices(post);
  const faqs = postFaqs(post);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title.slice(0, 110),
      description: postDescription(post),
      articleBody: text.slice(0, 5000),
      inLanguage: "ko-KR",
      url,
      mainEntityOfPage: url,
      image: images,
      ...(post.published ? { datePublished: post.published } : {}),
      ...(post.updated || post.published ? { dateModified: post.updated || post.published } : {}),
      author: org,
      publisher: org,
      ...(services.length ? { about: services.map((name) => ({ "@type": "Service", name, provider: { "@id": `${SITE_URL}/#organization` } })) } : {}),
      ...(post.client ? { sourceOrganization: { "@type": "Organization", name: post.client } } : {}),
      isPartOf: { "@type": "CollectionPage", name: "파란컴퍼니 진행 사례", url: `${SITE_URL}/work` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "진행 사례", item: `${SITE_URL}/work` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (faqs.length)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  // </script> 로 끝나는 글자가 들어가도 태그가 끝나지 않게
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

/** 서비스 사이트 글 틀(public/store/work/p/index.html)에 머리 정보와 본문을 넣는다 */
export function fillTemplate(tpl: string, post: CasePost | null) {
  const setMeta = (html: string, attr: string, name: string, value: string) => {
    const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
    return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html.replace("</head>", `<meta ${attr}="${name}" content="${esc(value)}"></head>`);
  };
  if (!post) {
    let html = tpl.replace(/<title>[^<]*<\/title>/, "<title>사례를 찾을 수 없습니다 | 파란컴퍼니</title>");
    html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,follow">');
    return html.replace(
      /<div data-case-view>[\s\S]*?<\/noscript>/,
      `<div data-case-view data-ssr="missing"><section class="page-intro wrap"><h1>사례를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 게시가 내려간 사례입니다.</p><a class="button primary" href="/work/">진행 사례 전체 보기</a></section></div>`
    );
  }
  const url = postUrl(post.slug);
  const title = `${post.title} | 파란컴퍼니 진행 사례`;
  const desc = postDescription(post);
  const image = postImages(post)[0];
  let html = tpl.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  html = setMeta(html, "name", "description", desc);
  html = setMeta(html, "property", "og:type", "article");
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", desc);
  html = setMeta(html, "property", "og:url", url);
  if (image) {
    html = setMeta(html, "property", "og:image", image.url);
    html = setMeta(html, "property", "og:image:alt", image.alt);
  }
  if (post.published) html = setMeta(html, "property", "article:published_time", post.published);
  if (post.updated) html = setMeta(html, "property", "article:modified_time", post.updated);
  html = html.replace("</head>", `<script type="application/ld+json">${postJsonLd(post)}</script></head>`);
  return html.replace(
    /<div data-case-view>[\s\S]*?<\/noscript>/,
    `<div data-case-view data-ssr="${esc(post.slug)}">${renderPostHtml(post)}</div>`
  );
}
