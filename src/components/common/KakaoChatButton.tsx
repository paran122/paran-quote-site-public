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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#FEE500] p-3 shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
    >
      <MessageCircle size={22} className="text-[#3B1C1C]" />
    </a>
  );
}
