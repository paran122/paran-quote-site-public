import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(200),
  slug: z
    .string()
    .min(1, "슬러그를 입력하세요")
    .max(200)
    .regex(/^[a-zA-Z0-9가-힣\-]+$/, "슬러그는 한글, 영문, 숫자, 하이픈만 가능합니다"),
  content: z.string(),
  excerpt: z.string().max(500).optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  og_image_url: z.string().url().optional().nullable(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
  published_at: z.string().datetime().optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
