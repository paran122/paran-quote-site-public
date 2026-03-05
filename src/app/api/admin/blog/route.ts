import { NextRequest, NextResponse } from "next/server";
import { fetchAllBlogPosts, createBlogPost, fetchBlogPostBySlug } from "@/lib/queries";
import { blogPostSchema } from "@/lib/validators/blog";

export async function GET() {
  try {
    const posts = await fetchAllBlogPosts();
    return NextResponse.json(posts);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = blogPostSchema.parse(body);

    // 슬러그 중복 체크
    const existing = await fetchBlogPostBySlug(parsed.slug);
    if (existing) {
      return NextResponse.json({ error: `이미 같은 슬러그(${parsed.slug})를 사용하는 글이 있습니다` }, { status: 409 });
    }

    // 발행 시 published_at 자동 설정
    if (parsed.is_published && !parsed.published_at) {
      parsed.published_at = new Date().toISOString();
    }

    const post = await createBlogPost(parsed as unknown as Record<string, unknown>);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다", details: err }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "생성 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
