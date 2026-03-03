/**
 * 포트폴리오 미디어 마이그레이션 스크립트
 * - 새 사진 1080px WebP 최적화
 * - Supabase Storage 업로드
 * - 결과 JSON 출력 (DB 작업은 MCP로 별도 처리)
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

// CLI arg로 특정 이벤트만 처리 가능: node script.mjs kls
const targetSlug = process.argv[2] || null;

// 폴더 → DB 매핑
const EVENT_MAP = [
  {
    folder: '2025 KLS 3섹터 글로벌 프리미어 런칭',
    slug: 'kls',
    portfolioId: 'c68874aa-5f8f-4816-97d2-6d29f8c58a5b',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 경기도교육청 인쇄 디자인',
    slug: 'gyeonggi-print',
    portfolioId: '__NEW__',
    subDirs: { design: ['시안물'], photo: [] }
  },
  {
    folder: '2025 고양 학교체육 성장컨퍼런스',
    slug: 'goyang-conference',
    portfolioId: 'c9f1fc3d-962c-4c1a-82e6-0f50f5ff5f1b',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 교육감협의회 부스 운영',
    slug: 'education-council-booth',
    portfolioId: '96210ebf-fbdc-45aa-9093-f4e1acadcc0b',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 다문화교육 국제협력 포럼',
    slug: 'international-forum',
    portfolioId: '16cf9a98-ad11-495f-a4f1-83b130ea7920',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 문화예술클럽 결과공유회',
    slug: 'culture-club-showcase',
    portfolioId: 'c42d3b1a-8026-4ae0-96b8-0e1f219fb9a1',
    subDirs: { design: ['결과공유회_시안물'], photo: ['결과공유회_현장사진'] }
  },
  {
    folder: '2025 문화예술클럽 운영',
    slug: 'culture-club-operation',
    portfolioId: '1ec0e78e-2c25-4d89-96d8-1d78b722a78a',
    subDirs: { design: ['동아리운영_시안물'], photo: ['동아리운영_현장사진'] }
  },
  {
    folder: '2025 지역사회역량강화',
    slug: 'community-energy',
    portfolioId: '1007f849-06b3-49d8-89cf-49bd3137cfdd',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 찾아가는경기학부모교육',
    slug: 'parent-education',
    portfolioId: '22d26d86-8517-4d8d-a115-fbef6acdbed6',
    subDirs: {
      design: ['1회차/시안물', '2회차/시안물', '3회차/시안물', '4회차/시안물', '5회차/시안물'],
      photo: ['1회차/현장사진', '2회차/현장사진', '3회차/현장사진', '4회차/현장사진', '5회차/현장사진']
    },
    extraPhotos: ['5회차']
  },
  {
    folder: '2025 찾아가는교육_예술인재단',
    slug: 'artist-rights',
    portfolioId: '754a63d8-d150-4533-866f-e4b183544922',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 추계자동차세미나',
    slug: 'auto-seminar-fall',
    portfolioId: 'd69c6df4-ef38-4403-9a1e-d93f5f3c86ff',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 춘계자동차세미나',
    slug: 'auto-seminar-spring',
    portfolioId: '696835c3-69fd-4490-b66e-c8ca73884ee1',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 필승해군캠프',
    slug: 'navy-camp',
    portfolioId: '21f7f57e-b633-4ac6-9167-96bcad8552d8',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 하계자동차세미나',
    slug: 'auto-seminar-summer',
    portfolioId: '79e5ff35-045a-4894-a672-121ed8e7ef9b',
    subDirs: { design: ['시안물'], photo: ['현장사진'] }
  },
  {
    folder: '2025 합참 SNS 콘텐츠 제작',
    slug: 'jcs-sns',
    portfolioId: '549cd164-31e8-45ac-9e36-40f45143d047',
    subDirs: { design: ['시안물'], photo: [] }
  }
];

function extractLabel(filename) {
  const name = path.parse(filename).name;
  const labelMap = [
    [/포스터/i, '포스터'], [/엑스배너/i, '엑스배너'], [/상세페이지/i, '상세페이지'],
    [/리플렛/i, '리플렛'], [/카드뉴스/i, '카드뉴스'], [/포토존/i, '포토존'],
    [/대형.*전시.*부스|전시부스/i, '대형전시부스'], [/대형.*등신대/i, '대형등신대'],
    [/대형.*현수막/i, '대형현수막'], [/가로.*현수막/i, '가로현수막'],
    [/세로.*현수막/i, '세로현수막'], [/벽면.*현수막/i, '벽면현수막'],
    [/현수막/i, '현수막'], [/테이블.*등신대/i, '테이블 등신대'],
    [/캐릭터.*등신대/i, '캐릭터 등신대'], [/등신대/i, '등신대'],
    [/초대장/i, '초대장'], [/명찰/i, '명찰'],
    [/인포그래픽/i, '인포그래픽'], [/유튜브.*썸네일/i, '유튜브 썸네일'],
    [/썸네일/i, '썸네일'], [/포디움/i, '포디움'], [/키링/i, '키링'],
    [/폼보드/i, '폼보드'], [/DID/i, 'DID'], [/LED.*wall/i, 'LED Wall'],
    [/LED.*전광판/i, 'LED 전광판'], [/LED/i, 'LED'], [/PIP/i, 'PIP'],
    [/PPT|ppt/i, 'PPT 배경'], [/감사메일/i, '감사메일'], [/대봉투/i, '대봉투'],
    [/웹.*배너/i, '웹 배너'], [/네이버.*배너/i, '네이버 배너'],
    [/안전한.*문화/i, '안전한 문화예술 배너'],
    [/웹페이지/i, '웹페이지'], [/기념품/i, '기념품'], [/일력/i, '일력'],
    [/쇼핑백/i, '쇼핑백'], [/이벤터스/i, '이벤터스'], [/자료집/i, '자료집'],
    [/스카시|아크릴.*글자/i, '아크릴 글자'], [/조형물/i, '조형물'],
    [/안내판/i, '안내판'], [/인스타/i, '인스타그램'], [/구글폼/i, '구글폼'],
    [/엽서/i, '엽서'], [/원형.*스티커/i, '원형 스티커'], [/부스.*디자인/i, '부스'],
    [/전시패널/i, '전시패널'], [/전광판/i, '전광판'], [/타임테이블/i, '타임테이블'],
    [/아트보드/i, '아트보드'], [/Zoom/i, 'Zoom 배경'],
    [/대기실|vip.*대기/i, 'VIP 대기실'], [/콘솔/i, '콘솔 가림막'],
    [/수료증/i, '수료증'], [/만족도/i, '만족도 조사'],
    [/예술교육가/i, '예술교육가 풀 모집'],
    [/동아리.*모집/i, '동아리 모집 포스터'], [/기업.*모집/i, '기업 모집 상세페이지'],
    [/광복/i, '광복 80주년'], [/서울.*수복/i, '서울 수복'],
    [/파병/i, '파병 기념'], [/합참.*창설/i, '합참 창설'],
    [/ABC/i, 'ABC타입'], [/나는.*어떤|문화예술클럽.*타입/i, '문화예술클럽 타입'],
    [/럭키드로우/i, '럭키드로우 명함'], [/실물.*스탠딩/i, '실물 스탠딩'],
    [/특강.*카드뉴스/i, '특강 카드뉴스'], [/특강.*포스터/i, '특강 포스터'],
    [/보수교육.*상세/i, '보수교육 상세페이지'], [/보수교육.*포스터/i, '보수교육 포스터'],
    [/배너/i, '배너'], [/대지/i, '시안'],
    [/1111/i, '기념일 콘텐츠'],
    [/원페이퍼/i, '원페이퍼'],
  ];
  for (const [regex, label] of labelMap) {
    if (regex.test(name)) return label;
  }
  return name.replace(/_/g, ' ').replace(/\d{6,}/g, '').replace(/\s+/g, ' ').trim().substring(0, 50) || '시안물';
}

function slugify(label) {
  const map = {
    '포스터': 'poster', '엑스배너': 'x-banner', '상세페이지': 'detail-page',
    '리플렛': 'leaflet', '카드뉴스': 'card-news', '포토존': 'photo-zone',
    '대형전시부스': 'booth-large', '대형등신대': 'standee-large',
    '대형현수막': 'banner-large', '가로현수막': 'banner-horizontal',
    '세로현수막': 'banner-vertical', '벽면현수막': 'wall-banner',
    '현수막': 'banner', '테이블 등신대': 'table-standee',
    '캐릭터 등신대': 'character-standee', '등신대': 'standee',
    '초대장': 'invitation', '명찰': 'badge', '인포그래픽': 'infographic',
    '유튜브 썸네일': 'yt-thumb', '썸네일': 'thumb', '포디움': 'podium',
    '키링': 'keyring', '폼보드': 'foam-board', 'DID': 'did',
    'LED Wall': 'led-wall', 'LED 전광판': 'led-board', 'LED': 'led',
    'PIP': 'pip', 'PPT 배경': 'ppt-bg', '감사메일': 'thanks-email',
    '대봉투': 'envelope', '웹 배너': 'web-banner', '네이버 배너': 'naver-banner',
    '안전한 문화예술 배너': 'safe-culture-banner', '웹페이지': 'webpage',
    '기념품': 'souvenir', '일력': 'calendar', '쇼핑백': 'shopping-bag',
    '이벤터스': 'eventus', '자료집': 'booklet', '아크릴 글자': 'acrylic-text',
    '조형물': 'sculpture', '안내판': 'sign', '인스타그램': 'instagram',
    '구글폼': 'google-form', '엽서': 'postcard', '원형 스티커': 'sticker',
    '부스': 'booth', '전시패널': 'panel', '전광판': 'led-board2',
    '타임테이블': 'timetable', '아트보드': 'artboard', 'Zoom 배경': 'zoom-bg',
    'VIP 대기실': 'vip-room', '콘솔 가림막': 'console-cover',
    '수료증': 'certificate', '만족도 조사': 'survey',
    '예술교육가 풀 모집': 'educator-recruit', '동아리 모집 포스터': 'club-recruit',
    '기업 모집 상세페이지': 'corp-recruit', '광복 80주년': 'liberation-80',
    '서울 수복': 'seoul-liberation', '파병 기념': 'dispatch',
    '합참 창설': 'jcs-founding', 'ABC타입': 'abc-type',
    '문화예술클럽 타입': 'club-type', '럭키드로우 명함': 'lucky-draw',
    '실물 스탠딩': 'standing', '특강 카드뉴스': 'special-card-news',
    '특강 포스터': 'special-poster', '보수교육 상세페이지': 'edu-detail',
    '보수교육 포스터': 'edu-poster', '배너': 'banner-misc',
    '시안': 'draft', '기념일 콘텐츠': 'memorial', '원페이퍼': 'one-pager',
    '현장사진': 'photo',
  };
  return map[label] || label.replace(/[^a-zA-Z0-9가-힣]/g, '-').replace(/-+/g, '-').toLowerCase().substring(0, 40);
}

function isImage(file) {
  return /\.(jpg|jpeg|png|webp|gif|bmp|tiff?)$/i.test(file);
}

function getImageFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(f => isImage(f) && fs.statSync(path.join(dirPath, f)).isFile())
    .sort();
}

async function optimizeImage(inputPath) {
  const metadata = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath).rotate();
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

async function deleteOldStorageFiles(slug) {
  // video 파일명 패턴 (*.mp4.webp 등은 없으므로 video 제외 로직)
  const { data: files, error } = await supabase.storage
    .from(BUCKET).list(slug, { limit: 1000 });

  if (error || !files) {
    console.log(`  ! Storage list failed for ${slug}: ${error?.message}`);
    return 0;
  }

  // video 파일 제외 (mp4, mov, 또는 'video' 포함)
  const toDelete = files
    .filter(f => f.name !== '.emptyFolderPlaceholder' && !/\.(mp4|mov|webm)$/i.test(f.name))
    .map(f => `${slug}/${f.name}`);

  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.storage.from(BUCKET).remove(toDelete);
    if (delErr) console.log(`  ! Storage delete error: ${delErr.message}`);
  }
  return toDelete.length;
}

async function processEvent(event) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`>> ${event.folder} (${event.slug})`);

  const folderPath = path.join(BASE_DIR, event.folder);
  if (!fs.existsSync(folderPath)) {
    console.log(`  SKIP: folder not found`);
    return null;
  }

  // Storage 기존 파일 삭제
  const deleted = await deleteOldStorageFiles(event.slug);
  console.log(`  Storage: ${deleted} old files removed`);

  // 시안물 수집
  const designFiles = [];
  for (const subDir of event.subDirs.design) {
    const dir = path.join(folderPath, subDir);
    getImageFiles(dir).forEach(f => designFiles.push({ file: f, dir }));
  }

  // 현장사진 수집
  const photoFiles = [];
  for (const subDir of event.subDirs.photo) {
    const dir = path.join(folderPath, subDir);
    getImageFiles(dir).forEach(f => photoFiles.push({ file: f, dir }));
  }
  if (event.extraPhotos) {
    for (const extra of event.extraPhotos) {
      const dir = path.join(folderPath, extra);
      getImageFiles(dir).forEach(f => {
        if (!f.includes('시안물') && !f.includes('현장사진')) {
          photoFiles.push({ file: f, dir });
        }
      });
    }
  }

  console.log(`  Files: ${designFiles.length} design + ${photoFiles.length} photos`);

  const results = [];
  const usedSlugs = new Map();

  // 시안물 처리
  for (let i = 0; i < designFiles.length; i++) {
    const { file, dir } = designFiles[i];
    const inputPath = path.join(dir, file);
    const label = extractLabel(file);
    let fileSlug = slugify(label);

    const count = usedSlugs.get(fileSlug) || 0;
    usedSlugs.set(fileSlug, count + 1);
    if (count > 0) fileSlug = `${fileSlug}-${count + 1}`;

    const storagePath = `${event.slug}/${fileSlug}.webp`;

    try {
      const origSize = fs.statSync(inputPath).size;
      const buffer = await optimizeImage(inputPath);
      const url = await uploadToStorage(storagePath, buffer);
      const ratio = ((1 - buffer.length / origSize) * 100).toFixed(0);
      console.log(`  OK [${i+1}/${designFiles.length}] ${label} (${(origSize/1024/1024).toFixed(1)}MB -> ${(buffer.length/1024).toFixed(0)}KB, -${ratio}%)`);

      results.push({
        portfolio_id: event.portfolioId,
        event_slug: event.slug,
        type: 'gallery',
        label,
        url,
        sort_order: i + 1
      });
    } catch (err) {
      console.log(`  FAIL [${i+1}/${designFiles.length}] ${file}: ${err.message}`);
    }
  }

  // 현장사진 처리
  for (let i = 0; i < photoFiles.length; i++) {
    const { file, dir } = photoFiles[i];
    const inputPath = path.join(dir, file);
    const label = `현장사진 ${i + 1}`;
    const storagePath = `${event.slug}/photo-${String(i + 1).padStart(2, '0')}.webp`;

    try {
      const origSize = fs.statSync(inputPath).size;
      const buffer = await optimizeImage(inputPath);
      const url = await uploadToStorage(storagePath, buffer);
      const ratio = ((1 - buffer.length / origSize) * 100).toFixed(0);
      console.log(`  OK [${i+1}/${photoFiles.length}] ${label} (${(origSize/1024/1024).toFixed(1)}MB -> ${(buffer.length/1024).toFixed(0)}KB, -${ratio}%)`);

      results.push({
        portfolio_id: event.portfolioId,
        event_slug: event.slug,
        type: 'photo',
        label,
        url,
        sort_order: designFiles.length + i + 1
      });
    } catch (err) {
      console.log(`  FAIL [${i+1}/${photoFiles.length}] ${file}: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('=== Portfolio Media Migration ===');
  console.log(`Source: ${BASE_DIR}`);

  const events = targetSlug
    ? EVENT_MAP.filter(e => e.slug === targetSlug)
    : EVENT_MAP;

  console.log(`Processing ${events.length} events`);

  const allResults = {};
  let totalFiles = 0;

  for (const event of events) {
    if (event.portfolioId === '__NEW__') {
      console.log(`\n>> ${event.folder} - NEW event, will process after DB creation`);
      // 일단 Storage 업로드만 진행, portfolioId는 나중에 채움
    }

    const results = await processEvent(event);
    if (results && results.length > 0) {
      allResults[event.slug] = results;
      totalFiles += results.length;
    }
  }

  // 결과 JSON 저장
  const outputPath = path.resolve('scripts/migration-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`DONE: ${totalFiles} files processed`);
  console.log(`Results saved to: ${outputPath}`);
  console.log(`Next: Use MCP to update DB`);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
