import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

// 확장자 기반 화이트리스트 (브라우저/OS마다 MIME 인식이 달라 확장자로 검증)
const ALLOWED_EXTENSIONS = new Set([
  // 이미지
  ".jpg", ".jpeg", ".png", ".webp", ".gif",
  // PDF
  ".pdf",
  // 워드
  ".doc", ".docx",
  // 엑셀
  ".xls", ".xlsx",
  // 파워포인트
  ".ppt", ".pptx",
  // 한글
  ".hwp", ".hwpx",
  // 텍스트
  ".txt",
  // 압축
  ".zip",
]);

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx).toLowerCase();
}

// 확장자 → MIME 매핑 (브라우저가 빈 MIME을 보낼 때 사용)
const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".hwp": "application/x-hwp",
  ".hwpx": "application/vnd.hancom.hwpx",
  ".txt": "text/plain",
  ".zip": "application/zip",
};

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
      const ext = getExtension(file.name);
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          {
            error: `${file.name}: 허용되지 않는 파일 형식입니다. (이미지, PDF, 워드/엑셀/PPT, 한글, 압축 파일만 가능)`,
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
      const ext = getExtension(file.name);
      // Supabase Storage 키는 ASCII만 허용 → 한글/특수문자 제거하고 확장자만 유지
      // 원본 파일명은 uploaded.name 으로 별도 저장됨
      const path = `${timestamp}_${Math.random().toString(36).slice(2, 10)}${ext}`;

      // 빈 MIME 또는 octet-stream이면 확장자 기반으로 보정
      const contentType =
        file.type && file.type !== "application/octet-stream"
          ? file.type
          : EXT_TO_MIME[ext] || "application/octet-stream";

      const buffer = Buffer.from(await file.arrayBuffer());
      const { error } = await db.storage
        .from("contact-attachments")
        .upload(path, buffer, {
          contentType,
          cacheControl: "3600",
        });

      if (error) {
        console.error("[contact/upload] Upload failed:", { name: file.name, ext, contentType, error });
        return NextResponse.json(
          { error: `${file.name} 업로드에 실패했습니다. (${error.message})` },
          { status: 500 }
        );
      }

      // 스토리지 경로만 저장 (어드민에서 볼 때 실시간 signed URL 발급)
      uploaded.push({
        name: file.name,
        url: path,
        size: file.size,
        type: contentType,
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
