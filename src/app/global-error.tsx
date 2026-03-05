"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-slate-900">
            페이지를 불러올 수 없습니다
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {error.message || "알 수 없는 오류가 발생했습니다."}
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-slate-400">코드: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
