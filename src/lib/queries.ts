import { supabase } from "./supabase";
import { Category, Service, Package as PkgType, Portfolio, EventType, EventPhoto, EventReview, PortfolioMedia, BlogPost } from "@/types";

/** Supabase 클라이언트를 반환하거나, 미연결 시 에러를 throw (catalogStore catch에서 처리) */
function requireClient() {
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

// ── snake_case → camelCase 변환 ──
function mapRow<T>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, l: string) =>
      l.toUpperCase()
    );
    result[camelKey] = row[key];
  }
  return result as T;
}

// ── 카테고리 ──
export async function fetchCategories(): Promise<Category[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<Category>(r));
}

// ── 서비스 ──
export async function fetchServices(): Promise<Service[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("services")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<Service>(r));
}

export async function fetchServiceById(id: string): Promise<Service> {
  const db = requireClient();
  const { data, error } = await db
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapRow<Service>(data);
}

// ── 패키지 ──
export async function fetchPackages(): Promise<PkgType[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("packages")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<PkgType>(r));
}

// ── 포트폴리오 ──
export async function fetchPortfolios(): Promise<Portfolio[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("portfolios")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<Portfolio>(r));
}

// ── 포트폴리오 (slug 조회) ──
export async function fetchPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  const db = requireClient();
  const { data, error } = await db
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return mapRow<Portfolio>(data);
}

// ── 포트폴리오 미디어 (통합) ──
export async function fetchAllPortfolioMedia(): Promise<PortfolioMedia[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("portfolio_media")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<PortfolioMedia>(r));
}

export async function fetchPortfolioMedia(
  portfolioId: string,
  type?: "gallery" | "photo" | "video",
): Promise<PortfolioMedia[]> {
  const db = requireClient();
  let query = db
    .from("portfolio_media")
    .select("*")
    .eq("portfolio_id", portfolioId)
    .order("sort_order");
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<PortfolioMedia>(r));
}

// ── 행사 사진 (legacy) ──
export async function fetchEventPhotos(portfolioId: string): Promise<EventPhoto[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("event_photos")
    .select("*")
    .eq("portfolio_id", portfolioId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<EventPhoto>(r));
}

// ── 행사 사진 (유형별) ──
export async function fetchEventPhotosByType(
  portfolioId: string,
  type: "deliverable" | "photo",
): Promise<EventPhoto[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("event_photos")
    .select("*")
    .eq("portfolio_id", portfolioId)
    .eq("photo_type", type)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<EventPhoto>(r));
}

// ── 행사 후기 ──
export async function fetchEventReviews(portfolioId: string): Promise<EventReview[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("event_reviews")
    .select("*")
    .eq("portfolio_id", portfolioId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<EventReview>(r));
}

// ── 행사 후기 (전체, 평점순) ──
export async function fetchTopReviews(limit = 6): Promise<EventReview[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("event_reviews")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<EventReview>(r));
}

// ── 행사 유형 ──
export async function fetchEventTypes(): Promise<EventType[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("event_types")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<EventType>(r));
}

export async function createEventType(data: {
  key: string;
  label: string;
  emoji: string;
  description: string;
}) {
  const db = requireClient();
  const { data: row, error } = await db
    .from("event_types")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return mapRow<EventType>(row);
}

export async function updateEventType(
  id: string,
  updates: Record<string, unknown>
) {
  const db = requireClient();
  const { error } = await db
    .from("event_types")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteEventType(id: string) {
  const db = requireClient();
  const { error } = await db
    .from("event_types")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── 사이트 설정 ──
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

export async function fetchSiteSettings(): Promise<SiteSetting[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("site_settings")
    .select("*");
  if (error) throw error;
  return data ?? [];
}

// ── 견적 제출 ──
export async function submitQuote(quote: {
  quote_number: string;
  contact_name: string;
  organization: string;
  phone: string;
  email: string;
  department?: string;
  event_name: string;
  event_date: string;
  event_venue?: string;
  event_type?: string;
  attendees?: string;
  memo?: string;
  cart_items: unknown;
  total_amount: number;
  discount_amount?: number;
  user_id?: string;
}) {
  const db = requireClient();
  const { error } = await db.from("quotes").insert(quote);
  if (error) throw error;
}

// ── 견적 제출 (API 라우트 경유 – 이메일 알림 포함) ──
export async function submitQuoteViaApi(quote: {
  quote_number: string;
  contact_name: string;
  organization: string;
  phone: string;
  email: string;
  department?: string;
  event_name: string;
  event_date: string;
  event_venue?: string;
  event_type?: string;
  attendees?: string;
  memo?: string;
  cart_items: unknown;
  total_amount: number;
  discount_amount?: number;
  user_id?: string;
}) {
  const res = await fetch("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "요청 실패" }));
    throw new Error(err.error || "견적 요청에 실패했습니다");
  }
  return res.json();
}

// ── 견적 목록 (관리자) ──
export interface QuoteRow {
  id: string;
  quoteNumber: string;
  contactName: string;
  organization: string;
  phone: string;
  email: string;
  department: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  eventType: string;
  attendees: string;
  memo: string;
  cartItems: { name: string; emoji: string; price: number; type: string }[];
  totalAmount: number;
  discountAmount: number;
  status: string;
  createdAt: string;
}

export async function fetchQuotes(statusFilter?: string): Promise<QuoteRow[]> {
  const db = requireClient();
  let query = db
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "전체") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<QuoteRow>(r));
}

