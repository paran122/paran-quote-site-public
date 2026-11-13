export interface EmailAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface QuoteEmailData {
  quoteNumber: string;
  contactName: string;
  organization: string;
  phone: string;
  email: string;
  department?: string;
  eventName: string;
  eventDate: string;  // 미입력 시 "-"
  eventVenue?: string;
  eventType?: string;
  attendees?: string;
  memo?: string;
  cartItems: CartItemForEmail[];
  totalAmount: number;
  discountAmount?: number;
  /** "견적" | "문의" */
  type: "quote" | "inquiry";
  attachments?: EmailAttachment[];
  /** 견적 바로보기 주소(고객 메일에 버튼으로 넣는다) */
  linkUrl?: string | null;
  /** 관리자 화면에서 이 접수를 바로 여는 주소(담당자 메일용) */
  adminUrl?: string | null;
}

export interface CartItemForEmail {
  name: string;
  price: number;
  qty?: number;
  quantity?: number;
  unit?: string;
}
