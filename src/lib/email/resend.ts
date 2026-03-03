export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@parancompany.co.kr";

export const ADMIN_EMAIL =
  process.env.RESEND_ADMIN_EMAIL || "info@parancompany.co.kr";

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

  const response = await fetch("https://api.resend.com/emails", {
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
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("[resend] API error:", result);
    return { success: false, error: result.message || "Unknown error" };
  }

  return { success: true, id: result.id };
}
