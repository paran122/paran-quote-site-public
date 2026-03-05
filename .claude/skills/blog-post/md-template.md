# 블로그 MD 템플릿

아래 형식으로 MD 파일을 작성하면 스킬이 파싱하여 블로그 글을 생성합니다.

---

```markdown
---
title: "블로그 제목"
category: "행사 기획"       # 행사 기획 | 행사 후기 | 트렌드 | 체크리스트 | 장비/기술
tags:
  - 세미나
  - 체크리스트
thumbnail: "./thumbnail.jpg"  # 로컬 파일 경로 또는 URL (선택)
excerpt: "블로그 목록과 SNS 공유에 표시될 요약문"
is_published: true
---

블로그 본문을 마크다운으로 작성합니다.

## 소제목

본문 내용...

![이미지 설명](./photo.jpg)

> 인용문
```

## 필드 설명

### 프론트매터 (YAML)
| 필드 | 필수 | 설명 |
|------|------|------|
| title | O | 블로그 제목 (최대 200자) |
| category | X | 카테고리 (행사 기획 / 행사 후기 / 트렌드 / 체크리스트 / 장비/기술) |
| tags | X | 태그 목록 (최대 10개, 각 30자 이내) |
| thumbnail | X | 대표 이미지 (로컬 경로 또는 URL) |
| excerpt | X | 요약문 (최대 500자, SNS 공유용) |
| is_published | X | 발행 여부 (기본 true) |

### 자동 처리 필드
- `slug` → title에서 자동 생성 (한글 유지, 공백→하이픈)
- `seo_title` → title 사용
- `seo_description` → excerpt 사용
- `og_image_url` → thumbnail URL 사용
- `published_at` → is_published: true일 때 현재 시간
- `is_featured`, `sort_order` → 기본값 false / 0

### 본문
- 마크다운 문법으로 작성
- `![설명](./파일경로)` 형식의 로컬 이미지는 자동으로 Supabase Storage에 업로드 후 URL 치환
- 외부 URL 이미지는 그대로 사용
- 마크다운 → HTML 변환은 `marked` 라이브러리로 자동 처리

### 이미지 최적화
- 업로드 시 자동 처리: 최대 1200px, WebP quality 90, 최대 5MB
- 포트폴리오 현장사진 URL도 사용 가능 (이미 최적화되어 있음)
