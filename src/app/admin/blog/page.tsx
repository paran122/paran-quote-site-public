"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Clock, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import type { BlogPost } from "@/types";

function StatusBadge({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-1.5">
      {!post.isPublished ? (
        <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          <EyeOff className="w-3 h-3" />
          임시
        </span>
      ) : post.publishedAt && new Date(post.publishedAt) > new Date() ? (
        <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3" />
          예약
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          <Eye className="w-3 h-3" />
          발행
        </span>
      )}
      {post.isFeatured && (
        <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full" title={`추천 순서: ${post.sortOrder}`}>
          <Star className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/blog")
      .then(async (res) => {
        const text = await res.text();
        console.log("[admin/blog] status:", res.status, "body:", text);
        if (!res.ok) throw new Error(res.status === 401 ? "로그인이 필요합니다" : `불러오기 실패 (${res.status})`);
        const data = JSON.parse(text);
        if (Array.isArray(data)) setPosts(data);
        else setError(data?.error || "응답 형식 오류");
      })
      .catch((err) => setError(err.message))
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
    <div className={viewMode === "card" ? "max-w-5xl" : "max-w-4xl"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">
            {loading ? "불러오는 중..." : error ? "조회 실패" : `총 ${posts.length}개의 글`}
          </p>
          {!loading && !error && posts.length > 0 && (
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 transition-colors ${viewMode === "table" ? "bg-primary text-white" : "text-slate-400 hover:text-slate-600"}`}
                title="목록 보기"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-1.5 transition-colors ${viewMode === "card" ? "bg-primary text-white" : "text-slate-400 hover:text-slate-600"}`}
                title="카드 보기"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <Link href="/admin/blog/new" className="btn-primary btn-sm">
          <Plus className="w-3.5 h-3.5" />
          새 글 작성
        </Link>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          {error.includes("로그인") && (
            <Link href="/admin/login" className="text-sm text-primary hover:underline">
              로그인 페이지로 이동
            </Link>
          )}
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-sm text-slate-400">불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-400 mb-3">아직 작성된 글이 없습니다</p>
          <Link href="/admin/blog/new" className="btn-primary btn-sm">
            첫 글 작성하기
          </Link>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
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
                    <StatusBadge post={post} />
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
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/admin/blog/${post.id}/edit`} className="block">
                <div className="relative aspect-[16/9] bg-slate-100">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 text-sm">
                      이미지 없음
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <StatusBadge post={post} />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-slate-900 line-clamp-2 mb-1">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{post.category || "-"}</span>
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-1 px-3 pb-3">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
