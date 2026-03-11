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

**SEO 필드 (선택 — 없으면 자동 생성):**
- `seo_title` — 검색 결과에 표시될 제목 (최대 60자)
- `seo_description` — 메타 디스크립션 (최대 155자)
- `focus_keyword` — 이 글이 타겟하는 핵심 검색어
- `slug` — URL 슬러그 직접 지정

### 3단계: SEO 자동 생성

프론트매터에 SEO 필드가 없으면 본문을 분석하여 자동 생성한다.

**focus_keyword 추출 (프론트매터에 없을 때):**
1. 본문에서 2~4어절 명사구 빈도 분석
2. title, tags, category와 겹치는 키워드 우선
3. 행사 관련 업종 특성 반영 (예: "기업행사", "세미나 기획", "행사 장비")
4. 최종 1개 핵심 키워드 선정

**seo_title 생성 (프론트매터에 없을 때):**
1. focus_keyword를 앞부분에 배치
2. title의 핵심 정보를 결합
3. 60자 이내, 끝에 " | 파란컴퍼니" 접미사
4. 예: "기업행사 체크리스트 10가지 | 파란컴퍼니"

**seo_description 생성 (프론트매터에 없을 때):**
1. focus_keyword를 자연스럽게 포함
2. 본문 핵심 내용 요약 (무엇을 다루는 글인지)
3. 행동 유도 문구 포함 ("~을 확인하세요", "~을 정리했습니다")
4. 155자 이내

**slug 생성:**
- 프론트매터에 `slug`가 있으면 → 그대로 사용
- 없고 `focus_keyword`가 있으면 → keyword 기반 slug (짧고 SEO 친화적)
- 둘 다 없으면 → title에서 자동 생성

slug 변환 규칙:
1. 앞뒤 공백 제거
2. 공백 → 하이픈(`-`) 치환
3. 한글, 영문, 숫자, 하이픈만 유지 (특수문자 제거)
4. 연속 하이픈 → 단일 하이픈
5. 앞뒤 하이픈 제거

예: focus_keyword "기업행사 체크리스트" → slug "기업행사-체크리스트"

### 4단계: 이미지 처리

본문의 마크다운 이미지 `![설명](경로)`에서 로컬 파일을 찾아 업로드한다.

**로컬 이미지 (`.` 또는 상대경로로 시작):**
1. MD 파일 기준 상대 경로에서 파일을 찾는다
2. `/api/admin/blog/upload` 엔드포인트로 업로드 (Sharp WebP 최적화 자동 적용)
3. 반환된 URL로 본문의 이미지 경로를 치환한다

**외부 URL:**
- `http://` 또는 `https://`로 시작하면 그대로 유지

**marketing DB에서 가져오기 (MD에 이미지가 없을 때):**
블로그 글이 특정 행사에 대한 내용인데 MD 파일에 이미지가 없으면, `marketing.event_photos`에서 홈페이지용 사진을 가져온다.

1. 행사 이름으로 event_id 조회:
   ```sql
   SELECT id, name, event_date FROM marketing.events
   WHERE name ILIKE '%{행사키워드}%' LIMIT 5;
   ```
2. 해당 행사의 홈페이지용 사진 조회:
   ```sql
   SELECT photo_url, caption, category FROM marketing.event_photos
   WHERE event_id = '{event_id}' AND use_homepage = true
   ORDER BY sort_order;
   ```
3. 조회된 이미지 URL을 본문에 적절히 배치 (이미 업로드된 URL이므로 재업로드 불필요)
4. 썸네일이 없으면 첫 번째 이미지를 썸네일로 사용
5. 사용자에게 어떤 사진을 사용할지 확인 (전체 or 선택)

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
  "slug": "3단계에서 생성된 slug (keyword 기반 또는 title 기반)",
  "content": "HTML 변환된 본문",
  "excerpt": "프론트매터의 excerpt 또는 null",
  "thumbnail_url": "업로드된 썸네일 URL 또는 null",
  "category": "프론트매터의 category 또는 null",
  "tags": ["프론트매터의", "tags", "배열"],
  "seo_title": "3단계에서 생성/지정된 seo_title (keyword + title 조합, 60자 이내)",
  "seo_description": "3단계에서 생성/지정된 seo_description (keyword 포함, 155자 이내)",
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

SEO 정보:
- 타겟 키워드: {focus_keyword}
- 검색 제목: {seo_title}
- 메타 설명: {seo_description}

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

## 히어로 캐러셀 초상권 검열

블로그 상세 페이지 상단에 큰 히어로 캐러셀이 표시된다.
본문 내 이미지는 작아서 초상권 문제가 적지만, **히어로 캐러셀은 사진이 크게 표시**되므로 별도 검열이 필요하다.

### data-no-hero 속성

이미지에 `data-no-hero` 속성을 추가하면 히어로 캐러셀에서 제외된다.
본문 내 표시와 라이트박스는 정상 작동한다.

```html
<img src="..." alt="..." data-no-hero />
```

### 히어로 캐러셀에서 제외해야 하는 이미지

1. **얼굴이 선명하게 식별 가능한 사진** — 초상권 문제
   - 가까이서 찍힌 인물 (상반신, 얼굴 클로즈업)
   - 발표자/패널 얼굴이 뚜렷한 사진
   - 참석자 표정이 명확한 사진
2. **디자인 시안물** — 히어로에 부적합
   - 포스터, 리플렛, 브로셔, 현수막 디자인
   - 포토존, 부스 시안물

### 히어로 캐러셀에 포함해도 되는 사진

- 전체 행사장 전경 (인물이 작게 보이는 경우)
- 뒷모습, 실루엣 사진
- 장비/세팅 사진
- 무대/연단 원경

### 처리 절차

블로그 글 등록 시 현장 사진이 포함되면:

1. **각 이미지를 확인**하여 얼굴 식별 가능 여부 판단
2. 초상권 위험 사진과 시안물에 `data-no-hero` 속성 추가
3. 사용자에게 제외 대상 목록을 보고하고 확인 받기
4. 확인 후 HTML에 반영

## 본문 분량 가이드라인 (SEO)

| 항목 | 기준 |
|------|------|
| 최소 글자수 | **1,500자** (HTML 태그 제외, 순수 텍스트) |
| 권장 글자수 | **2,500자 이상** |
| h2 섹션당 | 최소 2~3문장 (100자+) |

- 1,500자 미만이면 구글이 "얕은 콘텐츠(thin content)"로 판단하여 검색 순위가 낮아짐
- h2 섹션에 사진만 있고 텍스트가 1문장 이하이면 경고
- 블로그 글 등록 완료 후 글자수를 보고하고, 1,500자 미만이면 보강을 권고할 것

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
