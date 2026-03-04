"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { BlogPost } from "@/types";

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 글을 삭제하시겠습니까?`)) return;

    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("삭제에 실패했습니다");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">총 {posts.length}개의 글</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5" />
          새 글 작성
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-slate-400">불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400 mb-3">아직 작성된 글이 없습니다</p>
          <Link href="/admin/blog/new" className="btn-primary btn-sm">
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-4 py-3 font-medium text-slate-500">제목</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-24">상태</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-24">카테고리</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-28">날짜</th>
                <th className="px-4 py-3 font-medium text-slate-500 w-20">액션</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-slate-900 hover:text-primary font-medium"
                    >
                      {post.title}
                    </Link>
                    {post.slug && (
                      <p className="text-xs text-slate-400 mt-0.5">/blog/{post.slug}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <Eye className="w-3 h-3" />
                        발행
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        <EyeOff className="w-3 h-3" />
                        임시
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{post.category || "-"}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                        className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                        title="수정"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
