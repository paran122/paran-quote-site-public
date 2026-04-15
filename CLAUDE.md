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
- `/work` 포트폴리오 목록
- `/work/[slug]` 포트폴리오 상세
- `/company` 회사소개
- `/guide` 행사 가이드
- `/guide/checklist` 행사 체크리스트
- `/guide/pricing` 견적/비용 안내
- `/guide/process` 진행 절차
- `/guide/scale` 행사 규모
- `/guide/venue` 장소 안내
- `/blog` 블로그
- `/blog/[slug]` 블로그 상세
- `/blog/all` 블로그 전체글
- `/faq` FAQ
- `/privacy` 개인정보처리방침
- `/admin` 관리자 (login, blog, portfolio, photos, components)

## 데이터 흐름
- catalogStore가 Supabase에서 데이터를 먼저 조회하고, 실패 시 constants.ts 폴백 데이터를 사용
- 스토어: cartStore, catalogStore, siteDataStore, themeStore

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
