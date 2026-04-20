import { NextResponse } from "next/server";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-3-pro-image-preview";

/**
 * 블로그 이미지 스타일 프롬프트 (blog-image 스킬 전체 규칙 반영)
 *
 * 스타일: Professional infographic, clean modern, flat design
 * 색상: 주제에 맞는 자유로운 색상 (특정 팔레트 제한 없음)
 * 초상권: 얼굴 식별 불가, 뒷모습/실루엣/손 클로즈업만
 * 텍스트: 제목 + 짧은 키워드만, 최대 2줄, 한글
 * 세이프존: 핵심 요소를 중심 60%에 배치, 상하 20%는 크롭 여유
 * 해상도: 1200x675px (16:9)
 */
const STYLE_RULES = [
  "Professional infographic style, clean modern design, flat design",
  "No visible faces - use back views, silhouettes, hands close-up, or distant wide shots only",
  "No real names on nameplates or badges",
  "If text is needed: title and short keywords only, maximum 2 lines, Korean text",
  "Safe zone: place core elements in center 60% of the image, leave top and bottom 20% for crop margin",
  "High quality, 4K resolution",
  "16:9 aspect ratio, 1200x675px",
  "Choose colors that match the topic naturally, not limited to any specific palette",
].join(". ");

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "이미지 설명을 입력해주세요." },
        { status: 400 },
      );
    }

    const fullPrompt = `${prompt.trim()}. ${STYLE_RULES}`;

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: {
              imageSize: "1K",
              aspectRatio: "16:9",
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("[generate-image] Gemini API error:", err);
      return NextResponse.json(
        { error: err?.error?.message || `Gemini API 오류 (${response.status})` },
        { status: 500 },
      );
    }

    const result = await response.json();

    // 응답에서 이미지 데이터 추출
    const parts = result?.candidates?.[0]?.content?.parts;
    if (!parts) {
      return NextResponse.json(
        { error: "이미지 생성 결과가 없습니다." },
        { status: 500 },
      );
    }

    const imagePart = parts.find(
      (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData,
    );

    if (!imagePart?.inlineData) {
      return NextResponse.json(
        { error: "이미지가 생성되지 않았습니다. 다른 프롬프트로 시도해주세요." },
        { status: 500 },
      );
    }

    // base64 이미지를 File로 변환하여 기존 upload API로 전달
    const base64 = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const buffer = Buffer.from(base64, "base64");
    const blob = new Blob([buffer], { type: mimeType });

    const formData = new FormData();
    const ext = mimeType.includes("png") ? "png" : "jpg";
    formData.append("file", blob, `ai-generated-${Date.now()}.${ext}`);

    // 기존 upload API 활용 (Sharp 최적화 + Supabase Storage 업로드)
    const origin = req.headers.get("origin") || req.headers.get("host") || "";
    const protocol = origin.startsWith("localhost") || origin.startsWith("127.") ? "http" : "https";
    const baseUrl = origin.startsWith("http") ? origin : `${protocol}://${origin}`;

    const uploadRes = await fetch(`${baseUrl}/api/admin/blog/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const uploadErr = await uploadRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: uploadErr?.error || "이미지 업로드 실패" },
        { status: 500 },
      );
    }

    const { url } = await uploadRes.json();

    return NextResponse.json({ url, prompt: prompt.trim() });
  } catch (err) {
    console.error("[generate-image] Error:", err);
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
