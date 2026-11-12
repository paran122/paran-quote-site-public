// 견적 한 건을 고객 화면·관리자 수정 화면이 쓰는 모양으로 바꾼다.
// 금액은 모두 원 단위. (DB의 price·total_amount 는 기존 방식대로 만 원 단위)

const WON_PER_MAN = 10000;

/** 견적 한 줄 (금액은 공급가, 부가세 별도) */
export interface QuoteLine {
  name: string;
  detail: string;
  qty: number;
  unit: string;
  /** 단가(원) */
  unitPrice: number;
}

/** 담당자가 고쳐 저장한 견적 한 차수 */
export interface QuoteRevision {
  rev: number;
  at: string;
  lines: QuoteLine[];
  /** 배송비(원, 부가세 없음) */
  ship: number;
  /** 고객에게 보이는 안내 글 */
  notice: string;
  supply: number;
  vat: number;
  total: number;
}

export interface QuoteTotals {
  supply: number;
  vat: number;
  ship: number;
  total: number;
}

/** 고객 화면에 내보내는 내용. 전화번호·메일은 넣지 않는다. */
export interface PublicQuote {
  number: string;
  kind: "quote" | "inquiry";
  title: string;
  organization: string;
  contactName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  eventDate: string | null;
  venue: string | null;
  /** 0 = 접수 때 그대로, 1 이상 = 담당자가 고친 차수 */
  rev: number;
  lines: Array<QuoteLine & { amount: number }>;
  /** 줄 금액이 부가세 포함인지(예전 접수는 공급가를 따로 남기지 않았다) */
  vatIncluded: boolean;
  totals: QuoteTotals | null;
  notice: string;
}

/** DB의 quotes 한 줄 중 여기서 쓰는 칸 */
export interface QuoteRow {
  id: string;
  quote_number: string;
  contact_name: string;
  organization: string;
  event_name: string;
  event_date: string | null;
  event_venue: string | null;
  event_type: string | null;
  cart_items: unknown;
  total_amount: number | null;
  status: string | null;
  created_at: string;
  updated_at?: string | null;
  revisions?: unknown;
}

interface StoredCartItem {
  name?: unknown;
  price?: unknown;
  qty?: unknown;
  quantity?: unknown;
  unit?: unknown;
  options?: Record<string, unknown> | null;
}

const text = (value: unknown): string => (typeof value === "string" ? value : "");
const number = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export function computeTotals(lines: QuoteLine[], ship: number): QuoteTotals {
  const supply = lines.reduce((sum, line) => sum + Math.round(line.unitPrice * line.qty), 0);
  const vat = Math.trunc(supply * 0.1);
  return { supply, vat, ship, total: supply + vat + ship };
}

export function readRevisions(row: Pick<QuoteRow, "revisions">): QuoteRevision[] {
  if (!Array.isArray(row.revisions)) return [];
  return (row.revisions as QuoteRevision[]).filter(
    (r) => r && typeof r.rev === "number" && Array.isArray(r.lines)
  );
}

/** 접수 때 저장된 장바구니를 견적 줄로 바꾼다 */
function originalLines(row: QuoteRow): { lines: QuoteLine[]; ship: number; vatIncluded: boolean } {
  const items = Array.isArray(row.cart_items) ? (row.cart_items as StoredCartItem[]) : [];
  // 서비스 사이트 접수는 줄마다 공급가(_supply)를 남긴다(금액 미정인 줄은 null → 0원 = 상담 후 확정).
  // 이 칸이 아예 없는 예전 접수는 부가세 포함 금액으로 보여 준다.
  const hasSupply =
    items.length > 0 &&
    items.every((item) => item.options != null && "_supply" in item.options);
  let ship = 0;
  const lines = items.map((item): QuoteLine => {
    const options = item.options ?? {};
    const qty = number(item.qty) || number(item.quantity) || 1;
    if (hasSupply) {
      ship += number(options._ship);
      return {
        name: text(item.name),
        detail: text(options._summary),
        qty: 1,
        unit: text(item.unit) || "식",
        unitPrice: number(options._supply),
      };
    }
    return {
      name: text(item.name),
      detail: text(options._summary),
      qty,
      unit: text(item.unit) || "개",
      unitPrice: Math.round(number(item.price) * WON_PER_MAN),
    };
  });
  return { lines, ship, vatIncluded: !hasSupply };
}