export async function updateQuoteStatus(id: string, status: string) {
  const db = requireClient();
  const { error } = await db
    .from("quotes")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ── 관리자 메모 ──
export interface AdminNote {
  id: string;
  quoteId: string;
  content: string;
  createdAt: string;
}

export async function fetchAdminNotes(
  quoteId: string
): Promise<AdminNote[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("admin_notes")
    .select("*")
    .eq("quote_id", quoteId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<AdminNote>(r));
}

export async function addAdminNote(
  quoteId: string,
  content: string
): Promise<AdminNote> {
  const db = requireClient();
  const { data, error } = await db
    .from("admin_notes")
    .insert({ quote_id: quoteId, content })
    .select()
    .single();
  if (error) throw error;
  return mapRow<AdminNote>(data);
}

// ── 서비스 CRUD (관리자) ──
export async function createService(data: {
  category_id: string;
  category_key: string;
  name: string;
  emoji: string;
  description: string;
  base_price: number;
}) {
  const db = requireClient();
  const { data: row, error } = await db
    .from("services")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return mapRow<Service>(row);
}

export async function updateService(
  id: string,
  updates: Record<string, unknown>
) {
  const db = requireClient();
  const { error } = await db
    .from("services")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteService(id: string) {
  const db = requireClient();
  const { error } = await db
    .from("services")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── 패키지 CRUD (관리자) ──
export async function createPackage(data: {
  name: string;
  emoji: string;
  event_type: string;
  discount_rate: number;
  included_service_ids: string[];
}) {
  const db = requireClient();
  const { data: row, error } = await db
    .from("packages")
    .insert({
      ...data,
      original_price: 0,
      discount_price: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRow<PkgType>(row);
}

export async function updatePackage(
  id: string,
  updates: Record<string, unknown>
) {
  const db = requireClient();
  const { error } = await db
    .from("packages")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deletePackage(id: string) {
  const db = requireClient();
  const { error } = await db
    .from("packages")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── 포트폴리오 CRUD (관리자) ──
export async function updatePortfolio(
  id: string,
  updates: Record<string, unknown>
) {
  const db = requireClient();
  const { error } = await db
    .from("portfolios")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deletePortfolio(id: string) {
  const db = requireClient();
  const { error } = await db
    .from("portfolios")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ── 대시보드 통계 ──
export interface DashboardStats {
  monthlyQuotes: number;
  totalServices: number;
  totalPackages: number;
  monthlyRevenue: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const db = requireClient();
  const now = new Date();
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [quotesRes, servicesRes, packagesRes] = await Promise.all([
    db.from("quotes").select("total_amount").gte("created_at", firstDay),
    db.from("services").select("id", { count: "exact", head: true }),
    db.from("packages").select("id", { count: "exact", head: true }),
  ]);

  const monthQuotes = quotesRes.data ?? [];
  const revenue = monthQuotes.reduce(
    (sum, q) => sum + ((q.total_amount as number) || 0),
    0
  );

  return {
    monthlyQuotes: monthQuotes.length,
    totalServices: servicesRes.count ?? 0,
    totalPackages: packagesRes.count ?? 0,
    monthlyRevenue: revenue,
  };
}

export async function fetchRecentQuotes(
  limit = 5
): Promise<QuoteRow[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<QuoteRow>(r));
}

// ── 블로그 포스트 ──
export async function fetchPublishedBlogPosts(
  category?: string,
  limit = 20,
  offset = 0,
): Promise<BlogPost[]> {
  const db = requireClient();
  let query = db
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<BlogPost>(r));
}

export async function fetchFeaturedBlogPosts(): Promise<BlogPost[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .lte("published_at", new Date().toISOString())
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<BlogPost>(r));
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return mapRow<BlogPost>(data);
}

export async function fetchPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .lte("published_at", new Date().toISOString())
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return mapRow<BlogPost>(data);
}

export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => mapRow<BlogPost>(r));
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return mapRow<BlogPost>(data);
}

export async function createBlogPost(input: Record<string, unknown>): Promise<BlogPost> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return mapRow<BlogPost>(data);
}

export async function updateBlogPost(id: string, updates: Record<string, unknown>): Promise<BlogPost> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapRow<BlogPost>(data);
}

export async function deleteBlogPost(id: string) {
  const db = requireClient();
  const { error } = await db
    .from("blog_posts")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function fetchPublishedBlogPostCount(category?: string): Promise<number> {
  const db = requireClient();
  let query = db
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true)
    .lte("published_at", new Date().toISOString());

  if (category) query = query.eq("category", category);

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function fetchBlogCategories(): Promise<string[]> {
  const db = requireClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("category")
    .eq("is_published", true)
    .lte("published_at", new Date().toISOString())
    .not("category", "is", null)
    .order("category");
  if (error) throw error;
  const categories = Array.from(new Set((data ?? []).map((r) => r.category as string).filter(Boolean)));
  return categories;
}

// ── 사이트 설정 업데이트 ──
export async function updateSiteSetting(key: string, value: string) {
  const db = requireClient();
  const { error } = await db
    .from("site_settings")
    .update({ value })
    .eq("key", key);
  if (error) throw error;
}

