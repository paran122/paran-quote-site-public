---
name: event-review-add
description: 기존 행사에 고객 후기를 추가하는 스킬
triggers:
  - 행사 후기 넣어줘
  - 행사 후기 추가해줘
  - 포트폴리오 후기 추가해줘
---

# 후기 추가

## 절차

### Step 1: 대상 포트폴리오 찾기
```sql
SELECT id, title FROM quote_site.portfolios WHERE title ILIKE '%{키워드}%';
```

### Step 2: 후기 정보 파싱
사용자의 자연어에서 추출한다:
- reviewer_name (필수) - 작성자 이름
- reviewer_role - 직책
- organization - 소속
- content (필수) - 후기 내용
- rating - 평점 (1~5)

예: "해군본부 정훈장교 김정훈 소령, 5점, '체계적인 운영이었습니다'"
→ reviewer_name: 김정훈, reviewer_role: 소령, organization: 해군본부, content: 체계적인 운영이었습니다, rating: 5

불확실한 필드는 사용자에게 확인한다.

### Step 3: INSERT
```sql
INSERT INTO quote_site.event_reviews (
  portfolio_id, reviewer_name, reviewer_role, organization, content, rating
) VALUES ('{id}', '{이름}', '{직책}', '{소속}', '{내용}', {평점});
```

### Step 4: 결과 보고
- 추가된 후기 정보 요약

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
- rating은 1~5 범위 (CHECK 제약조건)
