// 서비스 장바구니 접수 검증.
// 검증·금액 계산 원본은 서비스 사이트 생성기(별도 저장소)가 만들어 넣는 파일이다.
// functions/service-store.js, data/catalog.json, data/quote-core.js 는 직접 고치지 말 것(다시 넣으면 덮어씀).
import store from "./functions/service-store.js";

export interface StoreEstimate {
  /** 공급가(원, 부가세 별도) */
  supply: number;
  /** 배송비(원, 부가세 없음) */
  ship: number;
  /** 줄 금액(원, 부가세 포함) */
  price: number;
  label: string;
  basis: string;
  make: boolean;
}

export interface StoreTotals {
  supply: number;
  vat: number;
  ship: number;
  total: number;
  unpriced: number;
  priceDate: string | null;
}

export interface StoreItem {
  serviceId: string;
  name: string;
  unit?: string;
  category?: string;
  type?: string;
  options?: Record<string, string>;
  qty?: number;
  design?: number;
  summary?: string;
  counts?: string;
  priceMode?: "ref" | "quote";
  estimate?: StoreEstimate | null;
  totals?: StoreTotals;
}

export interface StoreRequest {
  mode: "services" | "consult";
  customer: { name: string; organization: string; email: string; phone: string };
  event: { title: string; date: string; location: string; budget: string; brief: string };
  items: StoreItem[];
  /** 상담 접수가 시작된 서비스(없으면 null) */
  topic: { id: string; name: string } | null;
}

/** 검증 실패 시 사용자에게 보여 줄 메시지와 상태 코드 */
export class StoreInputError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const normalize = (store as unknown as { normalize: (body: unknown) => StoreRequest }).normalize;

/**
 * 화면이 보낸 장바구니를 카탈로그와 대조하고 금액을 서버에서 다시 계산한다.
 * 화면이 보낸 금액은 쓰지 않는다.
 */
export function normalizeStoreRequest(body: unknown): StoreRequest {
  try {
    return normalize(body);
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (typeof status === "number" && err instanceof Error) {
      throw new StoreInputError(err.message, status);
    }
    throw err;
  }
}
