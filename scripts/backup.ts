/**
 * Supabase 전체 백업 스크립트
 * - Storage: portfolio, blog 버킷의 모든 파일을 폴더 구조 그대로 다운로드
 * - DB: 주요 테이블을 JSON으로 내보내기
 * - 이미 받은 파일은 건너뛰고 새로운 것만 다운로드
 *
 * 실행: npm run backup
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// .env.local 로드
config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("환경 변수가 없습니다: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  console.error(".env.local 파일을 확인하세요.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: "paran_quote_site" },
});

// 백업 폴더: 프로젝트 상위에 생성 (git에 포함되지 않도록)
const BACKUP_ROOT = path.resolve(__dirname, "../../supabase-backup/parancompany");
const STORAGE_DIR = path.join(BACKUP_ROOT, "storage");
const DB_DIR = path.join(BACKUP_ROOT, "db");

const BUCKETS = ["portfolio", "blog"];
// paran_quote_site 스키마에 실제로 존재하는 테이블만 백업
// (이전엔 categories, event_types, services, site_settings, quote_comments도 있었으나 삭제됨 — 옛 백업 파일은 보존)
const DB_TABLES = [
  "blog_posts",
  "blog_research",
  "blog_topics",
  "portfolios",
  "portfolio_media",
  "event_reviews",
  "quotes",
  "quote_notes",
];

// ─── Storage 백업 ───────────────────────────────────────────

async function listAllFiles(bucket: string, folder: string = ""): Promise<string[]> {
  const files: string[] = [];
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error(`  목록 조회 실패 [${bucket}/${folder}]:`, error.message);
    return files;
  }

  for (const item of data || []) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name;

    if (item.id === null) {
      // 폴더 — 재귀 탐색
      const subFiles = await listAllFiles(bucket, fullPath);
      files.push(...subFiles);
    } else {
      // 파일
      files.push(fullPath);
    }
  }

  return files;
}

async function downloadFile(bucket: string, filePath: string): Promise<boolean> {
  const localPath = path.join(STORAGE_DIR, bucket, filePath);
  const localDir = path.dirname(localPath);

  // 이미 존재하면 건너뛰기
  if (fs.existsSync(localPath)) {
    return false;
  }

  // 폴더 생성
  fs.mkdirSync(localDir, { recursive: true });

  const { data, error } = await supabase.storage.from(bucket).download(filePath);

  if (error) {
    console.error(`  다운로드 실패: ${bucket}/${filePath} — ${error.message}`);
    return false;
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  fs.writeFileSync(localPath, buffer);
  return true;
}

async function backupStorage() {
  console.log("\n═══ Storage 백업 시작 ═══\n");

  let totalFiles = 0;
  let newFiles = 0;
  let failedFiles = 0;

  for (const bucket of BUCKETS) {
    console.log(`📁 [${bucket}] 버킷 스캔 중...`);
    const files = await listAllFiles(bucket);
    totalFiles += files.length;
    console.log(`   ${files.length}개 파일 발견`);

    for (const file of files) {
      const downloaded = await downloadFile(bucket, file);
      if (downloaded) {
        newFiles++;
        process.stdout.write(`   ✅ ${file}\n`);
      }
    }
  }

  console.log(`\n📊 Storage 결과: 전체 ${totalFiles}개 / 새로 다운로드 ${newFiles}개 / 기존 ${totalFiles - newFiles - failedFiles}개\n`);
}

// ─── DB 백업 ────────────────────────────────────────────────

async function backupDatabase() {
  console.log("═══ DB 백업 시작 ═══\n");

  fs.mkdirSync(DB_DIR, { recursive: true });

  for (const table of DB_TABLES) {
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.error(`  ❌ ${table}: ${error.message}`);
      continue;
    }

    const filePath = path.join(DB_DIR, `${table}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`  ✅ ${table}: ${data.length}개 레코드`);
  }

  // 백업 시간 기록
  const metaPath = path.join(BACKUP_ROOT, "backup-info.json");
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        lastBackup: new Date().toISOString(),
        buckets: BUCKETS,
        tables: DB_TABLES,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log("");
}

// ─── 실행 ───────────────────────────────────────────────────

async function main() {
  console.log("🔄 Supabase 백업 시작");
  console.log(`📂 백업 위치: ${BACKUP_ROOT}`);
  console.log(`📅 ${new Date().toLocaleString("ko-KR")}\n`);

  fs.mkdirSync(BACKUP_ROOT, { recursive: true });

  await backupDatabase();
  await backupStorage();

  console.log("✅ 백업 완료!");
  console.log(`📂 ${BACKUP_ROOT}`);
}

main().catch((err) => {
  console.error("백업 실패:", err);
  process.exit(1);
});
