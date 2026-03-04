"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";
import type { BlogPost } from "@/types";

export default function EditBlogPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("포스트를 찾을 수 없습니다");
        return res.json();
      })
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-sm text-slate-400 py-12 text-center">불러오는 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="text-sm text-red-500 py-12 text-center">
        {error || "포스트를 찾을 수 없습니다"}
      </div>
    );
  }

  return <BlogPostForm post={post} />;
}
