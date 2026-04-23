"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, ArrowLeft, Upload, X, Search, ImageIcon, Check, Sparkles, Loader2, ShieldCheck, Globe } from "lucide-react";
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
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const handleSubmitRef = useRef<() => void>(() => {});

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
  const [isReviewed, setIsReviewed] = useState(post?.isReviewed ?? false);
  const [reviewComment, setReviewComment] = useState(post?.reviewComment ?? "");
  const [isFeatured, setIsFeatured] = useState(post?.isFeatured ?? false);
  const [sortOrder, setSortOrder] = useState(post?.sortOrder ?? 0);
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [pickerOpen, setPickerOpen] = useState(false);

  // AdminHeader에 slug/saving 상태 전달
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("blog-form-state", { detail: { slug, saving, isEdit } }));
  }, [slug, saving, isEdit]);

  // AdminHeader의 저장/미리보기 버튼 클릭 수신
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    const submitHandler = () => handleSubmitRef.current();
    const previewHandler = () => setPreviewOpen(true);
    window.addEventListener("blog-form-submit", submitHandler);
    window.addEventListener("blog-form-preview", previewHandler);
    return () => {
      window.removeEventListener("blog-form-submit", submitHandler);
      window.removeEventListener("blog-form-preview", previewHandler);
    };
  }, []);

  // AI 생성
  const [aiKeyword, setAiKeyword] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiError, setAiError] = useState("");

  const [aiProgress, setAiProgress] = useState("");

  async function handleAiGenerate() {
    if (!aiKeyword.trim() || aiGenerating) return;
    setAiError("");
    setAiGenerating(true);
    try {
      // 1단계: 글 생성
      setAiProgress("글 생성 중...");
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: aiKeyword, additionalContext: aiContext || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "글 생성 실패");

      // 폼에 자동 채움 (이미지 마커 포함된 상태)
      setTitle(data.title || "");
      setSlug(data.slug || toSlug(data.title || ""));
      setSlugManual(true);
      setExcerpt(data.excerpt || "");
      setCategory(data.category || "");
      setTagsInput((data.tags || []).join(", "));
      setSeoTitle(data.seo_title || "");
      setSeoDescription(data.seo_description || "");
      setIsPublished(false);
      setAiOpen(false);
      if (data._warning) {
        setError(data._warning);
      }

      // 2단계: 본문의 {{IMAGE:...}} 마커를 찾아서 이미지 생성
      let htmlContent = data.content || "";
      const imageMarkers = [...htmlContent.matchAll(/\{\{IMAGE:(.*?)\}\}/g)];

      if (imageMarkers.length > 0) {
        setImgGenerating(true);
        let firstImageUrl = "";

        for (let i = 0; i < imageMarkers.length; i++) {
          const marker = imageMarkers[i];
          const prompt = marker[1].trim();
          setAiProgress(`이미지 생성 중... (${i + 1}/${imageMarkers.length})`);

          try {
            const imgRes = await fetch("/api/admin/blog/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt }),
            });
            const imgData = await imgRes.json();
            if (imgRes.ok && imgData.url) {
              const imgTag = `<img src="${imgData.url}" alt="${aiKeyword}" />`;
              htmlContent = htmlContent.replace(marker[0], imgTag);
              if (!firstImageUrl) firstImageUrl = imgData.url;
            } else {
              // 실패한 마커는 제거
              htmlContent = htmlContent.replace(marker[0], "");
            }
          } catch {
            htmlContent = htmlContent.replace(marker[0], "");
          }
        }

        // 첫 번째 이미지를 썸네일로 설정
        if (firstImageUrl) {
          setThumbnailUrl(firstImageUrl);
        }
        setImgGenerating(false);
      }

      setContent(htmlContent);
      setAiProgress("");
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "생성 실패");
      setAiProgress("");
    } finally {
      setAiGenerating(false);
    }
  }

  // AI 이미지 생성
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgGenerating, setImgGenerating] = useState(false);
  const [imgError, setImgError] = useState("");
  const [imgOpen, setImgOpen] = useState(false);

  async function handleImageGenerate() {
    if (!imgPrompt.trim() || imgGenerating) return;
    setImgError("");
    setImgGenerating(true);
    try {
      const res = await fetch("/api/admin/blog/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imgPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "이미지 생성 실패");

      setThumbnailUrl(data.url);
      setImgOpen(false);
      setImgPrompt("");
    } catch (err) {
      setImgError(err instanceof Error ? err.message : "이미지 생성 실패");
    } finally {
      setImgGenerating(false);
    }
  }

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

  async function handleToggleReview(newReviewed: boolean) {
    if (!isEdit || !post) return;
    const body: Record<string, unknown> = {
      is_reviewed: newReviewed,
      reviewed_at: newReviewed ? new Date().toISOString() : null,
    };
    // 검수 완료 시 코멘트 초기화
    if (newReviewed) {
      body.review_comment = null;
    }
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setIsReviewed(newReviewed);
      if (newReviewed) setReviewComment("");
    } else {
      alert("검수 상태 변경에 실패했습니다");
    }
  }

  async function handleSaveComment() {
    if (!isEdit || !post) return;
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review_comment: reviewComment || null }),
    });
    if (!res.ok) {
      alert("코멘트 저장에 실패했습니다");
    }
  }

  async function handleSubmit() {
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
      is_published: isPublished,
      is_reviewed: isReviewed,
      reviewed_at: isReviewed ? new Date().toISOString() : null,
      is_featured: isFeatured,
      sort_order: sortOrder,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
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

  handleSubmitRef.current = handleSubmit;

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
        {!isEdit && (
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium
              text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI 글 생성
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-sm">
          {error}
        </div>
      )}

      {/* AI 글 생성 패널 */}
      {aiOpen && !isEdit && (
        <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-900">AI 블로그 글 생성</h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            키워드를 입력하면 SEO 최적화된 블로그 초안을 생성합니다. 생성 후 검토·수정한 뒤 발행하세요.
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={aiKeyword}
              onChange={(e) => setAiKeyword(e.target.value)}
              placeholder="타겟 키워드 (예: 세미나 기획 체크리스트)"
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
              onKeyDown={(e) => { if (e.key === "Enter") handleAiGenerate(); }}
            />
            <textarea
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              placeholder="추가 요청사항 (선택) — 예: 리스트형으로 작성, 3000자 이상"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white resize-none"
            />
          </div>
          {aiError && (
            <p className="mt-2 text-xs text-red-500">{aiError}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAiGenerate}
              disabled={aiGenerating || !aiKeyword.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white
                bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {aiProgress || "준비 중..."}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  생성하기
                </>
              )}
            </button>
            <button
              onClick={() => setAiOpen(false)}
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
            >
              닫기
            </button>
          </div>
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

        {/* 팀장 검수 & 발행 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 팀장 검수 */}
          <div className={`rounded-lg border p-5 ${reviewComment ? "border-red-200 bg-red-50/30" : "border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className={`w-5 h-5 ${isReviewed ? "text-emerald-500" : "text-slate-300"}`} />
                <div>
                  <p className="text-sm font-medium text-slate-700">팀장 검수</p>
                  <p className={`text-xs mt-0.5 ${isReviewed ? "text-emerald-500" : "text-slate-400"}`}>
                    {isReviewed ? "검수 완료" : "검수 대기 중"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleReview(!isReviewed)}
                className={`relative w-11 h-6 rounded-full transition-colors ${isReviewed ? "bg-emerald-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isReviewed ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            {/* 코멘트 */}
            {!isReviewed && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  onBlur={handleSaveComment}
                  placeholder="수정 요청사항을 적어주세요"
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-md px-3 py-2
                    focus:outline-none focus:ring-1 focus:ring-red-200 resize-none placeholder:text-slate-300"
                />
                {reviewComment && (
                  <p className="text-[11px] text-slate-400 mt-1">포커스를 벗어나면 자동 저장됩니다</p>
                )}
              </div>
            )}
            {isReviewed && reviewComment && (
              <p className="mt-2 text-xs text-slate-400 line-through">{reviewComment}</p>
            )}
          </div>

          {/* 발행 */}
          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className={`w-5 h-5 ${isPublished ? "text-blue-500" : "text-slate-300"}`} />
                <span className="text-sm font-medium text-slate-700">발행</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative w-11 h-6 rounded-full transition-colors ${isPublished ? "bg-blue-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isPublished ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
            {isPublished && (
              <div className="flex items-center gap-2 mt-3 pl-8">
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="flex-1 text-sm border border-slate-200 rounded-md px-3 py-1.5
                    focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
                <span className="text-xs text-slate-400 shrink-0">미래 = 예약</span>
              </div>
            )}
          </div>
        </div>

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
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center"
                      title="다른 이미지 선택"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl("")}
                      className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center"
                      title="썸네일 제거"
                    >
                      <X className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="h-28 border-2 border-dashed border-slate-200 rounded-sm
                      flex flex-col items-center justify-center gap-1 text-sm text-slate-400
                      hover:border-primary/30 hover:text-primary/60 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    파일 업로드
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="h-28 border-2 border-dashed border-slate-200 rounded-sm
                      flex flex-col items-center justify-center gap-1 text-sm text-slate-400
                      hover:border-primary/30 hover:text-primary/60 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5" />
                    기존 이미지
                  </button>
                  <button
                    type="button"
                    onClick={() => setImgOpen(!imgOpen)}
                    className="h-28 border-2 border-dashed border-indigo-200 rounded-sm
                      flex flex-col items-center justify-center gap-1 text-sm text-indigo-400
                      hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    AI 생성
                  </button>
                </div>
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
              {/* AI 이미지 생성 패널 */}
              {imgOpen && (
                <div className="mt-3 p-3 rounded-md border border-indigo-200 bg-indigo-50/50">
                  <p className="text-xs text-slate-500 mb-2">이미지 설명을 입력하세요 (한글 가능)</p>
                  <input
                    type="text"
                    value={imgPrompt}
                    onChange={(e) => setImgPrompt(e.target.value)}
                    placeholder="예: 세미나 준비 체크리스트 인포그래픽"
                    className="w-full text-sm border border-slate-200 rounded-md px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                    onKeyDown={(e) => { if (e.key === "Enter") handleImageGenerate(); }}
                  />
                  {imgError && <p className="mt-1 text-xs text-red-500">{imgError}</p>}
                  <button
                    onClick={handleImageGenerate}
                    disabled={imgGenerating || !imgPrompt.trim()}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white
                      bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                  >
                    {imgGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        생성 중... (30초~1분)
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        이미지 생성
                      </>
                    )}
                  </button>
                </div>
              )}
              <ImagePickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={setThumbnailUrl}
              />
              <ContentImagePicker
                content={content}
                thumbnailUrl={thumbnailUrl}
                onSelect={setThumbnailUrl}
              />
            </div>

            {/* 에디터 추천 */}
            <div className="pt-2 border-t border-slate-100">
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
                <div className="mt-2">
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

      {/* 미리보기 모달 */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8" onClick={() => setPreviewOpen(false)}>
          <div
            className="relative w-full max-w-[700px] bg-white rounded-lg shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 rounded-t-lg">
              <span className="text-sm font-medium text-slate-500">미리보기</span>
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 본문 미리보기 */}
            <div className="px-6 py-10">
              {/* 날짜 + 카테고리 */}
              <p className="text-center text-sm text-slate-400 mb-4">
                {publishedAt
                  ? new Date(publishedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
                  : new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                {category && <span className="ml-2 text-primary font-medium">{category}</span>}
              </p>

              {/* 제목 */}
              <h1 className="text-center text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight text-slate-900 mb-8">
                {title || "제목 없음"}
              </h1>

              {/* 썸네일 */}
              {thumbnailUrl && (
                <div className="mb-10 -mx-6">
                  <img src={thumbnailUrl} alt={title} className="w-full object-cover" />
                </div>
              )}

              {/* 본문 */}
              <div
                className="text-[16px] leading-[1.8] text-slate-700 [&>h2]:text-[22px] [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-slate-900 [&>h3]:text-[18px] [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-slate-900 [&>p]:mb-5 [&>ul]:mb-5 [&>ul]:pl-6 [&>ul]:list-disc [&>ol]:mb-5 [&>ol]:pl-6 [&>ol]:list-decimal [&>li]:mb-2 [&>img]:my-8 [&>img]:rounded-lg [&>img]:w-full [&>blockquote]:border-l-4 [&>blockquote]:border-primary/30 [&>blockquote]:pl-4 [&>blockquote]:text-slate-500 [&>blockquote]:italic [&>blockquote]:my-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* 태그 */}
              {tagsInput && (
                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-200">
                  {tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs text-slate-500 bg-slate-100 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 본문 이미지에서 썸네일 선택 ── */
function ContentImagePicker({
  content,
  thumbnailUrl,
  onSelect,
}: {
  content: string;
  thumbnailUrl: string;
  onSelect: (url: string) => void;
}) {
  const contentImages = useMemo(() => {
    const urls: string[] = [];
    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!urls.includes(match[1])) urls.push(match[1]);
    }
    return urls;
  }, [content]);

  if (contentImages.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-slate-500 mb-1.5">본문 이미지에서 선택</p>
      <div className="grid grid-cols-4 gap-1.5">
        {contentImages.map((url) => {
          const isSelected = url === thumbnailUrl;
          return (
            <button
              key={url}
              type="button"
              onClick={() => onSelect(url)}
              className={`relative aspect-square overflow-hidden rounded-sm border transition-all ${
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-slate-200 hover:border-primary/50"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <Check className="h-4 w-4 text-white drop-shadow" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 이미지 선택 모달 ── */
interface StorageImage {
  url: string;
  name: string;
  bucket: string;
  folder?: string;
  postTitle?: string;
}

type FilterType = "post" | "blog" | "portfolio";

const FILTER_LABELS: Record<FilterType, string> = {
  post: "블로그 게시물",
  blog: "블로그 Storage",
  portfolio: "포트폴리오",
};

function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>("post");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog/images");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setFilter("post");
      setSearchTerm("");
      setSelectedFolder("");
    }
  }, [isOpen, fetchImages]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 포트폴리오 폴더 목록
  const portfolioFolders = Array.from(
    new Set(images.filter((img) => img.bucket === "qs-portfolio" && img.folder).map((img) => img.folder!)),
  ).sort();

  const filtered = images.filter((img) => {
    if (img.bucket !== filter) return false;
    if (filter === "portfolio" && selectedFolder && img.folder !== selectedFolder) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = img.name.toLowerCase().includes(term);
      const matchTitle = img.postTitle?.toLowerCase().includes(term);
      const matchFolder = img.folder?.toLowerCase().includes(term);
      if (!matchName && !matchTitle && !matchFolder) return false;
    }
    return true;
  });

  // 블로그 게시물 탭: 게시물별 그룹핑
  const postGroups = filter === "post"
    ? Array.from(
        filtered.reduce((map, img) => {
          const key = img.postTitle || "기타";
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(img);
          return map;
        }, new Map<string, StorageImage[]>()),
      )
    : [];

  function ImageButton({ img }: { img: StorageImage }) {
    return (
      <button
        onClick={() => {
          onSelect(img.url);
          onClose();
        }}
        className="group relative aspect-square overflow-hidden rounded-md border border-slate-100 transition-all hover:border-primary hover:ring-2 hover:ring-primary/20"
      >
        <img src={img.url} alt={img.name} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <Check className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="relative mx-4 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-slate-900">이미지 선택</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 필터 탭 */}
        <div className="flex flex-col gap-2 border-b border-slate-50 px-5 py-2.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex shrink-0 gap-1">
            {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => {
              const count = images.filter((img) => img.bucket === f).length;
              return (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setSelectedFolder(""); }}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                    filter === f
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {FILTER_LABELS[f]}
                  {count > 0 && <span className="ml-1 opacity-60">{count}</span>}
                </button>
              );
            })}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={filter === "portfolio" ? "행사명 또는 파일명 검색" : "검색"}
              className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* 포트폴리오: 폴더(행사) 선택 */}
        {filter === "portfolio" && portfolioFolders.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-slate-50 px-5 py-2">
            <button
              onClick={() => setSelectedFolder("")}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                !selectedFolder ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              전체
            </button>
            {portfolioFolders.map((folder) => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  selectedFolder === folder ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {folder}
              </button>
            ))}
          </div>
        )}

        {/* 이미지 그리드 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              불러오는 중...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-slate-400">
              {filter === "post" ? "블로그 게시물에 사용된 이미지가 없습니다" : "이미지가 없습니다"}
            </div>
          ) : filter === "post" ? (
            /* 블로그 게시물: 게시물별 그룹 */
            <div className="space-y-5">
              {postGroups.map(([title, imgs]) => (
                <div key={title}>
                  <p className="mb-2 text-[12px] font-semibold text-slate-600">{title}</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {imgs.map((img) => (
                      <ImageButton key={img.url} img={img} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 블로그 Storage / 포트폴리오: 플랫 그리드 */
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {filtered.map((img) => (
                <ImageButton key={img.url} img={img} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
