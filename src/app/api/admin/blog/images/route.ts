import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDbClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

interface StorageImage {
  url: string;
  name: string;
  bucket: string;
  folder?: string;
  postTitle?: string;
}

export async function GET() {
  try {
    const db = getDbClient();
    const storage = getStorageClient();
    const results: StorageImage[] = [];
    const seen = new Set<string>();

    // 1. 블로그 게시물에서 사용 중인 썸네일 + 본문 이미지
    const { data: posts } = await db
      .from("blog_posts")
      .select("title, thumbnail_url, content")
      .order("created_at", { ascending: false });

    if (posts) {
      for (const p of posts) {
        if (p.thumbnail_url && !seen.has(p.thumbnail_url)) {
          seen.add(p.thumbnail_url);
          results.push({
            url: p.thumbnail_url,
            name: p.title,
            bucket: "post",
            postTitle: p.title,
          });
        }
        const patterns = [
          /src=["'](https?:\/\/[^"']+)["']/gi,
          /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/gi,
        ];
        for (const regex of patterns) {
          let match;
          while ((match = regex.exec(p.content || "")) !== null) {
            const imgUrl = match[1];
            if (!seen.has(imgUrl) && /\.(webp|jpg|jpeg|png|gif)/i.test(imgUrl)) {
              seen.add(imgUrl);
              results.push({
                url: imgUrl,
                name: `${p.title} (본문)`,
                bucket: "post",
                postTitle: p.title,
              });
            }
          }
        }
      }
    }

    // 2. 블로그 Storage
    const { data: blogFiles } = await storage.storage
      .from("blog")
      .list("images", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (blogFiles) {
      for (const f of blogFiles) {
        if (f.name && /\.(webp|jpg|jpeg|png|gif)$/i.test(f.name)) {
          const { data } = storage.storage.from("blog").getPublicUrl(`images/${f.name}`);
          if (!seen.has(data.publicUrl)) {
            results.push({ url: data.publicUrl, name: f.name, bucket: "blog" });
          }
        }
      }
    }

    // 3. 포트폴리오: slug → 한글 제목 매핑
    const { data: portfolios, error: portfolioErr } = await db
      .from("portfolios")
      .select("slug, title");

    const slugToTitle: Record<string, string> = {};
    if (portfolios && !portfolioErr) {
      for (const p of portfolios) {
        if (p.slug) slugToTitle[p.slug] = p.title;
      }
    }

    // 4. 포트폴리오 이미지 — DB slug 기준으로 Storage 조회
    for (const [slug, title] of Object.entries(slugToTitle)) {
      const { data: files } = await storage.storage
        .from("portfolio")
        .list(slug, { limit: 30, sortBy: { column: "created_at", order: "desc" } });

      if (files) {
        for (const f of files) {
          if (f.name && /\.(webp|jpg|jpeg|png|gif)$/i.test(f.name)) {
            const { data } = storage.storage
              .from("portfolio")
              .getPublicUrl(`${slug}/${f.name}`);
            if (!seen.has(data.publicUrl)) {
              results.push({
                url: data.publicUrl,
                name: `${title}/${f.name}`,
                bucket: "portfolio",
                folder: title,
              });
            }
          }
        }
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "이미지 목록 조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
