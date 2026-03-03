"use client";

import { Save, X } from "lucide-react";

interface SlidePanelProps {
  open: boolean;
  title: string;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

export default function SlidePanel({
  open,
  title,
  saving = false,
  onClose,
  onSubmit,
  children,
}: SlidePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/15" />
      <div
        className="ml-auto relative w-[440px] h-full bg-white border-l border-slate-200 overflow-y-auto"
        style={{ boxShadow: "-8px 0 32px 0 rgb(0 0 0 / 0.06)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={onSubmit}>
          <div className="sticky top-0 bg-white border-b border-slate-200 flex items-center justify-between px-5 py-3 z-10">
            <h2 className="text-[14px] font-semibold text-slate-900">{title}</h2>
            <div className="flex items-center gap-1.5">
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 text-[13px] font-medium rounded-[6px] bg-primary text-white hover:bg-primary-600 transition-colors flex items-center gap-1"
              >
                <Save size={13} />
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-[6px] hover:bg-slate-100 transition-colors"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>
          </div>
          <div className="p-5 space-y-5">{children}</div>
        </form>
      </div>
    </div>
  );
}
