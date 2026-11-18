// 예전 사례(포트폴리오 표: portfolios · portfolio_media)를 새 진행 사례 글 모양(CasePost)으로 바꾼다.
// 쓰는 곳: /work/<주소이름> (work-case 경로). 예전 화면(옛 메뉴·옛 문구)을 대신해 새 사이트 틀로 보여 준다.
// 옮기는 것: 제목·발주처·일시·장소·참여 인원·제작물, 본문(프로젝트 설명), 현장 사진, 현장 영상.
// 옮기지 않는 것: 자동으로 붙던 '행사 대행' 홍보 문단·자주 묻는 질문·바로가기(지금 서비스 방향과 다름).
import type { Portfolio, PortfolioMedia } from "@/types";
import type { CasePost, PostBlock, PostFile } from "./casePosts";

const SKIP_SECTION = /(주요 담당 영역|함께 보면 좋은|자주 묻는 질문|FAQ|한눈에 보는 행사|관련 (서비스|페이지)|문의)/i;
const BOILER = /(대행 사례입니다|전 과정을 파란컴퍼니가 대행|대표 .*대행 사례|대행한 사례입니다|성공적으로 진행했습니다\.?$|무료 (상담|견적)|대행이 필요하시면|문의를 남겨)/;

/** '결과공유회을(를)' 처럼 자동으로 붙은 조사를 앞 글자 받침에 맞게 */
const JOSA: Record<string, [string, string]> = { "을(를)": ["을", "를"], "이(가)": ["이", "가"], "은(는)": ["은", "는"], "과(와)": ["과", "와"], "와(과)": ["과", "와"], "으로(로)": ["으로", "로"] };
const josa = (t: string) =>
  t.replace(/(.)\s?(을\(를\)|이\(가\)|은\(는\)|과\(와\)|와\(과\)|으로\(로\))/g, (_m, ch: string, j: string) => {
    const code = ch.charCodeAt(0);
    const hangul = code >= 0xac00 && code <= 0xd7a3;
    const batchim = hangul ? (code - 0xac00) % 28 : 0;
    const [withB, noB] = JOSA[j];
    const pick = j === "으로(로)" ? (batchim && batchim !== 8 ? withB : noB) : batchim ? withB : noB;
    return ch + pick;
  });

