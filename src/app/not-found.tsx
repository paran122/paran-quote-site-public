"use client";

import { useEffect, useRef } from "react";

// 없는 주소 안내. 새 서비스 사이트와 같은 모양(어두운 머리 줄 · 연두 주 버튼)으로 화면 전체를 덮는다.
// 예전에는 옛 사이트 메뉴(포트폴리오·비용 가이드 등)와 함께 떠서, 새 사이트에서 길을 잃은 방문자가 옛 사이트로 빠졌다(2026-11-19).
// 뿌리 틀(layout)의 옛 메뉴·하단은 화면낭독기와 키보드가 닿지 않게 inert 로 막는다.
export default function NotFound() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "페이지를 찾을 수 없습니다 | 파란컴퍼니";
    const el = box.current;
    const blocked: Element[] = [];
    if (el) {
      let node: Element | null = el;
      while (node && node !== document.body) {
        const parent: Element | null = node.parentElement;
        if (parent) for (const sib of Array.from(parent.children)) if (sib !== node && !sib.hasAttribute("inert")) { sib.setAttribute("inert", ""); blocked.push(sib); }
        node = parent;
      }
    }
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      blocked.forEach((x) => x.removeAttribute("inert"));
      document.documentElement.style.overflow = prev;
    };
  }, []);

  const btn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, padding: "12px 24px", borderRadius: 100,
    fontWeight: 700, fontSize: 16, textDecoration: "none", border: "1px solid #dcdbe2", color: "#15141a", background: "#fff",
  };

  return (
    <div ref={box} style={{ position: "fixed", inset: 0, zIndex: 2147483000, overflow: "auto", background: "#fff", color: "#15141a", fontFamily: "Pretendard, 'Noto Sans KR', sans-serif", wordBreak: "keep-all" }}>
      <header style={{ background: "#15141a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", minHeight: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <a href="/" aria-label="파란컴퍼니 홈" style={{ display: "inline-flex", alignItems: "center", minHeight: 44 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-white-sm.png" alt="파란컴퍼니" width={115} height={40} />
          </a>
          <nav aria-label="주요 메뉴" style={{ display: "flex", gap: 20, fontSize: 15, fontWeight: 600 }}>
            <a href="/services/" style={{ color: "#fff", textDecoration: "none", padding: "12px 0" }}>서비스</a>
            <a href="/work/" style={{ color: "#fff", textDecoration: "none", padding: "12px 0" }}>진행 사례</a>
            <a href="/cart/" style={{ color: "#fff", textDecoration: "none", padding: "12px 0" }}>장바구니</a>
          </nav>
        </div>
      </header>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px 120px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#55535e" }}>404</p>
        <h1 style={{ margin: "12px 0 16px", fontSize: "clamp(30px, 5vw, 44px)", lineHeight: 1.25, fontWeight: 760, letterSpacing: "-0.03em" }}>페이지를 찾을 수 없습니다.</h1>
        <p style={{ margin: "0 0 32px", fontSize: 17, lineHeight: 1.7, color: "#55535e" }}>주소가 바뀌었거나 없는 페이지입니다. 아래에서 다시 찾아 주세요.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <a href="/services/" style={{ ...btn, background: "#c3ff00", borderColor: "#c3ff00" }}>서비스 둘러보기</a>
          <a href="/work/" style={btn}>진행 사례</a>
          <a href="/request/?mode=consult" style={btn}>행사 상담하기</a>
        </div>
        <p style={{ margin: "32px 0 0", fontSize: 14, color: "#55535e" }}>
          전화 <a href="tel:0263422800" style={{ color: "#15141a", fontWeight: 700 }}>02-6342-2800</a> · 평일 9:00–18:00
        </p>
      </main>
    </div>
  );
}
