import { supabaseAdmin } from "@/lib/supabase";

/**
 * 고객이 견적 바로보기 링크(/q/…)를 열어 본 기록(내부용).
 * DB 칸을 새로 만들지 않고 내부 메모 표(quote_notes)에 표시를 붙인 한 줄로 남긴다.
 * 사람이 메모 목록에서 읽어도 뜻이 통하게 적는다:
 *   [고객 열람] 3회 · 처음 2026-11-20T01:02:03.000Z · 마지막 2026-11-20T04:05:06.000Z · 2차
 */
export const VIEWED_MARK = "[고객 열람] ";

export interface QuoteViewed {
  first_at: string;
  last_at: string;
  count: number;
  /** 마지막으로 보여 준 차수(0 = 접수 때 그대로) */
  rev: number;
}

/** 같은 열람이 겹쳐 세지지 않게, 이 시간 안에 다시 오면 횟수는 올리지 않는다 */
const SAME_VIEW_MS = 60 * 1000;

const PATTERN = /^(\d+)회 · 처음 (\S+) · 마지막 (\S+) · (\d+)차$/;

export function parseViewed(content: string): QuoteViewed | null {
  if (!content.startsWith(VIEWED_MARK)) return null;
  const m = PATTERN.exec(content.slice(VIEWED_MARK.length).trim());
  if (!m) return null;
  return { count: Number(m[1]), first_at: m[2], last_at: m[3], rev: Number(m[4]) };
}

function format(v: QuoteViewed): string {
  return `${VIEWED_MARK}${v.count}회 · 처음 ${v.first_at} · 마지막 ${v.last_at} · ${v.rev}차`;
}

/** 링크 미리보기·검색 로봇 등은 세지 않는다 */
export function isBotAgent(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return /bot|crawl|spider|preview|slurp|facebookexternalhit|kakaotalk-scrap|whatsapp|telegram|slack|discord|curl|wget|python|headless|lighthouse|monitor/i.test(
    userAgent
  );
}

/**
 * 열람 한 번을 기록한다. 실패해도 견적 화면은 그대로 보여야 하므로 오류를 올리지 않는다.
 * 이 견적을 처음 열어 본 것이면 true(담당자 알림용).
 */
export async function recordQuoteView(quoteId: string, rev: number): Promise<boolean> {
  const db = supabaseAdmin;
  if (!db) return false;
  try {
    const now = new Date();
    const { data } = await db
      .from("quote_notes")
      .select("id, content")
      .eq("quote_id", quoteId)
      .like("content", `${VIEWED_MARK}%`)
      .order("created_at", { ascending: true });
    const rows = (data ?? []) as Array<{ id: string; content: string }>;
    const current = rows.length ? parseViewed(rows[rows.length - 1].content) : null;
    if (current && rows.length) {
      const recent = now.getTime() - new Date(current.last_at).getTime() < SAME_VIEW_MS;
      const next: QuoteViewed = {
        first_at: current.first_at,
        last_at: now.toISOString(),
        count: recent ? current.count : current.count + 1,
        rev,
      };
      await db.from("quote_notes").update({ content: format(next) }).eq("id", rows[rows.length - 1].id);
      return false;
    }
    const iso = now.toISOString();
    const { error } = await db
      .from("quote_notes")
      .insert({ quote_id: quoteId, content: format({ first_at: iso, last_at: iso, count: 1, rev }) });
    return !error;
  } catch (e) {
    console.error("[quote-view] 열람 기록 실패:", e);
    return false;
  }
}

/** 관리자 목록용: 견적 id → 열람 기록 */
export async function loadViewedMap(): Promise<Map<string, QuoteViewed>> {
  const map = new Map<string, QuoteViewed>();
  const db = supabaseAdmin;
  if (!db) return map;
  try {
    const { data } = await db
      .from("quote_notes")
      .select("quote_id, content, created_at")
      .like("content", `${VIEWED_MARK}%`)
      .order("created_at", { ascending: true });
    for (const row of (data ?? []) as Array<{ quote_id: string; content: string }>) {
      const v = parseViewed(row.content);
      if (v) map.set(row.quote_id, v);
    }
  } catch {
    /* 못 읽으면 열람 표시 없이 준다 */
  }
  return map;
}
