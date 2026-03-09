// 카테고리
export interface Category {
  id: string;
  key: string;
  name: string;
  emoji: string;
  sortOrder: number;
}

// 서비스
export interface Service {
  id: string;
  categoryId: string;
  categoryKey: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  description: string;
  basePrice: number;
  isPopular: boolean;
  isVisible: boolean;
  features: ServiceFeature[];
  processSteps: ProcessStep[];
  sizePrices: Record<string, number>;
  options: ServiceOption[];
  sortOrder: number;
}

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface ProcessStep {
  name: string;
}

export interface ServiceOption {
  name: string;
  price: number;
}

// 패키지
export interface Package {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  description?: string;
  eventType: string;
  discountRate: number;
  includedServiceIds: string[];
  originalPrice: number;
  discountPrice: number;
  isVisible: boolean;
  sortOrder: number;
}

// 장바구니
export interface CartItem {
  id: string;
  type: "service" | "package";
  name: string;
  emoji: string;
  category?: string;
  price: number;
  quantity: number;
  options?: { size?: string; addon?: string };
  includedServices?: string[];
  discountRate?: number;
}

// 행사 유형
export interface EventType {
  id: string;
  key: string;
  label: string;
  emoji: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
}

// 포트폴리오
export interface Portfolio {
  id: string;
  title: string;
  eventType: string;
  year: number;
  venue: string;
  emoji: string;
  description?: string;
  imageUrl?: string;
  tags: string[];
  gradientType: string;
  isVisible: boolean;
  slug?: string;
  client?: string;
  eventDate?: string;
  deliverables?: string[];
}

// 포트폴리오 미디어 (통합 테이블)
export interface PortfolioMedia {
  id: string;
  portfolioId: string;
  eventSlug: string;
  type: "gallery" | "photo" | "video";
  label: string;
  url: string;
  sortOrder: number;
  session?: number | null;
}

// 견적
export interface QuoteRequest {
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
  cartItems: CartItem[];
  totalAmount: number;
  discountAmount: number;
}

// 행사 사진 (legacy - portfolio_media로 통합됨)
export interface EventPhoto {
  id: string;
  portfolioId: string;
  url: string;
  caption?: string;
  sortOrder: number;
  photoType?: string;
}

// 행사 후기
export interface EventReview {
  id: string;
  portfolioId: string;
  reviewerName: string;
  reviewerRole?: string;
  organization?: string;
  content: string;
  rating: number;
}

// 통계
export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

// 블로그 포스트
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  naverBlogUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
