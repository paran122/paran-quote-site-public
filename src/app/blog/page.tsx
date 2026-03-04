import { fetchPublishedBlogPosts, fetchFeaturedBlogPosts, fetchBlogCategories } from "@/lib/queries";
import BlogListClient from "./BlogListClient";

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchPublishedBlogPosts>> = [];
  let featuredPosts: Awaited<ReturnType<typeof fetchFeaturedBlogPosts>> = [];
  let categories: string[] = [];

  try {
    [posts, featuredPosts, categories] = await Promise.all([
      fetchPublishedBlogPosts(),
      fetchFeaturedBlogPosts(),
      fetchBlogCategories(),
    ]);
  } catch {
    posts = [];
    featuredPosts = [];
  }

  return <BlogListClient posts={posts} featuredPosts={featuredPosts} categories={categories} />;
}
