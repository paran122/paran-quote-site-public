"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft, Upload, X, Search } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import type { BlogPost } from "@/types";

interface BlogPostFormProps {
  post?: BlogPost;
}

/** 한글 제목 → 슬러그 변환 */
function toSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnailUrl ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(", ") ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? false);
  const [isFeatured, setIsFeatured] = useState(post?.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(post?.sortOrder ?? 0);
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(isEdit);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) setSlug(toSlug(value));
  }

  async function handleThumbnailUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/blog/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("업로드 실패");
      const { url } = await res.json();
      setThumbnailUrl(url);
    } catch {
      alert("썸네일 업로드에 실패했습니다");
    }
  }

  async function handleSubmit(asDraft = false) {
    setError("");
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      thumbnail_url: thumbnailUrl || null,
      category: category || null,
      tags,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      og_image_url: thumbnailUrl || null,
      is_published: asDraft ? false : isPublished,
      is_featured: isFeatured,
      sort_order: sortOrder,
      published_at: asDraft ? null : (publishedAt ? new Date(publishedAt).toISOString() : null),
    };

    try {
      const url = isEdit ? `/api/admin/blog/${post!.id}` : "/api/admin/blog";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "저장 실패");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/blog")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving || !title || !slug}
            className="btn-outline btn-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            임시저장
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving || !title || !slug}
            className="btn-primary btn-sm disabled:opacity-50"
          >
            {saving ? "저장 중..." : isPublished ? "발행" : "저장"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* 제목 */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-bold border-none focus:outline-none focus:ring-0
              placeholder:text-slate-300 bg-transparent"
          />
        </div>

        {/* 슬러그 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 shrink-0">/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            placeholder="url-slug"
            className="flex-1 text-sm border border-slate-200 rounded-sm px-2 py-1
              focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* 에디터 */}
        <TiptapEditor content={content} onChange={setContent} />

        {/* 사이드 설정 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 기본 설정 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">기본 설정</h3>

            {/* 요약 */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">요약(excerpt)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="글 목록에 표시될 요약문"
                rows={2}
                className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">카테고리</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 행사 기획, 꿀팁"
                className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* 태그 */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">태그 (쉼표 구분)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="세미나, 컨퍼런스, 체크리스트"
                className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* 썸네일 */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">썸네일</label>
              {thumbnailUrl ? (
                <div className="relative group">
                  <img
                    src={thumbnailUrl}
                    alt="썸네일"
                    className="w-full h-40 object-cover rounded-sm border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="w-full h-28 border-2 border-dashed border-slate-200 rounded-sm
                    flex flex-col items-center justify-center gap-1 text-sm text-slate-400
                    hover:border-primary/30 hover:text-primary/60 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  이미지 업로드
                </button>
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleThumbnailUpload(file);
                  e.target.value = "";
                }}
              />
            </div>

            {/* 발행 설정 */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">발행</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">에디터 추천</span>
              </label>

              {isFeatured && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1">추천 순서 (0이 가장 먼저)</label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-20 text-sm border border-slate-200 rounded-sm px-3 py-2
                      focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              )}

              {isPublished && (
                <div>
                  <label className="block text-sm text-slate-600 mb-1">발행일시 (예약발행)</label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                      focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                  <p className="text-xs text-slate-400 mt-1">비워두면 즉시 발행됩니다</p>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: SEO 설정 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1">
              <Search className="w-4 h-4" />
              SEO 설정
            </h3>

            <div>
              <label className="block text-sm text-slate-600 mb-1">SEO 제목 (최대 70자)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "검색 결과에 표시될 제목"}
                maxLength={70}
                className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <p className="text-xs text-slate-400 mt-1">{seoTitle.length}/70</p>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">SEO 설명 (최대 160자)</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={excerpt || "검색 결과에 표시될 설명"}
                maxLength={160}
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-sm px-3 py-2
                  focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{seoDescription.length}/160</p>
            </div>

            {/* SEO 미리보기 */}
            <div className="p-4 bg-white border border-slate-200 rounded-sm">
              <p className="text-xs text-slate-400 mb-2">구글 검색 결과 미리보기</p>
              <div className="space-y-0.5">
                <p className="text-blue-700 text-base leading-tight truncate">
                  {seoTitle || title || "제목 없음"}
                </p>
                <p className="text-green-700 text-xs truncate">
                  parancompany.co.kr/blog/{slug || "slug"}
                </p>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {seoDescription || excerpt || "설명이 여기에 표시됩니다..."}
                </p>
              </div>
            </div>

            {/* OG 이미지 미리보기 */}
            {thumbnailUrl && (
              <div className="p-4 bg-white border border-slate-200 rounded-sm">
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  SNS 공유 미리보기
                </p>
                <div className="border border-slate-200 rounded-sm overflow-hidden">
                  <img src={thumbnailUrl} alt="OG" className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="text-xs text-slate-400">parancompany.co.kr</p>
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {seoTitle || title || "제목"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {seoDescription || excerpt || "설명"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
