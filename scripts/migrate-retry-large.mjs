/**
 * pixel limit 초과 파일 재처리 스크립트
 * limitInputPixels: false 옵션으로 초대형 이미지 처리
 */
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'portfolio';
const MAX_WIDTH = 1080;
const WEBP_QUALITY = 80;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const BASE_DIR = path.resolve('public/260225 회사 홈페이지 구축');

const RETRY_FILES = [
  { slug: 'kls', folder: '2025 KLS 3섹터 글로벌 프리미어 런칭', file: '시안물/상세페이지_KLS_251124.jpg', label: '상세페이지', fileSlug: 'detail-page' },
  { slug: 'kls', folder: '2025 KLS 3섹터 글로벌 프리미어 런칭', file: '시안물/인포그래픽 1.jpg', label: '인포그래픽 2', fileSlug: 'infographic-2' },
  { slug: 'gyeonggi-print', folder: '2025 경기도교육청 인쇄 디자인', file: '시안물/인포그래픽 1.jpg', label: '인포그래픽 2', fileSlug: 'infographic-2' },
  { slug: 'goyang-conference', folder: '2025 고양 학교체육 성장컨퍼런스', file: '시안물/대형 등신대_2025 고양 학교체육 성장 컨퍼런스_251209.jpg', label: '대형등신대', fileSlug: 'standee-large' },
  { slug: 'goyang-conference', folder: '2025 고양 학교체육 성장컨퍼런스', file: '시안물/세로 현수막_2025 고양 학교체육 성장 컨퍼런스_251209_1700x5300.jpg', label: '세로현수막', fileSlug: 'banner-vertical' },
  { slug: 'goyang-conference', folder: '2025 고양 학교체육 성장컨퍼런스', file: '시안물/엑스배너_2025 고양 학교체육 성장 컨퍼런스_251209_600 x 1800mm.jpg', label: '엑스배너', fileSlug: 'x-banner' },
  { slug: 'international-forum', folder: '2025 다문화교육 국제협력 포럼', file: '시안물/대형전시부스_미리보기존_2026 국제협력 포럼_260112_10000x3000.jpg', label: '전시부스 미리보기존', fileSlug: 'booth-preview' },
  { slug: 'culture-club-operation', folder: '2025 문화예술클럽 운영', file: '동아리운영_시안물/상세페이지_2025 문화예술클럽 운영_1000px.jpg', label: '상세페이지', fileSlug: 'detail-page' },
  { slug: 'community-energy', folder: '2025 지역사회역량강화', file: '시안물/엑스배너_2025 지역사회 역량강화_250901.jpg', label: '엑스배너', fileSlug: 'x-banner' },
  { slug: 'parent-education', folder: '2025 찾아가는경기학부모교육', file: '1회차/시안물/카드뉴스_2025 찾아가는 경기학부모교육_250910.jpg', label: '카드뉴스', fileSlug: 'card-news' },
  { slug: 'jcs-sns', folder: '2025 합참 SNS 콘텐츠 제작', file: '시안물/광복 80주년_2025 합참 SNS 콘텐츠.jpg', label: '광복 80주년', fileSlug: 'liberation-80' },
];

async function optimizeLargeImage(inputPath) {
  const metadata = await sharp(inputPath, { limitInputPixels: false }).metadata();
  let pipeline = sharp(inputPath, { limitInputPixels: false }).rotate();
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }
  return pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
}

async function uploadToStorage(storagePath, buffer) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: 'image/webp', upsert: true });
  if (error) throw new Error(`Upload: ${storagePath} - ${error.message}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

async function main() {
  console.log(`=== Retry Large Images (${RETRY_FILES.length} files) ===`);
  const results = [];

  for (const item of RETRY_FILES) {
    const inputPath = path.join(BASE_DIR, item.folder, item.file);
    if (!fs.existsSync(inputPath)) {
      console.log(`SKIP: not found - ${item.file}`);
      continue;
    }

    const storagePath = `${item.slug}/${item.fileSlug}.webp`;

    try {
      const origSize = fs.statSync(inputPath).size;
      const buffer = await optimizeLargeImage(inputPath);
      const url = await uploadToStorage(storagePath, buffer);
      const ratio = ((1 - buffer.length / origSize) * 100).toFixed(0);
      console.log(`OK ${item.label} @ ${item.slug} (${(origSize/1024/1024).toFixed(1)}MB -> ${(buffer.length/1024).toFixed(0)}KB, -${ratio}%)`);

      results.push({
        event_slug: item.slug,
        type: 'gallery',
        label: item.label,
        url,
      });
    } catch (err) {
      console.log(`FAIL ${item.label} @ ${item.slug}: ${err.message}`);
    }
  }

  const outputPath = path.resolve('scripts/migration-retry-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nDone: ${results.length}/${RETRY_FILES.length}`);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
