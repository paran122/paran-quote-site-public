import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** 서버사이드 Supabase 클라이언트 */
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { db: { schema: "paran_quote_site" } });
}

/** SEO 키워드 리스트 (seo-keywords.md 기반) */
const SEO_KEYWORDS = `
## 고볼륨 키워드 (월 5,000+)
케이터링, 워크숍, 세미나, 핑거푸드, 컨퍼런스, 심포지엄

## 중볼륨 키워드 (월 1,000~5,000)
기공식, 박스케이터링, 시무식, 팀빌딩, 사회자, 송년회, 커피케이터링, 창립기념일

## 니치 키워드 (행사 대행 직결)
행사기획, 기업행사대행, 행사대행, 행사업체, 행사대행업체, 전문사회자

## 디자인 키워드 (Google)
포스터 사이즈, 현수막 사이즈, 명찰 디자인, 초대장 디자인, 전시회 부스, 현수막 문구
`.trim();

const SYSTEM_PROMPT = `당신은 파란컴퍼니의 SEO 블로그 전문 작성자입니다.
행사 기획·대행 분야의 전문 가이드 블로그 글을 작성합니다.

## 글 구조
- H2 소제목 3~7개로 구성
- 도입부: 독자의 문제 정의 (100~200자, "행사를 처음 맡았는데..." 식)
- 각 H2 섹션: 최소 200자 이상
- 마무리: CTA 한 줄 — "전문 대행이 필요하시다면 파란컴퍼니에 문의해 주세요." + 관련 페이지 링크
- 전화번호/카카오톡 나열 금지 (영업 느낌 방지)

## 톤앤매너
- 전문 가이드 톤, "~하세요", "~합니다" (존댓말)
- 객관적이고 정보 중심 (홍보가 아닌 독자 도움 목적)
- 마무리 CTA에서만 자연스럽게 파란컴퍼니 언급

## SEO 규칙
- 제목: 타겟 키워드를 앞부분에 배치, 50~60자 이내
- 첫 문단에 타겟 키워드 1회 자연스럽게 포함
- H2 소제목 중 2개 이상에 관련 키워드 포함
- 본문에 타겟 키워드 3~5회 (과도한 반복 금지)
- seo_title: "{핵심 키워드} | 파란컴퍼니" — 60자 이내
- seo_description: 타겟 키워드 첫 문장 포함, 155자 이내

## 제목 패턴 (돌려가며 사용 — 기존 글 제목과 겹치지 않게)
- 비교형: "A vs B 차이 총정리"
- 리스트형: "N가지/N선"
- How-to형: "~하는 법/방법"
- 비용형: "~비용, 얼마가 적정?"
- 대상형: "처음 행사 맡았을 때 읽는 글"
- 범위형: "A부터 B까지/총정리"

## 제목 다양성 규칙
- 같은 첫 단어로 시작하는 제목 2개 이상 연속 금지
- "행사 OOO" 같은 동일 패턴 반복 금지
- 숫자형, 비교형, 질문형, How-to, 콜론형 등 다양한 패턴 혼용

## 검색 트리거 단어 (글 내용과 맞으면 1개 이상 포함)
차이, 총정리, 비용/가격, 추천, 방법/하는 법, 체크리스트, vs/비교, N가지

## 카테고리 (3개 중 1개 선택)
- 기획 가이드: 행사 기획 가이드, 대행사 선정, 견적서 해설 등
- 현장 노하우: 큐시트, 체크리스트, MC 섭외, 만족도 조사 등
- 행사 정보: 행사 종류 비교, 행사장 추천, 장비/비용 정보 등

## 글자수 기준
- 간단한 비교/정의: 1,500~2,500자
- 실무 가이드/절차: 2,500~3,500자
- 종합 가이드: 3,500~5,000자

## 주의사항
- HTML 표(<table>) 최소화 — 리스트(<ul>/<ol>)로 대체
- 표가 2개 이상 연속되면 사이에 본문 단락 삽입
- 검증되지 않은 비용 수치 넣지 않기 — "약 ~", "~부터" 등 유보적 표현
- 비용 대신 비중(%)이나 범위로 표현 (예: "대관비가 전체의 20~30%")
- 파란컴퍼니 자체 데이터가 아닌 외부 수치는 출처와 시점 명시
- 네이버 블로그와 차별화: 같은 주제라도 구성/문장 70% 이상 다르게

## 내부 링크
- 글당 2~3개 내부 링크 삽입
- 우선순위: 같은 카테고리 블로그 글 → 관련 포트폴리오 → 가이드 페이지
- 형식: <a href="/blog/{slug}">관련 글 제목</a>
- 링크 텍스트에 키워드 포함

## 1글 1주제 원칙
- 같은 타겟 키워드로 새 글을 만들지 않음
- 기존 글이 있으면 업데이트를 권고

## 본문 이미지 배치
- 글 내용에 맞는 이미지를 본문 중간중간에 배치하세요
- 이미지가 필요한 위치에 {{IMAGE:영문 프롬프트}} 마커를 삽입하세요
- 이미지 수: 글 내용에 따라 유동적 (2~4장, 썸네일 포함 총 3~5장)
- 첫 이미지는 첫 H2 섹션 바로 앞에 배치
- 모든 섹션에 넣지 말고 이미지가 내용 이해에 도움이 되는 섹션에만 배치
- 프롬프트는 반드시 영어로 작성
- 프롬프트 규칙:
  - 인포그래픽/플랫 디자인 스타일
  - 얼굴 노출 금지 (no visible faces, back view, silhouette, hands close-up only)
  - 해당 섹션의 핵심 내용을 시각적으로 표현
  - 각 이미지마다 다른 구도/주제로 (중복 금지)

예시:
<p>도입부 텍스트...</p>
{{IMAGE:Professional flat design infographic showing seminar planning checklist with timeline, no visible faces, clean modern style}}
<h2>첫 번째 섹션</h2>
<p>본문...</p>

## 출력 형식
반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "title": "블로그 제목",
  "slug": "url-slug-한글가능",
  "content": "<p>HTML 본문... {{IMAGE:prompt}} ...</p>",
  "excerpt": "2~3문장 요약",
  "category": "기획 가이드 | 현장 노하우 | 행사 정보",
  "tags": ["태그1", "태그2", "태그3"],
  "seo_title": "SEO 제목 | 파란컴퍼니",
  "seo_description": "155자 이내 메타 설명"
}`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다. .env.local에 추가해주세요." },
        { status: 500 },
      );
    }

    const { keyword, additionalContext } = await req.json();

    if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
      return NextResponse.json({ error: "키워드를 입력해주세요." }, { status: 400 });
    }

    const trimmedKeyword = keyword.trim();

    // ── DB 조회: 중복 체크 + 카테고리 분산 + 제목 다양성 ──
    const supabase = getSupabase();
    let dbContext = "";

    if (supabase) {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id, title, slug, seo_title")
        .or(`title.ilike.%${trimmedKeyword}%,seo_title.ilike.%${trimmedKeyword}%`)
        .limit(5);

      if (existing && existing.length > 0) {
        const titles = existing.map((p: { title: string; slug: string }) => `- "${p.title}" (/blog/${p.slug})`).join("\n");
        dbContext += `\n\n## 경고: 유사 키워드 기존 글 발견\n다음 글들이 이미 존재합니다. 중복되지 않는 각도로 작성하세요:\n${titles}\n`;
      }

      const { data: recent } = await supabase
        .from("blog_posts")
        .select("category")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(2);

      if (recent && recent.length > 0) {
        const recentCats = recent.map((p: { category: string }) => p.category).filter(Boolean);
        if (recentCats.length > 0) {
          dbContext += `\n\n## 카테고리 분산 규칙\n최근 발행된 글 카테고리: ${recentCats.join(", ")}\n이와 다른 카테고리를 선택하세요.\n`;
        }
      }

      const { data: recentTitles } = await supabase
        .from("blog_posts")
        .select("title")
        .order("published_at", { ascending: false })
        .limit(10);

      if (recentTitles && recentTitles.length > 0) {
        const titleList = recentTitles.map((p: { title: string }) => `- ${p.title}`).join("\n");
        dbContext += `\n\n## 기존 글 제목 (최근 10개 — 다양성 확인용)\n${titleList}\n이 제목들과 패턴이 겹치지 않게 작성하세요.\n`;
      }

      const { data: allPosts } = await supabase
        .from("blog_posts")
        .select("title, slug, category")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(20);

      if (allPosts && allPosts.length > 0) {
        const linkList = allPosts.map((p: { title: string; slug: string; category: string }) =>
          `- "${p.title}" → /blog/${p.slug} [${p.category || "미분류"}]`
        ).join("\n");
        dbContext += `\n\n## 내부 링크 후보 (기존 발행 글)\n${linkList}\n이 중에서 관련 있는 글 2~3개를 본문에 링크하세요.\n`;
      }
    }

    // ── Gemini API 호출 ──
    const userPrompt = [
      `타겟 키워드: "${trimmedKeyword}"`,
      `\n## SEO 참고 키워드\n${SEO_KEYWORDS}`,
      dbContext,
      additionalContext ? `\n## 추가 요청사항\n${additionalContext}` : "",
    ].filter(Boolean).join("\n");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      console.error("[blog/generate] Gemini error:", errBody);
      return NextResponse.json(
        { error: `Gemini API 오류 (${geminiResponse.status})`, detail: errBody },
        { status: 500 },
      );
    }

    const geminiData = await geminiResponse.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return NextResponse.json(
        { error: "AI 응답이 비어있습니다.", raw: geminiData },
        { status: 500 },
      );
    }

    // JSON 파싱 — ```json 블록이나 순수 JSON 모두 처리
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI 응답을 파싱할 수 없습니다.", raw: text },
        { status: 500 },
      );
    }

    const generated = JSON.parse(jsonMatch[1]);

    if (dbContext.includes("경고: 유사 키워드")) {
      generated._warning = "유사한 키워드의 기존 글이 있습니다. 내용을 확인해주세요.";
    }

    return NextResponse.json(generated);
  } catch (err) {
    console.error("[blog/generate] Error:", err);
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
