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
  content?: string;
  createdAt?: string;
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
  isReviewed: boolean;
  reviewedAt?: string;
  reviewComment?: string;
  isFeatured: boolean;
  sortOrder: number;
  naverBlogUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  publishedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 행사장 (공개, paran_quote_site.public_venues 미러)
export interface VenueHall {
  name: string;
  floor?: string | null;
  capacity_modes?: Record<string, number> | null;
  max_capacity?: number | null;
  summary?: string | null;
  facilities?: string[] | null;
  event_fit?: string[] | null;
  rental_min?: number | null;
  rental_max?: number | null;
}

export interface VenueImage {
  url: string;
  category?: string | null;
  caption?: string | null;
  hall?: string | null;
}

export interface VenueContact {
  name?: string | null;
  title?: string | null;
  phone?: string | null;
  email?: string | null;
}

// 강사 (공개, paran_quote_site.public_lecturers 미러)
export interface LecturerImage {
  url: string;
  kind?: string | null;      // profile | lecture_scene | book_cover | press | file
  caption?: string | null;
}

export interface Lecturer {
  id: string;
  sourcePartnerId: string;
  slug: string;
  name: string;
  category?: string | null;       // 분야 (심리·상담, AI·미래 …)
  lectureTitle?: string | null;   // 추천 강의 주제
  bio?: string | null;            // 소개문
  career: string[];               // 약력
  books: string[];                // 강의 이력 / 저서
  images: LecturerImage[];
  coverUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isVisible: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

export interface Venue {
  id: string;
  sourceVenueId: string;
  slug: string;
  name: string;
  venueType?: string;
  region?: string;
  addressApprox?: string;
  maxCapacity?: number;
  hallCount?: number;
  tagline?: string;
  overview?: string;
  strengths?: string[];
  roomPriceMin?: number;
  roomPriceMax?: number;
  mealPrices?: Record<string, number> | null;
  contacts?: VenueContact[] | null;
  homepage?: string | null;
  halls: VenueHall[];
  facilities: string[];
  eventFit: string[];
  images: VenueImage[];
  coverUrl?: string;
  relatedPortfolioSlugs?: string[];
  metaTitle?: string;
  metaDescription?: string;
  isVisible: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
