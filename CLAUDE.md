# 파란컴퍼니 견적 사이트

## 기술 스택
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (DB/Storage) + @supabase/ssr
- Zustand (상태관리)
- Lucide React (아이콘)
- Framer Motion (애니메이션)
- Zod (검증)

## 개발 환경
- 서버는 절대 시작하지 마. 다른 터미널에서 포트 4000으로 이미 실행 중이다.

## 라우트 구조
- `/` 랜딩 페이지
- `/work` 포트폴리오 목록 (디자인별/행사별 뷰 지원, URL 파라미터 deep-link 가능: `?view=design&design=배너·현수막` 등)
- `/work/[slug]` 포트폴리오 상세
- `/company` 회사소개
- `/services` 서비스 허브
- `/services/government` 공공기관 행사 대행
- `/services/corporate` 기업행사 대행
- `/services/conference` 컨퍼런스·포럼 대행
- `/services/seminar` 세미나·워크숍 대행
- `/services/design` 행사 디자인 서비스
- `/guide` 행사 가이드 허브
- `/guide/checklist` 행사 체크리스트
- `/guide/pricing` 견적/비용 안내
- `/guide/process` 진행 절차
- `/guide/scale` 행사 규모
- `/guide/venue` 장소 안내
- `/blog` 블로그
- `/blog/[slug]` 블로그 상세 (글 슬러그/카테고리 기반 자동 매칭 CTA 배너 포함)
- `/blog/all` 블로그 전체글
- `/authors/kim-mikyung` 저자 페이지 (대표 김미경)
- `/faq` FAQ
- `/privacy` 개인정보처리방침
- `/terms` 이용약관
- `/admin` 관리자 (login, blog, portfolio, photos, components, quotes)

## 데이터 흐름
- 페이지별로 서버 컴포넌트에서 Supabase 직접 조회 → 실패 시 `lib/portfolioData.ts` 등 상수 폴백 사용
- 클라이언트 스토어 (Zustand): `catalogStore` (랜딩 포트폴리오 섹션·SiteDataLoader), `themeStore`

## 보안 (Public 레포 주의)
- origin은 Public 레포이므로 커밋/푸시 전 민감 파일 반드시 확인
- 절대 커밋 금지: `.env.local`, API 키, 시크릿, 비밀번호, credentials, 토큰
- `.git-private-backup/`, 스크린샷(*.jpeg), 목업(*.html)은 커밋하지 않음
- **매 커밋/푸시 전 반드시 `git diff --staged`로 민감 정보(API 키, 시크릿, 토큰, 비밀번호) 포함 여부 확인할 것**
- 민감 정보가 발견되면 커밋 중단하고 사용자에게 알릴 것

## 작업 전 확인 원칙
- **모든 작업을 시작하기 전에, 해당 기능이 이미 구현되어 있는지 반드시 코드/DB를 먼저 확인할 것**
- 이미 있는 기능을 다시 만들지 않기 위함 (예: 예약 발행 로직이 이미 queries.ts에 있었음)
- 새 테이블 생성 전 → 기존 테이블/컬럼 확인
- 새 코드 작성 전 → 기존 코드에 동일 로직 있는지 확인
- 새 스킬 작성 전 → 기존 스킬에서 커버 가능한지 확인
- 확인 없이 바로 작업에 착수하지 말 것

## 규칙
- TypeScript 필수, any 사용 금지
- Tailwind CSS로만 스타일링 (인라인 style 금지)
- 한글 UI, 가격은 원화 (toLocaleString('ko-KR'))
- Supabase 클라이언트는 lib/supabase.ts에서 관리
- 아이콘은 Lucide React만 사용
- 애니메이션은 Framer Motion 사용
- 컴포넌트는 components/ 하위에 분류 (cards, common, forms, landing, layout, ui)
- max-width: 1200px

## UI 방향
- 모던하고 깔끔한 스타일
- 이모지 사용 금지, 실제 행사 이미지 사용