/**
 * 합계(원).
 * DB의 total_amount 는 정수 칸이다. 기존 사이트 접수는 만 원 단위로 들어 있고,
 * 서비스 사이트 접수(줄마다 _supply 가 있음)와 담당자가 고친 견적은 원 단위로 저장한다.
 */
export function totalWon(row: Pick<QuoteRow, "cart_items" | "total_amount" | "revisions">): number {
  const revisions = readRevisions(row);
  if (revisions.length) return revisions[revisions.length - 1].total;
  const items = Array.isArray(row.cart_items) ? (row.cart_items as StoredCartItem[]) : [];
  const storeQuote =
    items.length > 0 && items.every((item) => item.options != null && "_supply" in item.options);
  const stored = number(row.total_amount);
  return storeQuote ? Math.round(stored) : Math.round(stored * WON_PER_MAN);
}

export function latestRevision(row: QuoteRow): QuoteRevision | null {
  const revisions = readRevisions(row);
  return revisions.length ? revisions[revisions.length - 1] : null;
}

/** 관리자 수정 화면의 처음 값: 최신 차수, 없으면 접수 내용 */
export function editableQuote(row: QuoteRow): {
  lines: QuoteLine[];
  ship: number;
  notice: string;
  rev: number;
} {
  const latest = latestRevision(row);
  if (latest) {
    return { lines: latest.lines, ship: latest.ship, notice: latest.notice, rev: latest.rev };
  }
  const original = originalLines(row);
  return {
    // 예전 접수(부가세 포함 금액)는 공급가로 바꿔 넣는다. 담당자가 확인하고 고친다.
    lines: original.vatIncluded
      ? original.lines.map((line) => ({ ...line, unitPrice: Math.round(line.unitPrice / 1.1) }))
      : original.lines,
    ship: original.ship,
    notice: "",
    rev: 0,
  };
}

export function toPublicQuote(row: QuoteRow): PublicQuote {
  const latest = latestRevision(row);
  const inquiry = row.event_name === "문의" || row.event_type === "문의";
  const base = {
    number: row.quote_number,
    kind: inquiry ? ("inquiry" as const) : ("quote" as const),
    title: row.event_name,
    organization: row.organization,
    contactName: row.contact_name,
    status: row.status || "접수대기",
    createdAt: row.created_at,
    eventDate: row.event_date,
    venue: row.event_venue,
  };

  if (latest) {
    return {
      ...base,
      updatedAt: latest.at,
      rev: latest.rev,
      lines: latest.lines.map((line) => ({
        ...line,
        amount: Math.round(line.unitPrice * line.qty),
      })),
      vatIncluded: false,
      totals: {
        supply: latest.supply,
        vat: latest.vat,
        ship: latest.ship,
        total: latest.total,
      },
      notice: latest.notice,
    };
  }

  const original = originalLines(row);
  const total = totalWon(row);
  let totals: QuoteTotals | null = null;
  if (original.lines.length > 0 && total > 0) {
    totals = original.vatIncluded
      ? { supply: 0, vat: 0, ship: 0, total }
      : computeTotals(original.lines, original.ship);
  }
  return {
    ...base,
    updatedAt: row.created_at,
    rev: 0,
    lines: original.lines.map((line) => ({
      ...line,
      amount: Math.round(line.unitPrice * line.qty),
    })),
    vatIncluded: original.vatIncluded,
    totals,
    notice: "",
  };
}

export const manFromWon = (won: number): number => won / WON_PER_MAN;
