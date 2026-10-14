export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@parancompany.co.kr";

export const ADMIN_EMAIL =
  process.env.RESEND_ADMIN_EMAIL || "info@parancompany.co.kr";

/** 외부 API 응답 대기 상한 — 서버리스 함수 제한(10초) 안에서 끝나도록 */
const TIMEOUT_MS = 4000;

/** Resend API 직접 호출 (SDK 우회) */
export async function sendEmail(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    // 타임아웃·네트워크 오류 — 접수 자체는 성공 처리해야 하므로 여기서 흡수
    console.error("[resend] Request failed:", err);
    return { success: false, error: String(err) };
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("[resend] API error:", result);
    return { success: false, error: result.message || "Unknown error" };
  }

  return { success: true, id: result.id };
}
