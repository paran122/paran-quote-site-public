"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  portfolio_id: string;
  event_slug: string;
  type: string;
  label: string;
  url: string;
  sort_order: number;
}

interface MediaUploaderProps {
  portfolioId: string;
  eventSlug: string;
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
}

export default function MediaUploader({
  portfolioId,
  eventSlug,
  media,
  onMediaChange,
}: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

  async function handleUpload(files: FileList) {
    setUploading(true);
    const newMedia: MediaItem[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", file.name.replace(/\.[^.]+$/, ""));
      formData.append("type", "photo");
      formData.append("event_slug", eventSlug);

      try {
        const res = await fetch(`/api/admin/portfolio/${portfolioId}/media`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          newMedia.push(data);
        }
      } catch {
        // 개별 실패는 무시
      }
    }

    onMediaChange([...media, ...newMedia]);
    setUploading(false);
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm("삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?")) return;

    setDeleting((prev) => new Set(prev).add(item.id));

    // URL에서 storage path 추출
    const storagePath = item.url.includes("/portfolio/")
      ? item.url.split("/portfolio/").pop()
      : undefined;

    try {
      await fetch(`/api/admin/portfolio/${portfolioId}/media`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaIds: [item.id],
          storagePaths: storagePath ? [decodeURIComponent(storagePath)] : [],
        }),
      });

      onMediaChange(media.filter((m) => m.id !== item.id));
    } catch {
      alert("삭제에 실패했습니다");
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-200 rounded-sm p-6
          flex flex-col items-center justify-center gap-2 text-center
          hover:border-primary/30 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        ) : (
          <Upload className="w-6 h-6 text-slate-400" />
        )}
        <p className="text-sm text-slate-500">
          {uploading ? "업로드 중..." : "클릭하거나 파일을 드래그하세요"}
        </p>
        <p className="text-xs text-slate-400">JPG, PNG, WebP (자동 최적화)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleUpload(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Media grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative group aspect-square">
              {item.type === "video" ? (
                <div className="w-full h-full bg-slate-800 rounded-sm border border-slate-200 flex flex-col items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span className="text-xs mt-1 text-slate-300">영상</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover rounded-sm border border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <button
                onClick={() => handleDelete(item)}
                disabled={deleting.has(item.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full
                  flex items-center justify-center opacity-0 group-hover:opacity-100
                  transition-opacity disabled:opacity-50"
              >
                {deleting.has(item.id) ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400">총 {media.length}개</p>
    </div>
  );
}
