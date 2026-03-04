import { z } from "zod";

export const portfolioSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(200),
  event_type: z.string().min(1, "행사 유형을 입력하세요"),
  year: z.number().int().min(2000).max(2100),
  venue: z.string().min(1, "장소를 입력하세요"),
  emoji: z.string().default(""),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  tags: z.array(z.string().max(30)).max(20).default([]),
  gradient_type: z.string().default("blue"),
  is_visible: z.boolean().default(true),
  slug: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  event_date: z.string().optional().nullable(),
  deliverables: z.array(z.string()).optional().nullable(),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;

export const eventReviewSchema = z.object({
  portfolio_id: z.string().uuid(),
  reviewer_name: z.string().min(1, "이름을 입력하세요"),
  reviewer_role: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  content: z.string().min(1, "후기 내용을 입력하세요"),
  rating: z.number().int().min(1).max(5),
});

export type EventReviewInput = z.infer<typeof eventReviewSchema>;