const clean = (t: string) =>
  josa(t)
    .replace(/\\([.~*_>#()\-+!\[\]])/g, "$1")
    .replace(/^(?:&gt;|>)+\s*/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]{1,3}/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();

/** 마크다운 본문 → 제목(h)·문단(p) 묶음. 표·홍보 구역·질문 답변은 뺀다 */
export function contentBlocks(md: string): PostBlock[] {
  const out: PostBlock[] = [];
  let skip = false;
  let para: string[] = [];
  const flush = () => {
    const text = para.join("\n").trim();
    if (text && !BOILER.test(text)) out.push({ t: "p", text });
    para = [];
  };
  for (const raw of String(md || "").replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    const h = line.match(/^#{1,4}\s+(.*)$/);
    if (h) {
      flush();
      const title = clean(h[1]);
      skip = SKIP_SECTION.test(title);
      if (!skip && title) out.push({ t: "h", text: title });
      continue;
    }
    if (skip) continue;
    if (!line) {
      flush();
      continue;
    }
    if (/^\|/.test(line) || /^[-:| ]+$/.test(line)) continue; // 표
    if (/^\*{0,2}\s*Q\./.test(line) || /^A\./.test(line)) continue; // 질문·답변
    const li = line.match(/^[-*+]\s+(.*)$/) || line.match(/^\d+[.)]\s+(.*)$/);
    const text = clean(li ? li[1] : line);
    if (text) para.push(li ? `· ${text}` : text);
  }
  flush();
  // 내용 없는 제목(다음이 바로 제목이거나 끝)은 뺀다
  return out.filter((b, i) => b.t !== "h" || (out[i + 1] && out[i + 1].t === "p"));
}

const dateText = (p: Portfolio) => {
  const m = String(p.eventDate || "").match(/^(\d{4})-(\d{1,2})/);
  if (m) return `${m[1]}년 ${Number(m[2])}월`;
  return p.year ? `${p.year}년` : "";
};

export function portfolioToPost(p: Portfolio, media: PortfolioMedia[]): CasePost {
  const slug = p.slug || p.id;
  const photos = media.filter((m) => m.type === "photo" || m.type === "gallery").sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 36);
  const videos = media.filter((m) => m.type === "video");
  const files: Record<string, PostFile> = {};
  photos.forEach((m, i) => {
    files[`f${i}`] = { path: m.url, alt: (m.label || "").trim() || `${p.title} 현장 사진 ${i + 1}` };
  });
  const body: PostBlock[] = contentBlocks(p.content || "");
  const desc = (p.description || "").trim();
  if (!body.some((b) => b.t === "p") && desc && !BOILER.test(desc)) body.push({ t: "p", text: desc });
  if (photos.length) {
    body.push({ t: "h", text: "현장 사진" });
    for (let i = 0; i < photos.length; i += 3) body.push({ t: "img", files: photos.slice(i, i + 3).map((_, k) => `f${i + k}`) });
  }
  // 발주·일시·장소는 제목 아래에 이미 나오므로 표에는 넣지 않음
  const overview = [
    { k: "행사 유형", v: p.eventType || p.tags?.[0] || "" },
    { k: "참여 인원", v: p.attendees || "" },
    { k: "제작물", v: (p.deliverables || []).join(", ") },
  ].filter((r) => r.v);
  const cover = p.imageUrl || photos[0]?.url || null;
  return {
    slug,
    path: `/work/${slug}`,
    title: p.title.replace(/_/g, " "),
    client: p.client || "",
    date: dateText(p),
    venue: p.venue || "",
    summary: desc && !BOILER.test(desc) ? desc : "",
    cover,
    cover_alt: `${p.title} 대표 사진`,
    overview,
    published: null,
    body,
    files,
    quote: [],
    videos: videos.map((v) => ({ src: v.url, label: (v.label || "").trim() || `${p.title} 현장 영상` })),
  };
}

const escHtml = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
/** Supabase 공개 사진 주소 → 폭 w 로 줄인 주소(목록 작은 사진용) */
const thumb = (url: string, w: number) =>
  /\/storage\/v1\/object\/public\//.test(url) ? url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/") + `?width=${w}&resize=contain&quality=75` : url;

/** 목록 아래 '사례 더 보기': 글자 링크 대신 작은 사진·유형·연도가 있는 카드 + 유형 고르기.
 *  틀에 이미 있는 링크(빌드가 고른 사례)만 대상으로 하고, 표에서 못 찾은 것은 글자 링크로 남긴다 */
export function fillOldCases(html: string, portfolios: Portfolio[], media: PortfolioMedia[]) {
  const m = html.match(/<div class="case-more"><h2>([^<]*)<\/h2><ul>([\s\S]*?)<\/ul><\/div>/);
  if (!m) return html;
  const links = Array.from(m[2].matchAll(/<li><a href="\/work\/([^"]+)">([\s\S]*?)<\/a><\/li>/g)).map((x) => ({ slug: x[1], title: x[2] }));
  if (!links.length) return html;
  const bySlug = new Map(portfolios.filter((p) => p.isVisible).map((p) => [p.slug || p.id, p]));
  const firstPhoto = new Map<string, string>();
  for (const x of media) if ((x.type === "photo" || x.type === "gallery") && !firstPhoto.has(x.portfolioId)) firstPhoto.set(x.portfolioId, x.url);
  const types: string[] = [];
  const cards = links
    .map(({ slug, title }) => {
      const p = bySlug.get(slug) || bySlug.get(decodeURIComponent(slug));
      const raw = (p?.eventType || p?.tags?.[0] || "").trim();
      const type = /전시|부스|포토존/.test(raw) ? "전시·부스·포토존" : raw; // 비슷한 유형 이름은 하나로
      if (type && !types.includes(type)) types.push(type);
      const img = p ? p.imageUrl || firstPhoto.get(p.id) || "" : "";
      const meta = [type, p?.year ? `${p.year}` : ""].filter(Boolean).join(" · ");
      return `<li data-type="${escHtml(type)}"><a href="/work/${slug}">${
        img ? `<img src="${escHtml(thumb(img, 480))}" alt="" loading="lazy" decoding="async" width="480" height="320">` : `<span class="cm-noimg" aria-hidden="true"></span>`
      }<span class="cm-text">${meta ? `<span class="cm-meta">${escHtml(meta)}</span>` : ""}<b>${title}</b></span></a></li>`;
    })
    .join("");
  const filter =
    types.length > 1
      ? `<div class="cm-filter" role="group" aria-label="행사 유형으로 고르기"><button type="button" aria-pressed="true" data-cm="">전체 <span>${links.length}</span></button>${types
          .map((t) => `<button type="button" aria-pressed="false" data-cm="${escHtml(t)}">${escHtml(t)}</button>`)
          .join("")}</div>`
      : "";
  const script = filter
    ? `<script>(()=>{const box=document.currentScript.closest('.case-more');if(!box)return;const bs=[...box.querySelectorAll('[data-cm]')],lis=[...box.querySelectorAll('.cm-grid li')],out=box.querySelector('.cm-count');const apply=(t,push)=>{const b=bs.find(x=>x.dataset.cm===t)||bs[0];let n=0;bs.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));lis.forEach(li=>{const show=!b.dataset.cm||li.dataset.type===b.dataset.cm;li.hidden=!show;if(show)n++});if(out)out.textContent=n+'건';const u=new URL(location.href);b.dataset.cm?u.searchParams.set('type',b.dataset.cm):u.searchParams.delete('type');if(u.href!==location.href)push?history.pushState(null,'',u):history.replaceState(null,'',u)};const cur=()=>new URLSearchParams(location.search).get('type')||'';box.addEventListener('click',e=>{const b=e.target.closest('[data-cm]');if(b)apply(b.dataset.cm,true)});addEventListener('popstate',()=>apply(cur(),false));addEventListener('pageshow',()=>apply(cur(),false));apply(cur(),false)})()</script>`
    : "";
  const block = `<div class="case-more is-cards"><h2>${m[1]} <span class="cm-count" aria-live="polite">${links.length}건</span></h2>${filter}<ul class="cm-grid">${cards}</ul>${script}</div>`;
  return html.replace(m[0], block);
}
