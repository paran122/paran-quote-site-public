import { NextRequest, NextResponse } from "next/server";
import { fetchBlogPostById, updateBlogPost, deleteBlogPost, fetchBlogPostBySlug } from "@/lib/queries";
import { blogPostSchema } from "@/lib/validators/blog";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const post = await fetchBlogPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const parsed = blogPostSchema.partial().parse(body);

    // partial parse에서 default()가 채운 값 제거 — 요청에 없던 필드가 false/0으로 덮어쓰는 것 방지
    for (const key of Object.keys(parsed) as (keyof typeof parsed)[]) {
      if (!(key in body)) {
        delete parsed[key];
      }
    }

    // 슬러그 변경 시 중복 체크
    if (parsed.slug) {
      const existing = await fetchBlogPostBySlug(parsed.slug);
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ error: `이미 같은 슬러그(${parsed.slug})를 사용하는 글이 있습니다` }, { status: 409 });
      }
    }

    // 발행 상태로 변경 시 published_at 자동 설정 (기존에 이미 발행된 글은 건드리지 않음)
    if (parsed.is_published && !parsed.published_at) {
      const current = await fetchBlogPostById(params.id);
      if (!current?.publishedAt) {
        parsed.published_at = new Date().toISOString();
      } else {
        delete parsed.published_at;
      }
    }

    const post = await updateBlogPost(params.id, parsed as unknown as Record<string, unknown>);
    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다", details: err }, { status: 400 });
    }
    const msg = err instanceof Error
      ? err.message
      : (typeof err === "object" && err !== null && "message" in err)
        ? String((err as Record<string, unknown>).message)
        : "수정 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await deleteBlogPost(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "삭제 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
