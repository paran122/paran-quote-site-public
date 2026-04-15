import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { db: { schema: "paran_quote_site" } });
}

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const db = getClient();
    const { data, error } = await db
      .from("portfolio_media")
      .select("*")
      .eq("portfolio_id", params.id)
      .order("sort_order");
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const label = (formData.get("label") as string) || "사진";
    const type = (formData.get("type") as string) || "photo";
    const eventSlug = (formData.get("event_slug") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // WebP 최적화
    let optimized: Buffer;
    let ext = "webp";
    let contentType = "image/webp";
    try {
      const sharp = (await import("sharp")).default;
      optimized = await sharp(buffer)
        .resize(1080, undefined, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      optimized = buffer;
      ext = file.type.split("/")[1] || "png";
      contentType = file.type;
    }

    const timestamp = Date.now();
    const filename = `${timestamp}.${ext}`;
    const storagePath = `${eventSlug || params.id}/${filename}`;

    const storage = getStorageClient();
    const { error: uploadError } = await storage.storage
      .from("qs-portfolio")
      .upload(storagePath, optimized, { contentType, upsert: false });
    if (uploadError) throw uploadError;

    const { data: urlData } = storage.storage.from("qs-portfolio").getPublicUrl(storagePath);

    // DB에 레코드 추가
    const db = getClient();
    const { count } = await db
      .from("portfolio_media")
      .select("id", { count: "exact", head: true })
      .eq("portfolio_id", params.id);
    const sortOrder = count ?? 0;

    const { data, error } = await db
      .from("portfolio_media")
      .insert({
        portfolio_id: params.id,
        event_slug: eventSlug,
        type,
        label,
        url: urlData.publicUrl,
        sort_order: sortOrder,
      })
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "업로드 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { mediaIds, storagePaths } = (await request.json()) as {
      mediaIds: string[];
      storagePaths?: string[];
    };

    if (!mediaIds?.length) {
      return NextResponse.json({ error: "삭제할 항목이 없습니다" }, { status: 400 });
    }

    const db = getClient();

    // SECURITY DEFINER 함수로 삭제 (RLS 우회)
    const { error: rpcError } = await db.rpc("admin_delete_media", { media_ids: mediaIds });
    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    // Storage 파일 삭제
    if (storagePaths?.length) {
      const storage = getStorageClient();
      await storage.storage.from("qs-portfolio").remove(storagePaths);
    }

    return NextResponse.json({ success: true, deleted: mediaIds.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "삭제 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
