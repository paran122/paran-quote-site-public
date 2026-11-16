// 진행 사례 글(인트라넷 총괄관리자 화면에서 쓰고 게시) — 서버에서 HTML 을 만들어 검색·AI 수집기가 바로 읽게 한다.
// 데이터: Supabase 공개 함수 site_public_posts(p_slug) (게시된 글의 공개 필드만, anon 키로 호출)
// 쓰는 곳: /work/p/[slug] (글 페이지·.md 원문), /work 목록(work-list), sitemap, /sitemap-cases.xml, /llms.txt
//
// 사진 주소는 우리 도메인으로 보낸다(이미지 검색에 parancompany.co.kr 로 잡히게). netlify.toml·next.config 가 Supabase 로 넘김:
//   /media/<path>            원본(webp)              → storage/v1/object/public/site-cases/<path>
//   /media-r/<path>?width=N  크기 줄인 사진(브라우저는 webp, 공유 미리보기 수집기는 jpeg) → storage/v1/render/image/public/site-cases/<path>
import catalog from "./data/catalog.json";

export const SITE_URL = "https://parancompany.co.kr";
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
  cover_w?: number | null;
  cover_h?: number | null;
  services?: string[];
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

export const postPath = (slug: string) => `/work/p/${slug}`;
export const postUrl = (slug: string) => SITE_URL + postPath(slug);

