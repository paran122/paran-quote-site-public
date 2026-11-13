"use client";

import { useEffect } from "react";

// 예전 문의 팝업 자리. 2026-11-13부터 문의는 새 견적 요청(상담) 화면 한 곳에서 받는다.
// 블로그·사례·회사 소개의 "문의하기" 버튼이 이 컴포넌트를 열면 그 화면으로 보낸다.
// (팝업 양식 원본은 이 파일의 이전 커밋에 있다.)

const CONSULT_URL = "/request?mode=consult";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    onClose();
    window.location.href = CONSULT_URL;
  }, [isOpen, onClose]);

  return null;
}
