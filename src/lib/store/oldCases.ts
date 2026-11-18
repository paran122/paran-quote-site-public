// 예전 사례(포트폴리오 표: portfolios · portfolio_media)를 새 진행 사례 글 모양(CasePost)으로 바꾼다.
// 쓰는 곳: /work/<주소이름> (work-case 경로). 예전 화면(옛 메뉴·옛 문구)을 대신해 새 사이트 틀로 보여 준다.
// 옮기는 것: 제목·발주처·일시·장소·참여 인원·제작물, 본문(프로젝트 설명), 현장 사진, 현장 영상.
// 옮기지 않는 것: 자동으로 붙던 '행사 대행' 홍보 문단·자주 묻는 질문·바로가기(지금 서비스 방향과 다름).
import type { Portfolio, PortfolioMedia } from "@/types";
import type { CasePost, PostBlock, PostFile } from "./casePosts";

const SKIP_SECTION = /(주요 담당 영역|함께 보면 좋은|자주 묻는 질문|FAQ|한눈에 보는 행사|관련 (서비스|페이지)|문의)/i;
const BOILER = /(대행 사례입니다|전 과정을 파란컴퍼니가 대행|대표 .*대행 사례|성공적으로 진행했습니다\.?$)/;

const clean = (t: string) =>
  t
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
  const overview = [
    { k: "발주", v: p.client || "" },
    { k: "일시", v: dateText(p) },
    { k: "장소", v: p.venue || "" },
    { k: "행사 유형", v: p.eventType || p.tags?.[0] || "" },
    { k: "참여 인원", v: p.attendees || "" },
    { k: "제작물", v: (p.deliverables || []).join(", ") },
  ].filter((r) => r.v);
  const cover = p.imageUrl || photos[0]?.url || null;
  return {
    slug,
    path: `/work/${slug}`,
    title: p.title,
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
