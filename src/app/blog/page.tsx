import {
  fetchPublishedBlogPosts,
  fetchFeaturedBlogPosts,
  fetchBlogCategories,
  fetchPublishedBlogPostCount,
} from "@/lib/queries";
import BlogListClient from "./BlogListClient";

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchPublishedBlogPosts>> = [];
  let featuredPosts: Awaited<ReturnType<typeof fetchFeaturedBlogPosts>> = [];
  let categories: string[] = [];
  let totalCount = 0;

  try {
    [posts, featuredPosts, categories, totalCount] = await Promise.all([
      fetchPublishedBlogPosts(),
      fetchFeaturedBlogPosts(),
      fetchBlogCategories(),
      fetchPublishedBlogPostCount(),
    ]);
  } catch {
    posts = [];
    featuredPosts = [];
  }

  return (
    <BlogListClient
      posts={posts}
      featuredPosts={featuredPosts}
      categories={categories}
      totalCount={totalCount}
    />
  );
}
