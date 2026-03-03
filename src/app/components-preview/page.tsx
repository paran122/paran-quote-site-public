"use client";

import { useState } from "react";
import ServiceCard from "@/components/cards/ServiceCard";
import PackageCard from "@/components/cards/PackageCard";
import ConfirmModal from "@/components/ui/ConfirmModal";
import SlidePanel from "@/components/ui/SlidePanel";
import { showToast } from "@/components/ui/Toast";
import CategoryTabs from "@/components/layout/CategoryTabs";
import { useCatalogStore } from "@/stores/catalogStore";
import { formatPrice } from "@/lib/constants";
import {
  User,
  Calendar,
  FileText,
} from "lucide-react";

/* ── 섹션 구분선 ── */
function SectionDivider({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pt-12 pb-6 border-b-2 border-gray-200">
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

/* ── 상태 라벨 ── */
function StateLabel({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full mb-3">
      {label}
    </span>
  );
}

/* ── 견적 요청 폼 (Checkout 페이지에서 추출) ── */
function QuoteFormPreview() {
  const [form, setForm] = useState({
    contactName: "",
    organization: "",
    phone: "",
    email: "",
    department: "",
    eventName: "",
    eventDate: "",
    attendees: "",
    eventType: "",
    eventVenue: "",
    memo: "",
  });
  const [agreed, setAgreed] = useState(false);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const EVENT_TYPE_OPTIONS = [
    "컨퍼런스/세미나",
    "기업 행사",
    "학술대회",
    "문화/축제",
    "기타",
  ];

  const ATTENDEE_OPTIONS = [
    "50명 이하",
    "50~100명",
    "100~300명",
    "300~500명",
    "500명 이상",
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8 max-w-[600px]">
      {/* 담당자 정보 */}
      <div>
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
          <User size={18} className="text-primary" />
          담당자 정보
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              담당자 성함 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
              placeholder="홍길동"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              기관/회사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.organization}
              onChange={(e) => updateField("organization", e.target.value)}
              placeholder="파란컴퍼니"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="010-0000-0000"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="email@company.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              부서
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => updateField("department", e.target.value)}
              placeholder="교육팀"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* 행사 정보 */}
      <div>
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-4">
          <Calendar size={18} className="text-primary" />
          행사 기본 정보
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              행사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.eventName}
              onChange={(e) => updateField("eventName", e.target.value)}
              placeholder="2026 상반기 교육 컨퍼런스"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              행사일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => updateField("eventDate", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              예상 인원
            </label>
            <select
              value={form.attendees}
              onChange={(e) => updateField("attendees", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              <option value="">선택하세요</option>
              {ATTENDEE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              행사 유형
            </label>
            <select
              value={form.eventType}
              onChange={(e) => updateField("eventType", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              <option value="">선택하세요</option>
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              행사 장소
            </label>
            <input
              type="text"
              value={form.eventVenue}
              onChange={(e) => updateField("eventVenue", e.target.value)}
              placeholder="소노캄 고양"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              추가 요청사항
            </label>
            <textarea
              value={form.memo}
              onChange={(e) => updateField("memo", e.target.value)}
              rows={3}
              placeholder="추가 요청사항을 적어주세요"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* 개인정보 동의 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
          />
          <span className="text-sm text-gray-600">
            개인정보 수집 · 이용에 동의합니다{" "}
            <button type="button" className="text-primary text-xs underline ml-1">
              상세보기
            </button>
          </span>
        </label>
      </div>

      {/* 제출 */}
      <button
        type="button"
        onClick={() => showToast("견적 요청 데모 (실제 제출되지 않음)")}
        className="btn-primary btn-lg w-full justify-center"
      >
        <FileText size={18} />
        견적 요청하기
      </button>
      <p className="text-xs text-gray-400 text-center">
        평균 1시간 이내 견적 회신
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════ */
/* ██  메인 페이지                                     */
/* ══════════════════════════════════════════════════ */
export default function ComponentsPreviewPage() {
  const services = useCatalogStore((s) => s.services);
  const packages = useCatalogStore((s) => s.packages);

  const [modalOpen, setModalOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // 인기 서비스 / 일반 서비스 분리
  const popularServices = services.filter((s) => s.isPopular);
  const normalServices = services.filter((s) => !s.isPopular);

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-[80px] pb-20">
      {/* 페이지 타이틀 */}
      <h1 className="text-3xl font-extrabold text-gray-900">
        컴포넌트 미리보기
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        모든 공통 컴포넌트를 한 페이지에서 확인할 수 있습니다.
        GNB(상단), Footer(하단), ToastContainer, KakaoChatButton(우측 하단)은 레이아웃에서 자동 렌더링됩니다.
      </p>

      {/* ─────────────────────────────────────── */}
      {/*  1. GNB                                 */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="1. GNB (Global Navigation Bar)"
        description="레이아웃에서 렌더링. 홈(/)에서는 투명 → 스크롤 시 백색, 다른 페이지에서는 항상 백색. 모바일에서는 햄버거 메뉴."
      />
      <div className="mt-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <StateLabel label="스크롤 전 (홈 전용): 투명 배경 + 흰색 텍스트" />
          <StateLabel label="스크롤 후 / 서브페이지: 백색 배경 + 회색 텍스트" />
        </div>
        <div className="bg-gray-100 rounded-xl p-4 space-y-3">
          {/* 스크롤 전 시뮬레이션 */}
          <p className="text-xs font-medium text-gray-500 mb-2">스크롤 전 (홈 전용)</p>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 flex items-center justify-between">
            <span className="text-white text-lg font-extrabold">파란컴퍼니</span>
            <div className="flex items-center gap-6">
              <span className="text-white text-sm font-medium">홈</span>
              <span className="text-white/80 text-sm">서비스</span>
              <span className="text-white/80 text-sm">포트폴리오</span>
              <span className="text-white/80 text-sm">문의하기</span>
              <span className="bg-white text-primary text-sm font-semibold px-4 py-1.5 rounded-[10px]">견적 요청</span>
            </div>
          </div>
          {/* 스크롤 후 시뮬레이션 */}
          <p className="text-xs font-medium text-gray-500 mb-2 mt-4">스크롤 후 / 서브페이지</p>
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl p-4 flex items-center justify-between">
            <span className="text-gray-900 text-lg font-extrabold">파란컴퍼니</span>
            <div className="flex items-center gap-6">
              <span className="text-primary text-sm font-semibold">홈</span>
              <span className="text-gray-900 text-sm">서비스</span>
              <span className="text-gray-900 text-sm">포트폴리오</span>
              <span className="text-gray-900 text-sm">문의하기</span>
              <span className="bg-primary text-white text-sm font-semibold px-4 py-1.5 rounded-[10px]">견적 요청</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  2. ServiceCard                         */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="2. ServiceCard"
        description="서비스 카드. isPopular=true이면 '인기' 뱃지 표시. 장바구니 담기 버튼(+) 포함."
      />
      <div className="mt-6 space-y-8">
        {/* 인기 서비스 */}
        <div>
          <StateLabel label="인기 서비스 (isPopular: true)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularServices.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
        {/* 일반 서비스 */}
        <div>
          <StateLabel label="일반 서비스 (isPopular: false)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {normalServices.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  3. PackageCard                         */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="3. PackageCard"
        description="패키지 카드. 할인율 뱃지, 포함 서비스 목록, 원가/할인가 표시."
      />
      <div className="mt-6">
        <StateLabel label="전체 패키지" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  4. CategoryTabs                        */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="4. CategoryTabs"
        description="카테고리 필터 탭. 전체 / 카테고리별 / 패키지 탭. 활성 탭은 파란색 배경."
      />
      <div className="mt-6 space-y-4">
        <StateLabel label={`현재 선택: ${activeCategory}`} />
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <CategoryTabs
            activeKey={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  5. 입력 필드 (Forms)                    */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="5. 입력 필드 (Forms)"
        description="프로젝트에서 사용되는 모든 입력 필드 타입. forms/ 폴더 없이 인라인으로 구성."
      />
      <div className="mt-6 space-y-8">
        {/* 텍스트 입력 - 각 상태 */}
        <div>
          <StateLabel label="텍스트 입력 (text)" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[700px]">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">기본 상태</label>
              <input
                type="text"
                placeholder="입력해주세요"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">입력된 상태</label>
              <input
                type="text"
                defaultValue="파란컴퍼니"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                에러 상태 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue=""
                placeholder="필수 입력"
                className="w-full border border-red-400 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
              />
              <p className="text-xs text-red-500 mt-1">필수 입력 항목입니다</p>
            </div>
          </div>
        </div>

        {/* 전화번호 / 이메일 */}
        <div>
          <StateLabel label="전화번호 (tel) / 이메일 (email)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[500px]">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">연락처</label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">이메일</label>
              <input
                type="email"
                placeholder="email@company.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* 날짜 */}
        <div>
          <StateLabel label="날짜 선택 (date)" />
          <div className="max-w-[250px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">행사일</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* 셀렉트 */}
        <div>
          <StateLabel label="셀렉트 (select)" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[500px]">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">예상 인원</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                <option value="">선택하세요</option>
                <option>50명 이하</option>
                <option>50~100명</option>
                <option>100~300명</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">행사 유형</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                <option value="">선택하세요</option>
                <option>컨퍼런스/세미나</option>
                <option>기업 행사</option>
                <option>학술대회</option>
              </select>
            </div>
          </div>
        </div>

        {/* 텍스트에어리어 */}
        <div>
          <StateLabel label="텍스트 영역 (textarea)" />
          <div className="max-w-[500px]">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">추가 요청사항</label>
            <textarea
              rows={3}
              placeholder="추가 요청사항을 적어주세요"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* 체크박스 */}
        <div>
          <StateLabel label="체크박스 (checkbox)" />
          <div className="space-y-3 max-w-[400px]">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-gray-600">
                  체크되지 않은 상태
                </span>
              </label>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-gray-600">
                  체크된 상태 (개인정보 동의)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 버튼 스타일 */}
        <div>
          <StateLabel label="버튼 스타일" />
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary btn-lg">
              <FileText size={18} />
              Primary Large
            </button>
            <button className="btn-primary btn-md">Primary Medium</button>
            <button className="btn-primary btn-sm">Primary Small</button>
            <button className="btn-accent btn-md">Accent</button>
            <button className="btn-ghost btn-sm">Ghost</button>
            <button className="btn-primary btn-md disabled:opacity-40 disabled:cursor-not-allowed" disabled>
              Disabled
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  6. ConfirmModal                        */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="6. ConfirmModal"
        description="확인/삭제 모달. AlertTriangle 아이콘 + 제목 + 설명 + 취소/확인 버튼."
      />
      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          모달 열기
        </button>
        <p className="text-xs text-gray-400 mt-2">
          페이지 로드 시 열린 상태로 표시됩니다. 닫은 후 버튼으로 다시 열 수 있습니다.
        </p>
        <ConfirmModal
          open={modalOpen}
          title="정말 삭제하시겠습니까?"
          description="이 작업은 되돌릴 수 없습니다."
          confirmLabel="삭제"
          onConfirm={() => {
            setModalOpen(false);
            showToast("삭제 완료");
          }}
          onCancel={() => setModalOpen(false)}
        />
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  7. SlidePanel                          */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="7. SlidePanel"
        description="우측에서 슬라이드하는 패널. 폼 영역 + 저장/닫기 버튼."
      />
      <div className="mt-6">
        <button
          onClick={() => setPanelOpen(true)}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          패널 열기
        </button>
        <p className="text-xs text-gray-400 mt-2">
          버튼을 클릭하면 우측에서 패널이 슬라이드됩니다.
        </p>
        <SlidePanel
          open={panelOpen}
          title="서비스 편집"
          onClose={() => setPanelOpen(false)}
          onSubmit={(e) => {
            e.preventDefault();
            setPanelOpen(false);
            showToast("저장 완료");
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">서비스명</label>
              <input
                type="text"
                defaultValue="컨퍼런스 기획서"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이모지</label>
              <input
                type="text"
                defaultValue="📋"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea
                defaultValue="행사 기획안 + 운영 매뉴얼 포함"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기본 가격</label>
              <input
                type="text"
                defaultValue={formatPrice(1500000)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-num"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary" />
                <span className="text-sm text-gray-700">인기 서비스로 표시</span>
              </label>
            </div>
          </div>
        </SlidePanel>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  8. Toast                               */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="8. Toast"
        description="우측 상단 알림. 현재 성공(CheckCircle) 스타일 1종. 2초 후 자동 사라짐."
      />
      <div className="mt-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => showToast("담기 완료")}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            성공 토스트
          </button>
          <button
            onClick={() => showToast("저장 완료")}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            저장 토스트
          </button>
          <button
            onClick={() => showToast("패키지 담기 완료")}
            className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            패키지 토스트
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          현재 Toast 컴포넌트는 단일 스타일(성공)만 지원합니다. 에러/경고 변형이 필요하면 Toast.tsx 확장이 필요합니다.
        </p>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  9. KakaoChatButton                     */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="9. KakaoChatButton"
        description="우측 하단 고정 카카오톡 상담 버튼. 레이아웃에서 렌더링."
      />
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          우측 하단의 노란색 &quot;카톡 상담&quot; 버튼이 레이아웃에서 자동 렌더링됩니다.
        </p>
        <div className="mt-4 bg-gray-100 rounded-xl p-4 inline-flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full bg-[#FEE500] px-4 py-3 shadow-lg">
            <span className="text-[#3B1C1C] text-sm font-semibold">카톡 상담</span>
          </span>
          <span className="text-xs text-gray-400 ml-2">← 실제 모습 (fixed 위치)</span>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  10. Footer                             */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="10. Footer"
        description="레이아웃에서 렌더링. 3컬럼: 회사 정보 / 바로가기 / 연락처. 하단에 저작권."
      />
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-4">
          페이지 하단에 레이아웃에서 자동 렌더링됩니다. 아래는 축소 미리보기입니다.
        </p>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-gray-900 text-gray-300 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white text-lg font-extrabold mb-3">파란컴퍼니</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  교육이 즐거워질 때,<br />직원의 성과는 올라갑니다.
                </p>
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">바로가기</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>서비스</li>
                  <li>포트폴리오</li>
                  <li>견적 요청</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-3">연락처</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>02-6342-2800</li>
                  <li>paran@parancompany.co.kr</li>
                  <li>수원시 팔달구 효원로 278, 6층</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500">
              &copy; 2026 파란컴퍼니. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/*  11. 견적 요청 폼                        */}
      {/* ─────────────────────────────────────── */}
      <SectionDivider
        title="11. 견적 요청 폼 (Checkout Form)"
        description="담당자 정보 + 행사 정보 + 개인정보 동의 + 제출 버튼. /checkout 페이지 폼의 독립 버전."
      />
      <div className="mt-6">
        <QuoteFormPreview />
      </div>
    </div>
  );
}
