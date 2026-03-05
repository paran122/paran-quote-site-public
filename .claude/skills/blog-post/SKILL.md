---
name: blog-post
description: MD 파일로 블로그 글을 생성하는 스킬. YAML 프론트매터 + 마크다운 본문을 파싱하여 blog_posts 테이블에 INSERT한다.
---

# 블로그 MD 업로드 스킬

## 트리거

이 스킬은 **"블로그"** 키워드가 포함된 경우에 트리거된다.

| 사용자 표현 | 동작 |
|------------|------|
| "블로그 글 올려줘" + MD 파일 경로 | MD 파싱 → 블로그 생성 |
| "블로그 등록해줘" | MD 파싱 → 블로그 생성 |
| "블로그 포스트 추가해줘" | MD 파싱 → 블로그 생성 |
| "블로그 글 작성해줘" | MD 파싱 → 블로그 생성 |

키워드 없이 범용 표현만 사용한 경우 → "블로그 글 등록 작업인가요?" 확인 질문

## 처리 절차

### 1단계: MD 파일 읽기

Read 도구로 사용자가 지정한 MD 파일을 읽는다.
파일이 지정되지 않은 경우 AskUserQuestion으로 경로를 요청한다.

### 2단계: YAML 프론트매터 파싱

`---` 사이의 YAML을 파싱하여 필드를 추출한다.

**필수 필드:**
- `title` (필수)

**선택 필드:**
- `category` — 행사 기획 | 행사 후기 | 트렌드 | 체크리스트 | 장비/기술
- `tags` — 문자열 배열
- `thumbnail` — 로컬 파일 경로 또는 URL
- `excerpt` — 요약문 (SNS 공유용)
- `is_published` — 기본 true

### 3단계: slug 생성

title에서 slug를 자동 생성한다:
1. 앞뒤 공백 제거
2. 공백 → 하이픈(`-`) 치환
3. 한글, 영문, 숫자, 하이픈만 유지 (특수문자 제거)
4. 연속 하이픈 → 단일 하이픈
5. 앞뒤 하이픈 제거

예: "성공적인 행사 기획을 위한 체크리스트 10가지" → "성공적인-행사-기획을-위한-체크리스트-10가지"

### 4단계: 이미지 처리

본문의 마크다운 이미지 `![설명](경로)`에서 로컬 파일을 찾아 업로드한다.

**로컬 이미지 (`.` 또는 상대경로로 시작):**
1. MD 파일 기준 상대 경로에서 파일을 찾는다
2. `/api/admin/blog/upload` 엔드포인트로 업로드 (Sharp WebP 최적화 자동 적용)
3. 반환된 URL로 본문의 이미지 경로를 치환한다

**외부 URL:**
- `http://` 또는 `https://`로 시작하면 그대로 유지

**이미지 업로드 방법 (Bash 사용):**
```bash
curl -s -X POST http://localhost:4000/api/admin/blog/upload \
  -F "file=@/path/to/image.jpg" \
  | jq -r '.url'
```

### 5단계: 썸네일 처리

- `thumbnail`이 로컬 파일 경로면 → 4단계와 동일하게 업로드 후 URL 획득
- `thumbnail`이 URL이면 → 그대로 사용
- `thumbnail`이 없으면 → null

### 6단계: 마크다운 → HTML 변환

이미지 URL 치환이 완료된 본문을 HTML로 변환한다.

```bash
npx marked --input /path/to/temp-content.md
```

또는 Node.js 인라인:
```bash
node -e "
const { marked } = require('marked');
const fs = require('fs');
const md = fs.readFileSync('/path/to/temp-content.md', 'utf8');
console.log(marked.parse(md));
"
```

### 7단계: 데이터 조립

아래 형식으로 blog_posts 테이블 INSERT 데이터를 조립한다:

```json
{
  "title": "프론트매터의 title",
  "slug": "자동 생성된 slug",
  "content": "HTML 변환된 본문",
  "excerpt": "프론트매터의 excerpt 또는 null",
  "thumbnail_url": "업로드된 썸네일 URL 또는 null",
  "category": "프론트매터의 category 또는 null",
  "tags": ["프론트매터의", "tags", "배열"],
  "seo_title": "프론트매터의 title",
  "seo_description": "프론트매터의 excerpt 또는 null",
  "og_image_url": "썸네일 URL 또는 null",
  "is_published": true,
  "is_featured": false,
  "sort_order": 0,
  "published_at": "2026-03-05T00:00:00.000Z (is_published가 true일 때)"
}
```

### 8단계: slug 중복 체크 및 INSERT

1. **Supabase MCP로 slug 중복 체크:**
   ```sql
   SELECT id, title FROM quote_site.blog_posts WHERE slug = '{slug}' LIMIT 1;
   ```

2. **중복 시:** AskUserQuestion으로 "이미 같은 슬러그의 글이 있습니다. 덮어쓸까요?" 확인
   - 덮어쓰기 선택 → UPDATE
   - 취소 → 스킬 종료

3. **중복 없으면:** `/api/admin/blog` POST 엔드포인트로 INSERT
   ```bash
   curl -s -X POST http://localhost:4000/api/admin/blog \
     -H "Content-Type: application/json" \
     -d '{ ... 조립된 데이터 ... }'
   ```

### 9단계: 결과 보고

성공 시 아래 형식으로 보고:

```
블로그 글이 등록되었습니다!

- 제목: {title}
- 슬러그: {slug}
- 카테고리: {category}
- 태그: {tags}
- 발행 상태: {is_published ? "발행됨" : "임시저장"}
- 이미지: {업로드된 이미지 수}장 업로드
- 미리보기: /blog/{slug}
- 관리: /admin/blog
```

## 공통 규칙

- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
- Storage 버킷: `blog` / 경로: `images/{timestamp}.webp`
- 이미지 업로드: `/api/admin/blog/upload` 엔드포인트 활용 (Sharp WebP 최적화)
- 블로그 API: `/api/admin/blog` (POST로 생성)
- 변경/삭제 전 반드시 사용자 확인

## 이미지 사양

| 항목 | 값 |
|------|-----|
| 최대 가로 | 1200px (withoutEnlargement) |
| 포맷 | WebP |
| 압축 품질 | **quality 90** |
| 최대 업로드 | 5MB |
| 허용 형식 | JPEG, PNG, WebP, GIF |

- 포트폴리오 사진(1080px, quality 80)보다 높은 품질 — 블로그는 사진이 콘텐츠 핵심이므로
- quality 90은 파일당 약 100~200KB, 로딩 체감 없음

## 어드민 UI

- 블로그 작성/수정: `/admin/blog/new`, `/admin/blog/[id]/edit`
- 상단 버튼: **"저장"** 1개 (임시저장/발행 버튼 분리 없음)
- 발행 여부는 하단 **"발행" 체크박스**로 제어
  - 체크 O + 저장 = 공개 발행
  - 체크 X + 저장 = 비공개 초안
- 발행일시: 발행 체크 시 날짜/시간 입력 가능 (예약발행), 비워두면 즉시 발행

## 리소스

- [MD 템플릿](./md-template.md)
- [예제](./examples/)
