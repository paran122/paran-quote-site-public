import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "text/plain",
]);

// IP 기반 Rate Limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "파일을 선택해주세요." },
        { status: 400 }
      );
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `최대 ${MAX_FILES}개까지 첨부 가능합니다.` },
        { status: 400 }
      );
    }

    // 파일 유효성 검사
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name}: 파일 크기는 10MB 이하여야 합니다.` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            error: `${file.name}: 허용되지 않는 파일 형식입니다. (이미지, PDF, 문서 파일만 가능)`,
          },
          { status: 400 }
        );
      }
    }

    const db = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const timestamp = Date.now();
    const uploaded: { name: string; url: string; size: number; type: string }[] =
      [];

    for (const file of files) {
      const safeName = file.name
        .replace(/[^a-zA-Z0-9가-힣._-]/g, "_")
        .slice(0, 100);
      const path = `${timestamp}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const { error } = await db.storage
        .from("contact-attachments")
        .upload(path, buffer, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (error) {
        console.error("[contact/upload] Upload failed:", error);
        return NextResponse.json(
          { error: `${file.name} 업로드에 실패했습니다.` },
          { status: 500 }
        );
      }

      // 스토리지 경로만 저장 (어드민에서 볼 때 실시간 signed URL 발급)
      uploaded.push({
        name: file.name,
        url: path,
        size: file.size,
        type: file.type,
      });
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch (err) {
    console.error("[contact/upload] Unexpected error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
