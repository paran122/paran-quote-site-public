---
name: event-add
description: 새 행사 포트폴리오를 MD 파일로 등록하는 스킬
triggers:
  - 행사 등록해줘
  - 행사 올려줘
  - 포트폴리오 추가해줘
  - 행사 자료 올려줘
  - 행사 DB에 넣어줘
---

# 새 행사 등록

## 트리거
**"행사" 또는 "포트폴리오"** 키워드가 포함된 경우에만 트리거:
- "행사 등록해줘"
- "행사 올려줘"
- "포트폴리오 추가해줘"
- "행사 자료 올려줘"
- "행사 DB에 넣어줘"

> 키워드 없이 "이 파일 등록해줘", "이거 DB에 넣어줘" 등 범용 표현만 사용한 경우 → 라우터(event-portfolio-update)에서 문맥 확인 후 라우팅

## 개요
행사 완료 후 MD 파일을 작성하여 Supabase DB에 새 포트폴리오를 등록한다.

## 절차

### Step 1: MD 파일 읽기
사용자가 제시한 MD 파일을 Read 도구로 읽는다.

### Step 2: 프론트매터 파싱
YAML 프론트매터에서 다음 필드를 추출:
- `title` (필수) → portfolios.title
- `event_type` (필수) → portfolios.event_type
- `year` (필수) → portfolios.year
- `venue` (필수) → portfolios.venue
- `client` → portfolios.client
- `event_date` → portfolios.event_date (YYYY-MM-DD)
- `thumbnail` → portfolios.image_url
- `gradient_type` (필수) → portfolios.gradient_type
- `tags` (배열) → portfolios.tags
- `is_visible` → 기본 true
- `sort_order` → 기본 0

### Step 3: 본문 파싱
- `## 설명` → portfolios.description
- `## 갤러리`의 `![캡션](URL)` → portfolio_media 레코드 (type='gallery')
- `## 고객 후기`의 `### 이름 | 직책 | 소속` → event_reviews 레코드

### Step 4: 중복 확인
```sql
SELECT id FROM quote_site.portfolios WHERE title = '{title}';
```
이미 있으면 사용자에게 "이미 등록된 행사입니다. 덮어쓸까요?" 확인.

### Step 5: DB INSERT
```sql
INSERT INTO quote_site.portfolios (
  title, event_type, year, venue, emoji, description,
  image_url, tags, gradient_type, is_visible, client, event_date, sort_order
) VALUES (...) RETURNING id;
```

### Step 5.5: 갤러리 이미지 품질 검사
갤러리 섹션에 이미지가 있을 경우, Replicate MCP를 우선 사용하여 이미지 품질을 검사한다. Replicate MCP 사용 불가 시 나노바나나 Pro MCP를 폴백으로 사용.

#### 분석 프롬프트
```
이 이미지를 행사 포트폴리오 사진으로 사용하려 합니다. 다음 항목을 검사해주세요:
1. 잘린 이미지 (중요 피사체가 프레임 밖으로 벗어남)
2. 과도한 흐림/노이즈
3. 비정상적인 비율/회전
4. 극단적인 노출 (너무 밝거나 어두움)
5. 행사 사진으로 부적절한 구도

문제가 있으면 무엇이 문제인지 간결히 설명하고, 문제가 없으면 "문제 없음"이라고만 답하세요.
```

#### 분석 결과 처리
- **문제 없음** → Step 6으로 바로 진행
- **문제 발견** → 사용자에게 AskUserQuestion으로 질문:
  - "이 사진에 [{문제 설명}] 문제가 있습니다."
  - 옵션 1: "편집 후 업로드" - Replicate MCP(우선) 또는 나노바나나 MCP로 사진을 보정합니다
  - 옵션 2: "그대로 업로드" - 원본 그대로 등록합니다

#### 편집 선택 시
Replicate MCP를 우선 사용하여 발견된 문제를 수정한다. Replicate MCP 사용 불가 시 나노바나나 Pro MCP(`edit_image`)를 폴백으로 사용.
- 편집 프롬프트: 분석에서 발견된 문제에 맞는 보정 지시 (예: "밝기를 높여주세요", "잘린 부분을 자연스럽게 확장해주세요")
- 나노바나나 사용 시: `list_generated_images`로 편집된 이미지 경로를 확인한다
- 편집 결과를 사용자에게 보여주고 확인받는다
- 만족하면 편집된 이미지 URL로 Step 6 진행
- 불만족하면 `edit_image`로 추가 수정 또는 원본으로 진행

### Step 6: 갤러리 사진 등록 (있을 경우)
```sql
INSERT INTO quote_site.portfolio_media (portfolio_id, event_slug, type, label, url, sort_order)
VALUES ('{id}', '{slug}', 'gallery', '{label}', '{url}', {순서});
```
편집된 이미지가 있으면 편집된 URL로, 없으면 원본 URL로 등록한다.

### Step 7: 고객 후기 등록 (있을 경우)
```sql
INSERT INTO quote_site.event_reviews (
  portfolio_id, reviewer_name, reviewer_role, organization, content, rating
) VALUES (...);
```

### Step 8: 결과 보고
- 등록된 포트폴리오 제목
- 사진 N장, 후기 N개
- `/work` 페이지에서 확인 가능

## 참조
- DB 스키마: `../event-portfolio-update/db-schema.md`
- MD 템플릿: `../event-portfolio-update/md-template.md`
- 샘플: `../event-portfolio-update/examples/`

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
- 테이블: `portfolios`, `portfolio_media` (type: gallery/photo/video), `event_reviews`
- 이미지 분석/편집: **Replicate MCP (우선)**, 나노바나나 Pro MCP (폴백: `edit_image`, `list_generated_images`)
- emoji 필드는 빈 문자열로 저장 (UI 미사용)
