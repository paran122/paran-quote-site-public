"use client";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 pt-20">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-bold text-slate-900">
          블로그를 불러올 수 없습니다
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
