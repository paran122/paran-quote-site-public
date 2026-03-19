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
  attendees?: string;
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
