import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "허용되지 않는 파일 형식입니다" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // sharp로 WebP 최적화
    let optimized: Buffer;
    let ext = "webp";
    try {
      const sharp = (await import("sharp")).default;
      optimized = await sharp(buffer)
        .resize(1200, undefined, { withoutEnlargement: true })
        .webp({ quality: 90 })
        .toBuffer();
    } catch {
      // sharp 사용 불가 시 원본 업로드
      optimized = buffer;
      ext = file.type.split("/")[1] || "png";
    }

    const timestamp = Date.now();
    const filename = `${timestamp}.${ext}`;
    const storagePath = `images/${filename}`;

    const supabase = getClient();
    const { error: uploadError } = await supabase.storage
      .from("blog")
      .upload(storagePath, optimized, {
        contentType: ext === "webp" ? "image/webp" : file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("blog").getPublicUrl(storagePath);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "업로드 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