// ---------- 사진 주소 ----------
const encPath = (path: string) => path.split("/").map(encodeURIComponent).join("/");
/** 원본 사진(상대 주소). DB 경로가 '/'·http 로 시작하면 시험 데이터로 그대로 */
export const mediaPath = (path: string) => (/^(https?:)?\//.test(path) ? path : `/media/${encPath(path)}`);
/** 폭 w 로 줄인 사진(상대 주소). resize=contain 필수: 빼면 Supabase 가 원본 높이를 유지한 채 가로를 잘라냄 */
export const sizedPath = (path: string, w: number) =>
  /^(https?:)?\//.test(path) ? path : `/media-r/${encPath(path)}?width=${w}&resize=contain&quality=80`;
const abs = (p: string) => (/^https?:/.test(p) ? p : SITE_URL + p);
const WIDTHS = [480, 800, 1200, 1600, 2400];
/** srcset: 원본 폭보다 큰 크기는 빼고, 원본 폭(최대 2400)까지 */
function srcset(path: string, w?: number | null) {
  if (/^(https?:)?\//.test(path)) return "";
  const max = Math.min(w || 2400, 2400);
  const ws = WIDTHS.filter((x) => x < max).concat(max);
  return ws.map((x) => `${sizedPath(path, x)} ${x}w`).join(", ");
}
function imgTag(path: string, alt: string, w: number | null | undefined, h: number | null | undefined, sizes: string, eager = false) {
  const ss = srcset(path, w);
  return `<img src="${esc(sizedPath(path, Math.min(w || 1200, 1200)))}"${ss ? ` srcset="${esc(ss)}" sizes="${sizes}"` : ""} alt="${esc(alt)}"${
    w && h ? ` width="${w}" height="${h}"` : ""
  } ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

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
/** 2026-11-17T… → 2026.11.17 (한국 시각) */
export function ymd(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  return isNaN(d.getTime()) ? "" : `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
}

type Catalog = { id: string; name: string }[];
export const serviceName = (id: string) => (catalog as Catalog).find((p) => p.id === id)?.name ?? "";
const LIVE_SERVICES = new Set(["banner", "booklet", "booth-graphic", "booth-operation", "card-news", "leaflet", "photo-wall", "poster", "ppt"]);

/** 사진 대체 문구: 사진마다 쓴 alt → 묶음 설명 → 제목 + 순번 */
export function altOf(post: CasePost, f: PostFile | undefined, caption: string | undefined, n: number) {
  return oneLine(f?.alt) || oneLine(caption) || `${post.title} 사진 ${n}`;
}

/** 본문 사진을 순서대로(대표 사진 먼저, 중복 없이). url 은 우리 도메인 원본 주소 */
export function postImages(post: CasePost) {
  const files = post.files || {};
  const out: { path: string; url: string; alt: string; caption: string; w?: number | null; h?: number | null }[] = [];
  const seen = new Set<string>();
  let n = 0;
  if (post.cover) {
    const f = Object.values(files).find((x) => x.path === post.cover);
    out.push({ path: post.cover, url: abs(mediaPath(post.cover)), alt: oneLine(post.cover_alt) || oneLine(f?.alt) || `${post.title} 대표 사진`, caption: "", w: f?.w ?? post.cover_w, h: f?.h ?? post.cover_h });
    seen.add(post.cover);
  }
  for (const b of post.body || []) {
    if (b.t !== "img") continue;
    for (const id of b.files || []) {
      const f = files[id];
      n += 1;
      if (!f || seen.has(f.path)) continue;
      seen.add(f.path);
      out.push({ path: f.path, url: abs(mediaPath(f.path)), alt: altOf(post, f, b.caption, n), caption: oneLine(b.caption), w: f.w, h: f.h });
    }
  }
  return out;
}

/** 공유 미리보기 사진: 가로 사진 우선(세로 표지는 미리보기에서 잘림), 1200px jpeg/webp */
export function shareImage(post: CasePost) {
  const imgs = postImages(post);
  const pick = imgs.find((x) => x.w && x.h && x.w >= x.h * 1.2) || imgs[0];
  if (!pick) return null;
  const w = Math.min(pick.w || 1200, 1200);
  const h = pick.w && pick.h ? Math.round((pick.h * w) / pick.w) : null;
  return { url: abs(sizedPath(pick.path, w)), alt: pick.alt, w, h };
}

export function postFaqs(post: CasePost) {
  return (post.body || [])
    .filter((b): b is { t: "faq"; q?: string; a?: string } => b.t === "faq")
    .map((b) => ({ q: oneLine(b.q), a: String(b.a || "").trim() }))
    .filter((x) => x.q && x.a);
}

/** 글이 맡은 서비스 id(견적 구성 순서, 중복 없이) */
export function postServiceIds(post: CasePost) {
  return Array.from(new Set(post.services?.length ? post.services : (post.quote || []).map((q) => q.serviceId))).filter((id) => serviceName(id));
}
export const postServices = (post: CasePost) => postServiceIds(post).map(serviceName);

/** 검색 설명: 요약 → 본문 첫 문단. 160자 안 */
export function postDescription(post: CasePost) {
  const first = (post.body || []).find((b) => b.t === "p" && b.text?.trim()) as { text?: string } | undefined;
  const d = oneLine(post.summary) || oneLine(first?.text) || `${post.title} — 파란컴퍼니 진행 사례`;
  return d.length > 160 ? d.slice(0, 157) + "…" : d;
}

/** 글 본문 HTML (화면 스크립트 site-cases_1.0.js 의 postView 와 같은 모양). 견적 구성은 [data-case-quote] 에 스크립트가 채움 */
export function renderPostHtml(post: CasePost) {
  const files = post.files || {};
  const ids = postServiceIds(post);
  const serviceLinks = ids
    .map((id) => (LIVE_SERVICES.has(id) ? `<a href="/services/${id}/">${esc(serviceName(id))}</a>` : esc(serviceName(id))))
    .join(", ");
  const facts: [string, string][] = (
    [
      ["발주", esc(post.client)],
      ["행사일", esc(post.date)],
      ["장소", esc(post.venue)],
      ["맡은 일", serviceLinks],
    ] as [string, string][]
  ).filter((x) => x[1]);
  const pub = ymd(post.published), upd = ymd(post.updated);
  const dates = pub
    ? `<p class="post-dates"><span>게시 <time datetime="${esc(post.published)}">${pub}</time></span>${
        upd && upd > pub ? `<span>수정 <time datetime="${esc(post.updated)}">${upd}</time></span>` : ""
      }<span>글 파란컴퍼니</span></p>`
    : "";
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
        const sizes = fs.length === 1 ? "(min-width: 1000px) 920px, 100vw" : fs.length === 2 ? "(min-width: 1000px) 460px, 50vw" : "(min-width: 1000px) 310px, 50vw";
        return `<figure class="post-photos n${Math.min(fs.length, 3)}">${fs
          .map(({ f, n }) => `<a href="${esc(mediaPath(f.path))}" target="_blank" rel="noopener">${imgTag(f.path, altOf(post, f, b.caption, n), f.w, f.h, sizes)}</a>`)
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
   ${facts.length ? `<dl class="case-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>` : ""}${dates}</header>
  ${cover ? `<div class="wrap case-hero">${imgTag(cover.path, cover.alt, cover.w, cover.h, "(min-width: 1000px) 720px, 100vw", true)}</div>` : ""}
  <div class="wrap post-body">${body}${faqs.length ? `<section class="post-faq" aria-labelledby="post-faq-h"><h2 id="post-faq-h">자주 묻는 질문</h2>${faqs.join("")}</section>` : ""}</div></article>
  <div data-case-quote></div>
  <section class="wrap"><div class="callout"><h2>비슷한 행사를 준비하고 계신가요?</h2><p>필요한 구성만 골라 맡기거나, 행사 전체를 상담할 수 있습니다.</p><a class="button primary" href="/request/?mode=consult">내 행사 상담하기 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></section>`;
}

const ORG_ID = `${SITE_URL}/#organization`;

/** 구조화 데이터(JSON-LD): 글(Article) + 사진(ImageObject) + 위치(BreadcrumbList) + 자주 묻는 질문(FAQPage). 회사(Organization)는 틀 머리에 있음 */
export function postJsonLd(post: CasePost) {
  const url = postUrl(post.slug);
  const images = postImages(post).map((im) => ({
    "@type": "ImageObject",
    contentUrl: im.url,
    url: im.url,
    name: im.alt,
    description: im.caption || im.alt,
    ...(im.w ? { width: im.w, height: im.h } : {}),
    creator: { "@id": ORG_ID },
    creditText: "파란컴퍼니",
    copyrightNotice: "© 파란컴퍼니",
  }));
  const text = (post.body || [])
    .filter((b) => b.t === "p" || b.t === "h")
    .map((b) => oneLine((b as { text?: string }).text))
    .filter(Boolean)
    .join(" ");
  const services = postServiceIds(post);
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
      mainEntityOfPage: { "@type": "WebPage", "@id": url, url, isPartOf: { "@id": `${SITE_URL}/#website` } },
      image: images,
      ...(post.published ? { datePublished: post.published } : {}),
      ...(post.updated || post.published ? { dateModified: post.updated || post.published } : {}),
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      ...(services.length
        ? { about: services.map((id) => ({ "@type": "Service", name: serviceName(id), provider: { "@id": ORG_ID }, ...(LIVE_SERVICES.has(id) ? { url: `${SITE_URL}/services/${id}` } : {}) })) }
        : {}),
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

/** AI 도구용 마크다운 원문 (/work/p/<주소이름>.md) */
export function postMarkdown(post: CasePost) {
  const files = post.files || {};
  const md = (t?: string | null) => String(t || "").replace(/\r/g, "").trim();
  const lines: string[] = [`# ${oneLine(post.title)}`, ""];
  if (post.summary) lines.push(`> ${oneLine(post.summary)}`, "");
  const facts = [
    ["발주", post.client],
    ["행사일", post.date],
    ["장소", post.venue],
    ["맡은 일", postServices(post).join(", ")],
    ["게시", ymd(post.published)],
    ["수정", ymd(post.updated) > ymd(post.published) ? ymd(post.updated) : ""],
    ["작성", "파란컴퍼니"],
    ["원문", postUrl(post.slug)],
  ].filter((x) => x[1]);
  lines.push(...facts.map(([k, v]) => `- ${k}: ${v}`), "");
  let n = 0;
  const faqs = postFaqs(post);
  for (const b of post.body || []) {
    if (b.t === "h" && b.text?.trim()) lines.push(`## ${oneLine(b.text)}`, "");
    else if (b.t === "p" && b.text?.trim()) lines.push(md(b.text), "");
    else if (b.t === "img") {
      for (const id of b.files || []) {
        const f = files[id];
        n += 1;
        if (f) lines.push(`![${altOf(post, f, b.caption, n).replace(/[[\]]/g, "")}](${abs(mediaPath(f.path))})`);
      }
      if (b.caption?.trim()) lines.push(`*${oneLine(b.caption)}*`);
      lines.push("");
    }
  }
  if (faqs.length) {
    lines.push("## 자주 묻는 질문", "");
    for (const f of faqs) lines.push(`### ${f.q}`, "", md(f.a), "");
  }
  const ids = postServiceIds(post).filter((id) => LIVE_SERVICES.has(id));
  if (ids.length) lines.push("## 관련 서비스", "", ...ids.map((id) => `- [${serviceName(id)}](${SITE_URL}/services/${id})`), "");
  lines.push(`문의: 파란컴퍼니 02-6342-2800 · info@parancompany.co.kr · ${SITE_URL}/request/?mode=consult`, "");
  return lines.join("\n");
}

const setMeta = (html: string, attr: string, name: string, value: string) => {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`);
  return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html.replace("</head>", `<meta ${attr}="${name}" content="${esc(value)}"></head>`);
};

/** 서비스 사이트 글 틀(public/store/work/p/index.html)에 머리 정보와 본문을 넣는다 */
export function fillTemplate(tpl: string, post: CasePost | null) {
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
  const share = shareImage(post);
  let html = tpl.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}"><link rel="alternate" type="text/markdown" href="${postPath(post.slug)}.md">`);
  html = setMeta(html, "name", "description", desc);
  html = setMeta(html, "property", "og:type", "article");
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", desc);
  html = setMeta(html, "property", "og:url", url);
  if (share) {
    html = setMeta(html, "property", "og:image", share.url);
    html = setMeta(html, "property", "og:image:alt", share.alt);
    if (share.h) {
      html = setMeta(html, "property", "og:image:width", String(share.w));
      html = setMeta(html, "property", "og:image:height", String(share.h));
    }
  }
  if (post.published) html = setMeta(html, "property", "article:published_time", post.published);
  if (post.updated) html = setMeta(html, "property", "article:modified_time", post.updated);
  html = html.replace("</head>", `<script type="application/ld+json">${postJsonLd(post)}</script></head>`);
  return html.replace(/<div data-case-view>[\s\S]*?<\/noscript>/, `<div data-case-view data-ssr="${esc(post.slug)}">${renderPostHtml(post)}</div>`);
}

/** /work 목록 틀에 게시된 글 카드를 서버에서 넣는다. 카드 모양은 틀의 첫 카드에서 class 를 읽어 같게 만든다.
 *  같은 제목의 예전 사례 카드는 숨김. 목록 구조화 데이터(ItemList)도 넣음 */
export function fillWorkList(tpl: string, posts: CasePost[]) {
  const shown = posts.filter((p) => p.cover);
  const open = tpl.match(/<div class="([^"]+)" data-cases-live="">/);
  if (!open || !shown.length) return tpl;
  const at = (open.index ?? 0) + open[0].length;
  const first = tpl.slice(at, at + 3000);
  const card = first.match(/^<div class="([^"]+)">/)?.[1] ?? "";
  const imgCls = first.match(/<img [^>]*class="([^"]+)"/)?.[1] ?? "";
  const textCls = first.match(/<img [^>]*>\s*<div class="([^"]+)">/)?.[1] ?? "";
  const linkCls = first.match(/<a class="([^"]+)" href=/)?.[1] ?? "";
  const arrow = '<svg aria-hidden="true" viewbox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"></path></svg>';
  const key = (s: string) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, "");
  const titles = new Set(shown.map((p) => key(p.title)));
  const cards = shown
    .map((p) => {
      const meta = [p.client, p.date].filter(Boolean).join(" · ");
      return `<div class="${card} is-live"><img alt="${esc(oneLine(p.cover_alt) || p.title + " 사례")}" class="${imgCls}" loading="lazy" src="${esc(sizedPath(p.cover!, 800))}"${
        p.cover_w && p.cover_h ? ` width="${p.cover_w}" height="${p.cover_h}"` : ""
      }/><div class="${textCls}"><span>${esc(meta)}</span><h3>${esc(p.title)} ${arrow}</h3>${p.summary ? `<p>${esc(p.summary)}</p>` : ""}<a class="${linkCls}" href="${postPath(
        p.slug
      )}"><span class="text">사례 자세히 보기</span></a></div></div>`;
    })
    .join("");
  // 같은 제목의 예전 카드 숨김
  let rest = tpl.slice(at).replace(new RegExp(`<div class="${card.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">([\\s\\S]*?<h3>([\\s\\S]*?)</h3>)`, "g"), (m, inner, h) =>
    titles.has(key(h)) ? `<div class="${card}" hidden>${inner}` : m
  );
  rest = cards + rest;
  let html = tpl.slice(0, at).replace(open[0], `<div class="${open[1]}" data-cases-live="" data-cases-ssr="">`) + rest;
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "파란컴퍼니 진행 사례",
    itemListElement: shown.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: postUrl(p.slug), name: p.title })),
  };
  html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(list).replace(/</g, "\\u003c")}</script></head>`);
  return html;
}
