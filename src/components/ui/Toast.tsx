"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle } from "lucide-react";

interface ToastMessage {
  id: number;
  text: string;
}

let toastId = 0;
let addToastExternal: ((text: string) => void) | null = null;

export function showToast(text: string) {
  addToastExternal?.(text);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    addToastExternal = addToast;
    return () => {
      addToastExternal = null;
    };
  }, [addToast]);

  return (
    <div className="fixed top-[70px] right-6 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-slate-900 text-white rounded-[6px] px-4 py-2.5 text-[13px] font-medium flex items-center gap-2 animate-slide-in"
          style={{ boxShadow: "0 4px 16px 0 rgb(0 0 0 / 0.12)" }}
        >
          <CheckCircle size={14} className="text-emerald-400 shrink-0" />
          {toast.text}
        </div>
      ))}
    </div>
  );
}
