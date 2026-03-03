---
name: event-edit
description: 기존 행사의 기본 정보를 수정하는 스킬
triggers:
  - 행사 수정해줘
  - 행사 내용 바꿔줘
  - 포트폴리오 수정해줘
---

# 행사 정보 수정

## 절차

### Step 1: 대상 포트폴리오 찾기
```sql
SELECT id, title, venue, year, event_type, client, is_visible
FROM quote_site.portfolios WHERE title ILIKE '%{키워드}%';
```
- 여러 건이면 목록을 보여주고 선택 요청

### Step 2: 현재 정보 보여주기
찾은 포트폴리오의 현재 정보를 사용자에게 보여준다.

### Step 3: 수정할 필드 확인
사용자의 요청에서 수정할 필드를 파악한다.

수정 가능 필드:
| 필드 | 설명 |
|------|------|
| title | 제목 |
| venue | 장소 |
| client | 고객사 |
| event_date | 행사 날짜 |
| description | 설명 |
| image_url | 대표 이미지 |
| tags | 태그 |
| gradient_type | 카드 스타일 |
| is_visible | 공개 여부 |
| sort_order | 정렬 순서 |

### Step 4: UPDATE
```sql
UPDATE quote_site.portfolios
SET {컬럼} = '{값}', updated_at = now()
WHERE id = '{id}';
```

### Step 5: 결과 보고
- 수정된 필드와 값 요약

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
