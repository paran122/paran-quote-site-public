---
name: event-review-edit
description: 기존 행사의 고객 후기를 수정하는 스킬
triggers:
  - 행사 후기 수정해줘
  - 포트폴리오 후기 수정해줘
---

# 후기 수정

## 절차

### Step 1: 대상 포트폴리오 찾기
```sql
SELECT id, title FROM quote_site.portfolios WHERE title ILIKE '%{키워드}%';
```

### Step 2: 현재 후기 목록 보여주기
```sql
SELECT id, reviewer_name, reviewer_role, organization, content, rating
FROM quote_site.event_reviews
WHERE portfolio_id = '{id}' ORDER BY created_at;
```
번호를 붙여서 목록을 보여준다.

### Step 3: 수정 내용 확인
사용자에게 어떤 후기를, 어떻게 바꿀지 확인한다.

### Step 4: UPDATE
```sql
UPDATE quote_site.event_reviews
SET content = '{새_내용}', rating = {새_평점}
WHERE id = '{review_id}';
```

### Step 5: 결과 보고
- 수정 전/후 비교 요약

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
