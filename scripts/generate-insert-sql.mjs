/**
 * migration-results.json + retry results → SQL INSERT 생성
 */
import fs from 'fs';
import path from 'path';

const mainResults = JSON.parse(fs.readFileSync(path.resolve('scripts/migration-results.json'), 'utf8'));
const retryResults = JSON.parse(fs.readFileSync(path.resolve('scripts/migration-retry-results.json'), 'utf8'));

// 경기도교육청 인쇄 디자인 portfolioId 매핑
const GYEONGGI_ID = 'de0bb921-6d89-4af9-8733-1aa4a7ae9212';

// portfolioId 매핑 (slug → id)
const PORTFOLIO_MAP = {
  'kls': 'c68874aa-5f8f-4816-97d2-6d29f8c58a5b',
  'gyeonggi-print': GYEONGGI_ID,
  'goyang-conference': 'c9f1fc3d-962c-4c1a-82e6-0f50f5ff5f1b',
  'education-council-booth': '96210ebf-fbdc-45aa-9093-f4e1acadcc0b',
  'international-forum': '16cf9a98-ad11-495f-a4f1-83b130ea7920',
  'culture-club-showcase': 'c42d3b1a-8026-4ae0-96b8-0e1f219fb9a1',
  'culture-club-operation': '1ec0e78e-2c25-4d89-96d8-1d78b722a78a',
  'community-energy': '1007f849-06b3-49d8-89cf-49bd3137cfdd',
  'parent-education': '22d26d86-8517-4d8d-a115-fbef6acdbed6',
  'artist-rights': '754a63d8-d150-4533-866f-e4b183544922',
  'auto-seminar-fall': 'd69c6df4-ef38-4403-9a1e-d93f5f3c86ff',
  'auto-seminar-spring': '696835c3-69fd-4490-b66e-c8ca73884ee1',
  'navy-camp': '21f7f57e-b633-4ac6-9167-96bcad8552d8',
  'auto-seminar-summer': '79e5ff35-045a-4894-a672-121ed8e7ef9b',
  'jcs-sns': '549cd164-31e8-45ac-9e36-40f45143d047',
};

// 모든 레코드 수집
const allRecords = [];

// 메인 결과
for (const [slug, records] of Object.entries(mainResults)) {
  for (const rec of records) {
    allRecords.push({
      portfolio_id: PORTFOLIO_MAP[slug] || rec.portfolio_id,
      event_slug: slug,
      type: rec.type,
      label: rec.label,
      url: rec.url,
      sort_order: rec.sort_order
    });
  }
}

// 리트라이 결과 (sort_order는 각 event의 마지막 + 1)
const maxSortBySlug = {};
for (const rec of allRecords) {
  maxSortBySlug[rec.event_slug] = Math.max(maxSortBySlug[rec.event_slug] || 0, rec.sort_order);
}

for (const rec of retryResults) {
  const nextSort = (maxSortBySlug[rec.event_slug] || 0) + 1;
  maxSortBySlug[rec.event_slug] = nextSort;
  allRecords.push({
    portfolio_id: PORTFOLIO_MAP[rec.event_slug],
    event_slug: rec.event_slug,
    type: rec.type,
    label: rec.label,
    url: rec.url,
    sort_order: nextSort
  });
}

// slug별로 그룹화하여 SQL 파일 생성
const slugGroups = {};
for (const rec of allRecords) {
  if (!slugGroups[rec.event_slug]) slugGroups[rec.event_slug] = [];
  slugGroups[rec.event_slug].push(rec);
}

// 각 slug별로 별도 SQL 파일 생성
for (const [slug, records] of Object.entries(slugGroups)) {
  const values = records.map(r => {
    const label = r.label.replace(/'/g, "''");
    const url = r.url.replace(/'/g, "''");
    return `  ('${r.portfolio_id}', '${r.event_slug}', '${r.type}', '${label}', '${url}', ${r.sort_order})`;
  }).join(',\n');

  const sql = `INSERT INTO quote_site.portfolio_media (portfolio_id, event_slug, type, label, url, sort_order) VALUES\n${values};`;

  fs.writeFileSync(path.resolve(`scripts/sql-${slug}.sql`), sql);
  console.log(`${slug}: ${records.length} records`);
}

console.log(`\nTotal: ${allRecords.length} records across ${Object.keys(slugGroups).length} events`);
