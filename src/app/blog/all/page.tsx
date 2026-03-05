import type { Metadata } from "next";
import {
  fetchPublishedBlogPosts,
  fetchPublishedBlogPostCount,
  fetchBlogCategories,
} from "@/lib/queries";
import BlogArchiveClient from "./BlogArchiveClient";

const PER_PAGE = 9;

export const metadata: Metadata = {
  title: "블로그 전체보기 | 파란컴퍼니",
  description: "파란컴퍼니 블로그의 모든 글을 확인하세요.",
};

interface Props {
  searchParams: { category?: string; page?: string };
}

export default async function BlogArchivePage({ searchParams }: Props) {
  const category = searchParams.category || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const offset = (page - 1) * PER_PAGE;

  let posts: Awaited<ReturnType<typeof fetchPublishedBlogPosts>> = [];
  let totalCount = 0;
  let categories: string[] = [];

  try {
    [posts, totalCount, categories] = await Promise.all([
      fetchPublishedBlogPosts(category || undefined, PER_PAGE, offset),
      fetchPublishedBlogPostCount(category || undefined),
      fetchBlogCategories(),
    ]);
  } catch {
    // fallback to empty
  }

  return (
    <BlogArchiveClient
      posts={posts}
      totalCount={totalCount}
      currentPage={page}
      currentCategory={category || "전체"}
      categories={categories}
    />
  );
}
