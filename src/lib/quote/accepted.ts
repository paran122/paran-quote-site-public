import { supabaseAdmin } from "@/lib/supabase";
import { latestRevision, type PublicQuote, type QuoteRow } from "@/lib/quote/view";

/**
 * 고객이 견적 바로보기 화면(/q/…)에서 '이 견적으로 진행'을 누른 기록.
 * DB 칸을 새로 만들지 않고 내부 메모 표(quote_notes)에 표시를 붙인 한 줄로 남긴다(열람 기록과 같은 방식).
 * 사람이 메모 목록에서 읽어도 뜻이 통하게 적는다:
 *   [고객 승인] 2차 · 홍길동 · 2026-11-22T01:02:03.000Z · 합계 1,234,000원
 *
 * 승인은 그 차수에만 유효하다. 담당자가 견적을 고쳐 새 차수가 생기면 지난 승인은 화면에서 사라지고
 * 다시 승인받아야 한다(메모 줄은 기록으로 남는다).
 */
export const ACCEPT_MARK = "[고객 승인] ";

export interface QuoteAccepted {
  rev: number;
  name: string;
  at: string;
  total: number;
}

/** 견적 유효기간(일) 기본값. 접수일 또는 마지막으로 고친 날부터 센다. 차수에 validDays 가 있으면 그 값을 쓴다. */
export const VALID_DAYS = 30;

const PATTERN = /^(\d+)차 · (.+) · (\S+) · 합계 ([\d,]+)원$/;

export function parseAccepted(content: string): QuoteAccepted | null {
  if (!content.startsWith(ACCEPT_MARK)) return null;
  const m = PATTERN.exec(content.slice(ACCEPT_MARK.length).trim());
  if (!m) return null;
  return { rev: Number(m[1]), name: m[2], at: m[3], total: Number(m[4].replace(/,/g, "")) };
}

/** 이름 칸에 들어온 글을 기록용으로 다듬는다(구분 기호·줄바꿈 제거, 40자까지) */
export function cleanName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f·<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

function format(a: QuoteAccepted): string {
  return `${ACCEPT_MARK}${a.rev}차 · ${a.name} · ${a.at} · 합계 ${Math.round(a.total).toLocaleString("ko-KR")}원`;
}

/** 이 견적의 가장 최근 승인 기록(차수와 무관). 없거나 못 읽으면 null. */
export async function loadAccepted(quoteId: string): Promise<QuoteAccepted | null> {
  const db = supabaseAdmin;
  if (!db) return null;
  try {
    const { data } = await db
      .from("quote_notes")
      .select("content, created_at")
      .eq("quote_id", quoteId)
      .like("content", `${ACCEPT_MARK}%`)
      .order("created_at", { ascending: true });
    const rows = (data ?? []) as Array<{ content: string }>;
    for (let i = rows.length - 1; i >= 0; i--) {
      const parsed = parseAccepted(rows[i].content);
      if (parsed) return parsed;
    }
  } catch (e) {
    console.error("[quote-accept] 승인 기록 읽기 실패:", e);
  }
  return null;
}

/** 승인 한 건을 남긴다. 저장에 실패하면 false. */
export async function recordAccepted(quoteId: string, accepted: QuoteAccepted): Promise<boolean> {
  const db = supabaseAdmin;
  if (!db) return false;
  const { error } = await db
    .from("quote_notes")
    .insert({ quote_id: quoteId, content: format(accepted) });
  if (error) {
    console.error("[quote-accept] 승인 기록 저장 실패:", error.message);
    return false;
  }
  return true;
}

/** 관리자 목록용: 견적 id → 가장 최근 승인 기록 */
export async function loadAcceptedMap(): Promise<Map<string, QuoteAccepted>> {
  const map = new Map<string, QuoteAccepted>();
  const db = supabaseAdmin;
  if (!db) return map;
  try {
    const { data } = await db
      .from("quote_notes")
      .select("quote_id, content, created_at")
      .like("content", `${ACCEPT_MARK}%`)
      .order("created_at", { ascending: true });
    for (const row of (data ?? []) as Array<{ quote_id: string; content: string }>) {
      const parsed = parseAccepted(row.content);
      if (parsed) map.set(row.quote_id, parsed);
    }
  } catch {
    /* 못 읽으면 승인 표시 없이 준다 */
  }
  return map;
}

/** 유효기간 마지막 날(한국 날짜, YYYY-MM-DD). 기준일은 마지막으로 고친 날, 없으면 접수일. */
export function validUntil(row: QuoteRow): string | null {
  const latest = latestRevision(row);
  const base = latest?.at || row.created_at;
  const days =
    latest && typeof latest.validDays === "number" && latest.validDays >= 1 && latest.validDays <= 365
      ? Math.trunc(latest.validDays)
      : VALID_DAYS;
  const start = new Date(base);
  if (Number.isNaN(start.getTime())) return null;
  // 한국 시각 기준 날짜로 센다
  const kst = new Date(start.getTime() + 9 * 3600 * 1000);
  kst.setUTCDate(kst.getUTCDate() + days);
  return kst.toISOString().slice(0, 10);
}

function todayKst(now: Date): string {
  return new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

/** 고객 화면에 붙는 승인·유효기간 상태 */
export interface QuoteDecision {
  /** 유효기간 마지막 날. 금액이 없거나 끝난 요청이면 null */
  validUntil: string | null;
  expired: boolean;
  /** 지금 보이는 차수에 대한 승인. 지난 차수의 승인은 넣지 않는다 */
  accepted: { name: string; at: string } | null;
  canAccept: boolean;
  /**
   * 승인 버튼이 안 나오는 이유(담당자 화면용). 승인할 수 있으면 null.
   * inquiry 문의 건 · status 완료/취소 · no_total 합계 없음 · tbd 상담 후 확정 줄 있음 · expired 유효기간 지남 · accepted 이미 승인됨
   */
  blocked: "inquiry" | "status" | "no_total" | "tbd" | "expired" | "accepted" | null;
}

const OPEN_STATUSES = new Set(["접수대기", "접수", "진행중"]);

/**
 * 지금 승인할 수 있는지와 화면에 보일 상태를 한 군데서 정한다(화면과 승인 요청이 같은 판단을 쓰게).
 * 승인 가능: 견적(문의 아님) · 진행 중인 상태 · 합계가 있고 '상담 후 확정' 줄이 없음 · 유효기간 안 · 이 차수에 아직 승인 없음.
 */
export function decide(
  row: QuoteRow,
  quote: PublicQuote,
  accepted: QuoteAccepted | null,
  now = new Date()
): QuoteDecision {
  const open = OPEN_STATUSES.has(quote.status);
  const priced =
    quote.kind === "quote" &&
    quote.lines.length > 0 &&
    !!quote.totals &&
    quote.totals.total > 0 &&
    !quote.lines.some((line) => line.tbd);
  const current = accepted && accepted.rev === quote.rev ? accepted : null;
  const until = priced && (open || current) ? validUntil(row) : null;
  const expired = !!until && !current && todayKst(now) > until;
  const blocked: QuoteDecision["blocked"] =
    quote.kind !== "quote"
      ? "inquiry"
      : current
        ? "accepted"
        : !open
          ? "status"
          : quote.lines.some((line) => line.tbd)
            ? "tbd"
            : !priced
              ? "no_total"
              : expired
                ? "expired"
                : null;
  return {
    validUntil: until,
    expired,
    accepted: current ? { name: current.name, at: current.at } : null,
    canAccept: blocked === null,
    blocked,
  };
}
