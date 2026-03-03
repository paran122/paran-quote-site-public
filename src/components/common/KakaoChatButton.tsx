"use client";

import { MessageCircle } from "lucide-react";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_xkexdLG";

export default function KakaoChatButton() {
  return (
    <a
      href={KAKAO_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡 상담하기"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
    >
      <MessageCircle size={20} className="text-[#3B1C1C]" />
      <span className="text-sm font-semibold text-[#3B1C1C] hidden sm:inline">
        카톡 상담
      </span>
    </a>
  );
}
