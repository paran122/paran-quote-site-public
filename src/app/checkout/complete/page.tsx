"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Copy } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { showToast } from "@/components/ui/Toast";
import { QuoteRequest } from "@/types";
import confetti from "canvas-confetti";

const TIMELINE_STEPS = [
  { label: "견적접수", active: true },
  { label: "검토중", active: false },
  { label: "견적발송", active: false },
  { label: "계약체결", active: false },
  { label: "행사준비", active: false },
];

function CompleteContent() {
  const searchParams = useSearchParams();
  const quoteNumber = searchParams.get("qn") ?? "QT-00000000-000";

  const [quote, setQuote] = useState<
    (QuoteRequest & { quoteNumber: string }) | null
  >(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem("lastQuote");
      if (data) {
        setQuote(JSON.parse(data));
      }
    } catch {
      // ignore
    }

    // Confetti 효과
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const copyQuoteNumber = () => {
    navigator.clipboard.writeText(quoteNumber);
    showToast("견적번호가 복사되었습니다");
  };

  return (
    <div className="pt-[56px] min-h-screen bg-slate-50 dark:bg-[#0b1120] ">
      <div className="max-w-[640px] mx-auto px-6 py-16">
        {/* 성공 아이콘 */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-[120px] h-[120px] bg-emerald-50 dark:bg-emerald-900/20 rounded-[20px] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle size={56} className="text-success" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>

        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            견적 요청이 완료되었습니다!
          </h1>
          <p className="text-[13px] text-slate-500 mt-2">
            담당자가 확인 후 빠르게 연락드리겠습니다
          </p>
        </motion.div>

        {/* 견적번호 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={copyQuoteNumber}
            className="inline-flex items-center gap-2.5 bg-primary-50 border border-primary-200 rounded-[10px] px-5 py-3"
          >
            <span className="text-[13px] text-slate-500">견적번호</span>
            <span className="font-num font-bold text-primary">
              {quoteNumber}
            </span>
            <Copy size={14} className="text-primary-400" />
          </button>
        </motion.div>

        {/* 요약 카드 */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-[10px] p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-y-3 text-[13px]">
              <span className="text-slate-400">담당자</span>
              <span className="text-slate-900 dark:text-white font-medium text-right">
                {quote.contactName}
              </span>
              <span className="text-slate-400">기관/회사</span>
              <span className="text-slate-900 dark:text-white font-medium text-right">
                {quote.organization}
              </span>
              <span className="text-slate-400">행사명</span>
              <span className="text-slate-900 dark:text-white font-medium text-right">
                {quote.eventName}
              </span>
              <span className="text-slate-400">행사일</span>
              <span className="text-slate-900 font-medium font-num text-right">
                {quote.eventDate}
              </span>
              {quote.attendees && (
                <>
                  <span className="text-slate-400">예상 인원</span>
                  <span className="text-slate-900 dark:text-white font-medium text-right">
                    {quote.attendees}
                  </span>
                </>
              )}
            </div>
            <hr className="border-slate-100 dark:border-slate-700/50" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-slate-500">서비스 {quote.cartItems.length}건</span>
              <span className="font-num text-xl font-extrabold text-primary">
                {formatPrice(quote.totalAmount)}원
              </span>
            </div>
          </motion.div>
        )}

        {/* 세로 타임라인 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-[10px] p-6"
        >
          <h3 className="text-[13px] font-semibold text-slate-900 dark:text-white mb-5">진행 상태</h3>
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex gap-4">
                {/* 점 + 라인 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full shrink-0 ${
                      step.active
                        ? "bg-slate-900 dark:bg-white shadow-[0_0_0_4px_rgba(15,23,42,0.1)] dark:shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>
                {/* 라벨 */}
                <span
                  className={`text-[13px] pb-10 -mt-0.5 ${
                    step.active
                      ? "text-slate-900 dark:text-white font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link href="/" className="btn-primary btn-lg flex-1 justify-center">
            홈으로 돌아가기
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/work"
            className="btn-outline btn-lg flex-1 justify-center"
          >
            포트폴리오 보기
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-[56px] min-h-screen flex items-center justify-center dark:bg-[#0b1120] ">
          <p className="text-slate-400">로딩 중...</p>
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
