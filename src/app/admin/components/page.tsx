"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Save, X, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import MovingBorderButton from "@/components/ui/MovingBorderButton";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextHoverEffect } from "@/components/ui/TextHoverEffect";
import { BlogPostCard } from "@/components/ui/card-18";

/* ─── 타입 ─── */
interface ComponentInfo {
  name: string;
  path: string;
}

interface Section {
  title: string;
  components: ComponentInfo[];
}

/* ─── 컴포넌트 목록 데이터 ─── */
const SECTIONS: Section[] = [
  {
    title: "공통 UI",
    components: [
      { name: "Toast", path: "components/ui/Toast.tsx" },
      { name: "ConfirmModal", path: "components/ui/ConfirmModal.tsx" },
      { name: "ContactModal", path: "components/ui/ContactModal.tsx" },
      { name: "SlidePanel", path: "components/ui/SlidePanel.tsx" },
    ],
  },
  {
    title: "버튼",
    components: [
      { name: "btn-primary / outline / ghost / white / accent", path: "components/ui/button.tsx" },
      { name: "PulsatingButton", path: "components/ui/pulsating-button.tsx" },
      { name: "ShimmerButton", path: "components/ui/shimmer-button.tsx" },
      { name: "MovingBorderButton", path: "components/ui/MovingBorderButton.tsx" },
    ],
  },
  {
    title: "카드",
    components: [
      { name: "BlogPostCard (card-18)", path: "components/ui/card-18.tsx" },
      { name: "ServiceCard", path: "components/cards/ServiceCard.tsx" },
      { name: "PackageCard", path: "components/cards/PackageCard.tsx" },
      { name: "CardStack", path: "components/ui/CardStack.tsx" },
    ],
  },
  {
    title: "애니메이션",
    components: [
      { name: "BlurFade", path: "components/ui/blur-fade.tsx" },
      { name: "Particles", path: "components/ui/particles.tsx" },
      { name: "BorderBeam", path: "components/ui/border-beam.tsx" },
      { name: "TextHoverEffect", path: "components/ui/TextHoverEffect.tsx" },
      { name: "AnimatedTestimonials", path: "components/ui/animated-testimonials.tsx" },
    ],
  },
  {
    title: "레이아웃",
    components: [
      { name: "GNB", path: "components/layout/GNB.tsx" },
      { name: "Footer", path: "components/layout/Footer.tsx" },
      { name: "AdminSidebar", path: "components/admin/AdminSidebar.tsx" },
      { name: "AdminHeader", path: "components/admin/AdminHeader.tsx" },
      { name: "CategoryTabs", path: "components/layout/CategoryTabs.tsx" },
      { name: "CategorySidebar", path: "components/layout/CategorySidebar.tsx" },
      { name: "SiteShell", path: "components/layout/SiteShell.tsx" },
      { name: "PublicShell", path: "components/layout/PublicShell.tsx" },
    ],
  },
  {
    title: "랜딩 섹션",
    components: [
      { name: "LandingPage", path: "components/landing-v2/LandingPage.tsx" },
      { name: "HeroParticle", path: "components/landing-v2/HeroParticle.tsx" },
      { name: "HeroTitleAnimations", path: "components/landing-v2/HeroTitleAnimations.tsx" },
      { name: "AboutSection", path: "components/landing-v2/AboutSection.tsx" },
      { name: "ServicesSection", path: "components/landing-v2/ServicesSection.tsx" },
      { name: "PortfolioSection", path: "components/landing-v2/PortfolioSection.tsx" },
      { name: "EstimateSection", path: "components/landing-v2/EstimateSection.tsx" },
      { name: "ProcessSection", path: "components/landing-v2/ProcessSection.tsx" },
      { name: "ClientsSection", path: "components/landing-v2/ClientsSection.tsx" },
      { name: "ContactSection", path: "components/landing-v2/ContactSection.tsx" },
      { name: "DesignerSidebar", path: "components/landing-v2/DesignerSidebar.tsx" },
    ],
  },
  {
    title: "블로그",
    components: [
      { name: "BlogContent", path: "components/blog/BlogContent.tsx" },
      { name: "BlogListClient", path: "app/blog/BlogListClient.tsx" },
      { name: "BlogArchiveClient", path: "app/blog/all/BlogArchiveClient.tsx" },
    ],
  },
  {
    title: "어드민",
    components: [
      { name: "BlogPostForm", path: "components/admin/blog/BlogPostForm.tsx" },
      { name: "TiptapEditor", path: "components/admin/blog/TiptapEditor.tsx" },
      { name: "PortfolioForm", path: "components/admin/portfolio/PortfolioForm.tsx" },
      { name: "MediaUploader", path: "components/admin/portfolio/MediaUploader.tsx" },
      { name: "ReviewForm", path: "components/admin/portfolio/ReviewForm.tsx" },
    ],
  },
  {
    title: "공통",
    components: [
      { name: "KakaoChatButton", path: "components/common/KakaoChatButton.tsx" },
      { name: "SiteDataLoader", path: "components/SiteDataLoader.tsx" },
    ],
  },
];

