export interface QuoteEmailData {
  quoteNumber: string;
  contactName: string;
  organization: string;
  phone: string;
  email: string;
  department?: string;
  eventName: string;
  eventDate: string;
  eventVenue?: string;
  eventType?: string;
  attendees?: string;
  memo?: string;
  cartItems: CartItemForEmail[];
  totalAmount: number;
  discountAmount?: number;
  /** "견적" | "문의" */
  type: "quote" | "inquiry";
}

export interface CartItemForEmail {
  name: string;
  price: number;
  qty?: number;
  quantity?: number;
  unit?: string;
}