## 테스트
- Playwright MCP로 E2E 테스트 수행
- 커스텀 커맨드: /e2e (테스트 대상 URL: http://localhost:4000)

## 직원용 가이드
행사 포트폴리오 관리, 블로그 MD 업로드 트리거 안내는 `직원-가이드.md` 참조.

## 스킬 시스템 (개발자용)
- Supabase MCP 프로젝트: `aiarnrhftmuffmcninyl` / 스키마: `paran_quote_site`
- 행사: portfolios, portfolio_media, event_reviews / Storage 버킷: `portfolio`
- 블로그: blog_posts / Storage 버킷: `blog` / 이미지: `/api/admin/blog/upload`
- 이미지 편집/보정: Replicate MCP (우선), 나노바나나 Pro MCP (폴백)
- 마크다운 변환: `marked` (devDependency)

## SEO 주의: 네이버 블로그와 내용 차별화
- 같은 행사라도 네이버 블로그와 자사 사이트 블로그 내용은 **반드시 다르게** 작성
- 동일 내용 복사 시 구글이 중복 콘텐츠로 판단 → 두 사이트 모두 검색 순위 하락
- 네이버: 현장 후기/사진 중심 (가벼운 톤) / 자사 사이트: 기획 프로세스/노하우 중심 (전문적 톤)
- 제목과 본문 텍스트가 **70% 이상 달라야** 중복 판정 회피

## SEO 핵심 키워드
- `.claude/seo-keywords.md` 참조 — 블로그 제목, 메타태그, 페이지 설명문 등에 활용
- 내용과 관련된 키워드만 사용, 억지로 넣지 말 것
- **메인 키워드**: "행사 대행" (2026-04-27부터 강화). 글로벌 메타(`layout.tsx`), 홈(`page.tsx`), 조직 description(`JsonLd.tsx`)에 포함됨
- 메인 키워드 변경 시 `sitemap.ts`의 lastModified 날짜도 함께 업데이트해야 Google이 재크롤

## 블로그 카테고리 (SEO 가이드)
- **행사 기획** — 포트폴리오 행사 기반 기획·노하우·방법론 사례 (랜딩 BlogSection 좌·우 카드 스택 노출)
- **행사 후기** — 포트폴리오 행사 현장 스케치·운영 후기 사례 (랜딩 BlogSection 좌·우 카드 스택 노출)
- **기획 가이드** — 행사 기획 방법론, 대행사 선정, 기획서/견적서 작성법 (가이드 섹션)
- **현장 노하우** — 큐시트, 체크리스트, MC 섭외, 만족도 조사, 제작물 가이드 (가이드 섹션)
- **행사 정보** — 행사 유형 비교, 행사장 추천, 장비/비용 정보 (가이드 섹션)
- **행사 유형 가이드** — 송년회, 시상식, 창립기념, 준공식, 워크숍 등 행사 종류별 A to Z (가이드 섹션)

**카테고리 운용 원칙**:
- "행사 기획"/"행사 후기"는 **실제 포트폴리오 행사와 1:1 매칭되는 사례성 글** 전용. 랜딩페이지 BlogSection(`src/components/landing-v2/BlogSection.tsx`)과 `/blog` 페이지 히어로 영역이 이 두 카테고리에 의존하므로 비워두지 말 것
- 4개 가이드 카테고리는 **방법론·체크리스트·비교·유형별 가이드 등 정보성 글** 전용 (특정 행사와 1:1 매칭되지 않는 일반 콘텐츠)
- `/blog` 페이지의 `BlogListClient.tsx`는 가이드 4개 카테고리를 "EVENT GUIDE" 섹션으로, "행사 기획"/"행사 후기"를 히어로/서브카드/에디터픽 영역으로 분리 노출함

## 블로그 AEO (Answer Engine Optimization)
- 블로그 상세 페이지에 **FAQ JSON-LD** 자동 생성 구현됨 (`blog/[slug]/page.tsx`)
- 본문에 `<strong>Q. 질문</strong>` + `A. 답변` 패턴이 있으면 FAQPage 스키마 자동 추출
- 새 글 작성 시 FAQ 2~3개를 반드시 이 패턴으로 포함할 것

## JSON-LD 구조화 데이터 정책 (중요)
- **글로벌**: `src/app/JsonLd.tsx` 에는 사이트 전역 1회 출력해야 하는 것만 — Organization, LocalBusiness, WebSite
- **페이지별**: FAQPage, BreadcrumbList, Service, BlogPosting 등은 **각 page.tsx에서 자체 출력**
- 글로벌에 페이지별 스키마(FAQPage 등)를 두면 모든 페이지에서 중복 → GSC "FAQPage 입력란이 중복" 경고 발생
- 새 페이지 만들 때 BreadcrumbList 직접 추가 권장
- 검증: Google Rich Results Test (https://search.google.com/test/rich-results) 로 각 스키마 1개씩만 노출되는지 확인

## 블로그 CTA Deep-link 매칭 (`blog/[slug]/page.tsx`)
- 글 하단 "관련 페이지로 이동" 배너는 자동 매칭됨
- **글이 특정 포트폴리오 사례를 다룰 때**: `BLOG_TO_PORTFOLIO` 객체에 슬러그→포트폴리오 매핑 추가 → 해당 포트폴리오 상세로 deep-link
- **디자인 카테고리 글일 때** (현수막/포스터/리플렛 등): 키워드 매칭으로 `/work?view=design&design={카테고리}` 자동 생성
- **행사 유형 글일 때** (포럼/세미나): `/work?view=event&category={카테고리}` 자동 생성
- 새 블로그 글 추가 후 정확한 포트폴리오 매칭이 필요하면 BLOG_TO_PORTFOLIO 업데이트할 것

## 사이트맵 동기화 (`src/app/sitemap.ts`)
- 정적 페이지 lastModified는 하드코딩된 날짜 사용: `GUIDE_UPDATED`, `SERVICES_UPDATED`, `COMPANY_UPDATED`, `POLICY_UPDATED`
- **메타데이터/내부 링크/JSON-LD를 수정하면 해당 카테고리 날짜를 함께 업데이트할 것** (Google 재크롤 트리거)
- 블로그/포트폴리오는 DB의 updated_at 자동 사용 → 별도 작업 불필요

## 블로그 발행 스케줄
- **주기**: 매주 월요일 / 수요일 / 금요일 (주 3회)
- **카테고리 분산**: 같은 주에 같은 카테고리 연속 금지
- **제목 다양성**: "행사 OOO" 같은 동일 패턴 반복 금지 (상세: blog-seo title-guide.md)

## Git 워크플로우

### 브랜치 구조
- `dev` — 작업용 브랜치 (항상 여기서 코드 수정)
- `main` — 배포용 브랜치 (Netlify 자동 배포, 직접 push 금지)

### 개발 흐름
1. VS Code 왼쪽 하단이 `dev`인지 확인
2. 코드 수정 → 커밋
3. `git push origin dev`
4. GitHub에서 PR 생성 (dev → main)
5. PR에서 변경 내용 확인 후 Merge
6. Netlify가 main 기준으로 자동 배포

### 규칙
- 커밋 메시지 형식: "번호. 변경 내용 설명" (예: "3. 글로벌 스타일 변경")
- main에 직접 push 금지 (Ruleset으로 차단됨)
- push는 origin(public)에만: `git push origin dev`

### 팀원 초기 설정
```bash
git clone https://github.com/paran122/paran-quote-site-public.git
cd paran-quote-site-public
git checkout dev
npm install
```

### 레포 구성
| 레포 | 상태 | 용도 |
|------|------|------|
| paran-quote-site-public | Public | 메인 개발 + Netlify 배포 |
| paran-qoute-site-t- | Private | 백업 |
| paran-quote-site | Private | 아카이브 (이전 히스토리) |
