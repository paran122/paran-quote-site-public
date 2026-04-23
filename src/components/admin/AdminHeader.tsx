"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, ExternalLink, Menu, Eye, Save } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "대시보드",
  "/admin/blog": "블로그 관리",
  "/admin/blog/new": "새 글 작성",
  "/admin/portfolio": "행사 관리",
  "/admin/portfolio/new": "새 포트폴리오",
  "/admin/photos": "Work 페이지",
};

function getTitle(pathname: string): string {
  // 정확한 매칭 우선
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // /admin/blog/[id]/edit 패턴
  if (/^\/admin\/blog\/[^/]+\/edit$/.test(pathname)) return "글 수정";
  if (/^\/admin\/portfolio\/[^/]+\/edit$/.test(pathname)) return "포트폴리오 수정";
  if (/^\/admin\/portfolio\/[^/]+\/media$/.test(pathname)) return "사진 관리";
  if (/^\/admin\/portfolio\/[^/]+\/reviews$/.test(pathname)) return "후기 관리";

  return "관리자";
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const title = getTitle(pathname);
  const isBlogEdit = /^\/admin\/blog\/[^/]+\/edit$/.test(pathname) || pathname === "/admin/blog/new";

  // BlogPostForm에서 보내는 slug/saving 상태 수신
  const [formState, setFormState] = useState<{ slug?: string; saving?: boolean; isEdit?: boolean }>({});

  const handleFormState = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    setFormState(detail);
  }, []);

  useEffect(() => {
    window.addEventListener("blog-form-state", handleFormState);
    return () => window.removeEventListener("blog-form-state", handleFormState);
  }, [handleFormState]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 lg:pr-[10%] shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 -ml-1"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {isBlogEdit ? (
          <>
            {formState.isEdit && formState.slug && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("blog-form-preview"))}
                className="hidden sm:flex text-sm text-slate-500 hover:text-slate-700 items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                미리보기
              </button>
            )}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("blog-form-submit"))}
              disabled={formState.saving}
              className="btn-primary btn-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {formState.saving ? "저장 중..." : "저장"}
            </button>
          </>
        ) : (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-sm text-slate-500 hover:text-slate-700 items-center gap-1"
          >
            사이트 보기
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    </header>
  );
}