/* ════════════════════════════════════════════════════════
   라이브 프리뷰 렌더러
   ════════════════════════════════════════════════════════ */

/* -- 공통 UI -- */
function PreviewToast() {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg">
        <CheckCircle size={14} className="text-emerald-400 shrink-0" />
        문의가 접수되었습니다
      </div>
    </div>
  );
}

function PreviewConfirmModal() {
  return (
    <div className="flex justify-center">
      <div className="w-[320px] rounded-[14px] bg-white p-5 shadow-lg border border-slate-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50">
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">삭제하시겠습니까?</h3>
            <p className="mt-0.5 text-[12px] text-slate-500">이 작업은 되돌릴 수 없습니다</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <span className="rounded-md px-3 py-1.5 text-[12px] font-medium text-slate-500 bg-slate-50">취소</span>
          <span className="rounded-md bg-red-500 px-3 py-1.5 text-[12px] font-medium text-white">삭제</span>
        </div>
      </div>
    </div>
  );
}

function PreviewContactModal() {
  return (
    <div className="flex justify-center">
      <div className="w-[340px] rounded-2xl bg-white shadow-lg border border-slate-100">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-[14px] font-bold text-slate-900">문의하기</h2>
          <p className="text-[11px] text-slate-400">무엇이든 문의하세요</p>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-300">이름</div>
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-300">이메일</div>
          </div>
          <div className="h-16 rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-300">문의 내용</div>
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-center text-[12px] font-semibold text-white">문의 보내기</div>
        </div>
      </div>
    </div>
  );
}

function PreviewSlidePanel() {
  return (
    <div className="flex justify-end">
      <div className="w-[260px] rounded-l-xl bg-white shadow-lg border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
          <span className="text-[13px] font-semibold text-slate-900">패널 제목</span>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-white"><Save size={10} /> 저장</span>
            <X size={14} className="text-slate-400" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="h-3 w-3/4 rounded bg-slate-100" />
          <div className="h-8 rounded border border-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
          <div className="h-8 rounded border border-slate-200" />
        </div>
      </div>
    </div>
  );
}

/* -- 버튼 -- */
function PreviewButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button className="btn-primary btn-sm">Primary</button>
      <button className="btn-outline btn-sm">Outline</button>
      <button className="btn-ghost btn-sm">Ghost</button>
      <button className="btn-white btn-sm">White</button>
      <button className="btn-accent btn-sm">Accent</button>
    </div>
  );
}

function PreviewPulsatingButton() {
  return (
    <div className="flex justify-center">
      <PulsatingButton className="text-[13px]">견적 요청하기</PulsatingButton>
    </div>
  );
}

function PreviewShimmerButton() {
  return (
    <div className="flex justify-center">
      <ShimmerButton className="text-[13px] px-6 py-2.5">Shimmer 버튼</ShimmerButton>
    </div>
  );
}

