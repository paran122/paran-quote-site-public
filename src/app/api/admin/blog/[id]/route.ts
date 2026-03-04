import { NextRequest, NextResponse } from "next/server";
import { fetchBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/queries";
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

    // 발행 상태로 변경 시 published_at 자동 설정
    if (parsed.is_published && !parsed.published_at) {
      parsed.published_at = new Date().toISOString();
    }

    const post = await updateBlogPost(params.id, parsed as unknown as Record<string, unknown>);
    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "입력값이 올바르지 않습니다", details: err }, { status: 400 });
    }
    const msg = err instanceof Error ? err.message : "수정 실패";
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
