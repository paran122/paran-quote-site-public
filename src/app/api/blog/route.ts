import { NextRequest, NextResponse } from "next/server";
import {
  fetchPublishedBlogPosts,
  fetchPublishedBlogPostCount,
} from "@/lib/queries";

const PER_PAGE = 9;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const offset = (page - 1) * PER_PAGE;

  try {
    const [posts, totalCount] = await Promise.all([
      fetchPublishedBlogPosts(category, PER_PAGE, offset),
      fetchPublishedBlogPostCount(category),
    ]);

    return NextResponse.json({
      posts,
      totalCount,
      page,
      hasMore: offset + posts.length < totalCount,
    });
  } catch {
    return NextResponse.json({ posts: [], totalCount: 0, page, hasMore: false });
  }
}
