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
- GitHub 리모트:
  - origin: https://github.com/paran122/paran-quote-site-public (Public, Netlify 배포)
  - personal: https://github.com/brix6190/paran-qoute-site-t- (Private, 백업)
  - (아카이브) https://github.com/paran122/paran-quote-site (Private, 이전 히스토리)

## 라우트 구조
- `/` 랜딩 페이지
- `/services` 서비스 목록
- `/services/[id]` 서비스 상세
- `/checkout` 장바구니 + 견적
- `/checkout/complete` 견적 완료
- `/work` 포트폴리오
- `/build` 견적 빌더

## 데이터 흐름
- catalogStore가 Supabase에서 데이터를 먼저 조회하고, 실패 시 constants.ts 폴백 데이터를 사용
- 스토어: cartStore, catalogStore, siteDataStore, themeStore

## 규칙
- TypeScript 필수, any 사용 금지
- Tailwind CSS로만 스타일링 (인라인 style 금지)
- 한글 UI, 가격은 원화 (toLocaleString('ko-KR'))
- Supabase 클라이언트는 lib/supabase.ts에서 관리
- 아이콘은 Lucide React만 사용
- 애니메이션은 Framer Motion 사용
- 컴포넌트는 components/ 하위에 분류 (cards, common, forms, landing, layout, ui)

## 디자인 토큰
- max-width: 1200px

## UI 방향
- 모던하고 깔끔한 스타일
- 이모지 사용 금지, 실제 행사 이미지 사용

## 테스트
- Playwright MCP로 E2E 테스트 수행
- 커스텀 커맨드: /e2e (테스트 대상 URL: http://localhost:4000)

## 행사 포트폴리오 관리 (직원용 가이드)

행사가 끝나면 아래 **트리거**를 Claude Code에 말하면 자동으로 DB가 업데이트됩니다.
DB를 직접 만질 필요 없습니다.

> **"행사" 또는 "포트폴리오"** 키워드를 반드시 포함해야 스킬이 작동합니다.
> 키워드 없이 "사진 추가해줘" 등만 쓰면 "행사 포트폴리오 작업인가요?" 확인을 거칩니다.

---

### 1. 새 행사 등록 (`event-add`)
MD 파일을 먼저 준비합니다. (작성법: `.claude/skills/event-portfolio-update/md-template.md`)

**트리거:**
- `"행사 등록해줘"` + MD 파일 경로
- `"행사 올려줘"`
- `"포트폴리오 추가해줘"`
- `"행사 DB에 넣어줘"`
- `"행사 자료 올려줘"`

---

### 2. 사진/영상 추가 (`event-photo-add`)
기존 행사에 새 사진/영상을 추가합니다.

**트리거:**
- `"행사 사진 추가해줘"` + 사진 파일/URL
- `"행사 영상 추가해줘"` + 영상 파일
- `"포트폴리오 사진 추가해줘"`
- `"포트폴리오 영상 올려줘"`

**자동 처리:** 사진/영상 섞어서 올려도 자동 분류
- 사진: 품질 분석 → 휴대폰 자동 보정 → WebP 최적화 → 업로드
- 영상: 720p H.264 최적화(화질 동일) → 썸네일 자동 생성 → 업로드

---

### 3. 사진/영상 편집 (`event-photo-edit`)
이미 등록된 사진을 AI로 편집하거나 영상을 최적화합니다.

**트리거 (편집):**
- `"행사 사진 편집해줘"`
- `"행사 사진 수정해줘"`
- `"포트폴리오 사진 편집해줘"`
- `"행사 영상 편집해줘"`
- `"포트폴리오 영상 최적화해줘"`

**트리거 (자동 보정):**
- `"행사 사진 보정해줘"`
- `"포트폴리오 사진 보정해줘"`
- `"사진 퀄리티 올려줘"`

**자동 처리:**
- 사진: AI 편집 + WebP 최적화 후 재업로드
- 영상: 720p H.264 최적화 + 썸네일 자동 생성 후 재업로드
- 자동 보정: 휴대폰 사진만 감지 (DSLR은 건드리지 않음), 7항목 보정 (화밸/노이즈/샤프닝/밝기/모션블러/그림자복원/텍스트선명도), 톤 일괄 통일

---

### 4. 사진 삭제 (`event-photo-remove`)

**트리거:**
- `"행사 사진 빼줘"`
- `"행사 사진 삭제해줘"`
- `"포트폴리오 사진 삭제해줘"`

---

### 5. 후기 추가 (`event-review-add`)

**트리거:**
- `"행사 후기 넣어줘"` + 이름, 소속, 내용, 평점
- `"행사 후기 추가해줘"`
- `"포트폴리오 후기 추가해줘"`

예: "해군 세미나 행사 후기 넣어줘: 김정훈 소령, 해군본부, '매우 만족합니다', 5점"

---

### 6. 후기 수정 (`event-review-edit`)

**트리거:**
- `"행사 후기 수정해줘"`
- `"포트폴리오 후기 수정해줘"`

---

### 7. 행사 정보 수정 (`event-edit`)
제목, 장소, 설명 등 기본 정보를 수정합니다.

**트리거:**
- `"행사 수정해줘"`
- `"행사 내용 바꿔줘"`
- `"포트폴리오 수정해줘"`

---

### 알아두면 좋은 것
- 삭제할 때는 항상 "진짜 삭제할까요?" 확인을 거칩니다
- 같은 제목의 행사가 이미 있으면 덮어쓸지 물어봅니다
- 등록/수정 결과는 `/work` 페이지에서 바로 확인할 수 있습니다
- MD 파일 샘플: `.claude/skills/event-portfolio-update/examples/`

### 스킬 시스템 (개발자용)
Supabase MCP 프로젝트: `aiarnrhftmuffmcninyl` / 스키마: `quote_site`
관련 테이블: portfolios, portfolio_media, event_reviews
Storage 버킷: `portfolio`
이미지 편집/보정: Replicate MCP (우선), 나노바나나 Pro MCP (폴백)
라우터: `event-portfolio-update` (공유 리소스: db-schema, md-template, examples)

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