function PreviewMovingBorderButton() {
  return (
    <div className="flex justify-center gap-3">
      <MovingBorderButton variant="dark">다크 보더</MovingBorderButton>
      <MovingBorderButton variant="light">라이트 보더</MovingBorderButton>
    </div>
  );
}

/* -- 카드 -- */
function PreviewBlogPostCard() {
  return (
    <div className="max-w-[500px] mx-auto">
      <BlogPostCard
        variant="default"
        tag="트렌드"
        date="2026.03.05"
        title="2026년 기업 행사 트렌드"
        description="올해 주목해야 할 행사 트렌드를 분석합니다."
        href=""
      />
    </div>
  );
}

function PreviewServiceCard() {
  return (
    <div className="flex justify-center">
      <div className="w-[220px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
          <Mail size={18} className="text-blue-500" />
        </div>
        <h3 className="text-[14px] font-bold text-slate-900">서비스 이름</h3>
        <p className="mt-1 text-[12px] text-slate-500">서비스 설명 텍스트</p>
        <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-primary">
          자세히 <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}

function PreviewPackageCard() {
  return (
    <div className="flex justify-center">
      <div className="w-[220px] rounded-xl border-2 border-primary bg-white p-4 shadow-sm">
        <span className="mb-2 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-bold text-primary">인기</span>
        <h3 className="text-[14px] font-bold text-slate-900">스탠다드</h3>
        <p className="mt-1 text-2xl font-bold text-slate-900">150<span className="text-[13px] font-normal text-slate-400">만원~</span></p>
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600"><CheckCircle size={12} className="text-emerald-500" /> 기본 음향/조명</div>
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600"><CheckCircle size={12} className="text-emerald-500" /> 진행 MC</div>
        </div>
      </div>
    </div>
  );
}

function PreviewCardStack() {
  return (
    <div className="flex justify-center">
      <div className="relative h-[120px] w-[200px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-xl border-2 border-white/20 bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg"
            style={{
              width: 160,
              height: 100,
              left: `calc(50% - 80px + ${(i - 1) * 20}px)`,
              bottom: `${i * 6}px`,
              zIndex: 3 - i,
              opacity: 1 - i * 0.15,
              transform: `rotate(${(i - 1) * 6}deg) scale(${1 - i * 0.04})`,
            }}
          >
            <div className="absolute bottom-3 left-3 text-[11px] font-medium text-white/80">카드 {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- 애니메이션 -- */
function PreviewBlurFade() {
  return (
    <BlurFade delay={0}>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-slate-700">BlurFade 텍스트</p>
        <p className="text-[12px] text-slate-400">블러 효과와 함께 페이드인</p>
      </div>
    </BlurFade>
  );
}

function PreviewParticles() {
  return (
    <div className="relative mx-auto h-[100px] w-full overflow-hidden rounded-lg bg-slate-900">
      {/* 정적 미리보기: 실제 Particles는 canvas 기반이라 도트로 표현 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/40"
          style={{
            left: `${10 + (i * 37) % 80}%`,
            top: `${15 + (i * 53) % 70}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <p className="absolute inset-0 flex items-center justify-center text-[12px] text-white/60">Particles (Canvas)</p>
    </div>
  );
}

function PreviewBorderBeam() {
  return (
    <div className="flex justify-center">
      <div className="relative rounded-xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
        <p className="text-[13px] font-medium text-slate-700">BorderBeam 카드</p>
        <p className="text-[11px] text-slate-400">테두리를 따라 빛이 움직입니다</p>
        <BorderBeam size={80} duration={6} />
      </div>
    </div>
  );
}

function PreviewTextHoverEffect() {
  return (
    <div className="mx-auto h-[80px] w-full max-w-[300px]">
      <TextHoverEffect text="PARAN" />
    </div>
  );
}

function PreviewAnimatedTestimonials() {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100 max-w-[360px]">
        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300" />
        <div>
          <p className="text-[13px] font-bold text-slate-900">김정훈 소령</p>
          <p className="text-[11px] font-medium text-primary">해군본부</p>
          <p className="mt-1 text-[11px] text-slate-500">매우 만족합니다. 행사 진행이...</p>
        </div>
      </div>
    </div>
  );
}

/* -- 레이아웃 -- */
function PreviewGNB() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex h-10 items-center justify-between px-4">
        <span className="text-[13px] font-bold text-slate-900">파란컴퍼니</span>
        <div className="flex items-center gap-4 text-[12px] text-slate-500">
          <span>서비스</span><span>포트폴리오</span><span>블로그</span>
          <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-white">문의</span>
        </div>
      </div>
    </div>
  );
}

function PreviewFooter() {
  return (
    <div className="rounded-lg bg-slate-900 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-white/80">파란컴퍼니</span>
        <div className="flex gap-3 text-[11px] text-white/40">
          <span>이용약관</span><span>개인정보</span>
        </div>
      </div>
      <p className="mt-1 text-[10px] text-white/30">02-6342-2801 | info@parancompany.co.kr</p>
    </div>
  );
}

function PreviewAdminSidebar() {
  return (
    <div className="w-[180px] rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-3 py-2">
        <span className="text-[12px] font-bold text-slate-900">Admin</span>
      </div>
      <div className="space-y-0.5 p-1.5">
        {["대시보드", "블로그", "포트폴리오", "사진 관리", "컴포넌트"].map((item, i) => (
          <div key={item} className={`rounded px-2.5 py-1.5 text-[12px] ${i === 0 ? "bg-primary-50 font-medium text-primary" : "text-slate-500"}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewCategoryTabs() {
  return (
    <div className="flex gap-1.5">
      {["전체", "컨퍼런스", "세미나", "기업행사"].map((cat, i) => (
        <span key={cat} className={`rounded-full px-3 py-1 text-[12px] font-medium ${i === 0 ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200"}`}>
          {cat}
        </span>
      ))}
    </div>
  );
}

/* -- 랜딩 섹션 (미니 프리뷰) -- */
function PreviewLandingSection({ label, gradient }: { label: string; gradient: string }) {
  return (
    <div className={`flex h-[100px] items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
      <span className="text-[13px] font-semibold text-white/90">{label}</span>
    </div>
  );
}

/* -- 블로그/어드민 -- */
function PreviewBlogContent() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-[360px] mx-auto">
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="my-3 h-24 rounded-lg bg-slate-50" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}

function PreviewBlogPostForm() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 max-w-[360px] mx-auto space-y-2.5">
      <div className="rounded border border-slate-200 px-3 py-2 text-[12px] text-slate-300">제목</div>
      <div className="rounded border border-slate-200 px-3 py-2 text-[12px] text-slate-300">슬러그</div>
      <div className="h-20 rounded border border-slate-200 px-3 py-2 text-[12px] text-slate-300">에디터 영역</div>
      <div className="flex gap-2">
        <span className="flex-1 rounded bg-primary py-1.5 text-center text-[12px] font-medium text-white">저장</span>
        <span className="rounded border border-slate-200 px-3 py-1.5 text-[12px] text-slate-500">미리보기</span>
      </div>
    </div>
  );
}

function PreviewKakaoChatButton() {
  return (
    <div className="flex justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE500] shadow-lg">
        <svg viewBox="0 0 24 24" fill="#3C1E1E" className="h-6 w-6">
          <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.22 4.65 6.6l-.96 3.56c-.08.3.26.54.52.37l4.23-2.82c.5.05 1.02.09 1.56.09 5.52 0 10-3.58 10-7.9C22 6.58 17.52 3 12 3z" />
        </svg>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   프리뷰 매핑
   ════════════════════════════════════════════════════════ */
const PREVIEW_MAP: Record<string, React.ReactNode> = {
  // 공통 UI
  "Toast": <PreviewToast />,
  "ConfirmModal": <PreviewConfirmModal />,
  "ContactModal": <PreviewContactModal />,
  "SlidePanel": <PreviewSlidePanel />,
  // 버튼
  "btn-primary / outline / ghost / white / accent": <PreviewButtons />,
  "PulsatingButton": <PreviewPulsatingButton />,
  "ShimmerButton": <PreviewShimmerButton />,
  "MovingBorderButton": <PreviewMovingBorderButton />,
  // 카드
  "BlogPostCard (card-18)": <PreviewBlogPostCard />,
  "ServiceCard": <PreviewServiceCard />,
  "PackageCard": <PreviewPackageCard />,
  "CardStack": <PreviewCardStack />,
  // 애니메이션
  "BlurFade": <PreviewBlurFade />,
  "Particles": <PreviewParticles />,
  "BorderBeam": <PreviewBorderBeam />,
  "TextHoverEffect": <PreviewTextHoverEffect />,
  "AnimatedTestimonials": <PreviewAnimatedTestimonials />,
  // 레이아웃
  "GNB": <PreviewGNB />,
  "Footer": <PreviewFooter />,
  "AdminSidebar": <PreviewAdminSidebar />,
  "CategoryTabs": <PreviewCategoryTabs />,
  // 랜딩 섹션
  "HeroParticle": <PreviewLandingSection label="Hero + Particles" gradient="from-slate-900 to-indigo-900" />,
  "AboutSection": <PreviewLandingSection label="About 소개" gradient="from-slate-50 to-blue-50" />,
  "ServicesSection": <PreviewLandingSection label="Services 서비스" gradient="from-white to-slate-50" />,
  "PortfolioSection": <PreviewLandingSection label="Portfolio 포트폴리오" gradient="from-slate-800 to-slate-900" />,
  "EstimateSection": <PreviewLandingSection label="Estimate 견적" gradient="from-blue-500 to-indigo-600" />,
  "ProcessSection": <PreviewLandingSection label="Process 진행과정" gradient="from-white to-slate-50" />,
  "ClientsSection": <PreviewLandingSection label="Clients 고객사" gradient="from-slate-50 to-white" />,
  "ContactSection": <PreviewLandingSection label="Contact 문의" gradient="from-blue-500 to-indigo-700" />,
  // 블로그
  "BlogContent": <PreviewBlogContent />,
  // 어드민
  "BlogPostForm": <PreviewBlogPostForm />,
  // 공통
  "KakaoChatButton": <PreviewKakaoChatButton />,
};

/* ════════════════════════════════════════════════════════
   섹션 블록
   ════════════════════════════════════════════════════════ */
function SectionBlock({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <h2 className="text-[14px] font-bold text-slate-900">{section.title}</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">{section.components.length}</span>
        </div>
        {open ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {section.components.map((comp) => (
            <ComponentCard key={comp.path} comp={comp} />
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentCard({ comp }: { comp: ComponentInfo }) {
  const preview = PREVIEW_MAP[comp.name];

  return (
    <div className="group overflow-hidden rounded-lg border border-slate-100 bg-slate-50/50 transition-all hover:border-slate-200 hover:shadow-sm">
      {/* 프리뷰 영역 */}
      <div className="flex min-h-[140px] items-center justify-center overflow-hidden p-4">
        {preview || (
          <div className="flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white">
            <span className="text-[12px] text-slate-400">{comp.name}</span>
          </div>
        )}
      </div>
      {/* 이름 + 경로 */}
      <div className="border-t border-slate-100 bg-white px-3.5 py-2.5">
        <p className="text-[13px] font-semibold text-slate-800">{comp.name}</p>
        <code className="text-[11px] text-slate-400">src/{comp.path}</code>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   메인 페이지
   ════════════════════════════════════════════════════════ */
export default function AdminComponentsPage() {
  const totalCount = SECTIONS.reduce((sum, s) => sum + s.components.length, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">컴포넌트 목록</h1>
        <p className="mt-1 text-[13px] text-slate-400">
          사이트에서 사용 중인 전체 컴포넌트 ({totalCount}개) · {SECTIONS.length}개 섹션
        </p>
      </div>
      <div className="space-y-5">
        {SECTIONS.map((section) => (
          <SectionBlock key={section.title} section={section} />
        ))}
      </div>
    </div>
  );
}
