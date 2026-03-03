---
name: event-photo-remove
description: 기존 행사에서 사진을 삭제하는 스킬
triggers:
  - 행사 사진 빼줘
  - 행사 사진 삭제해줘
  - 포트폴리오 사진 빼줘
---

# 사진 삭제

## 절차

### Step 1: 대상 포트폴리오 찾기
```sql
SELECT id, title FROM quote_site.portfolios WHERE title ILIKE '%{키워드}%';
```

### Step 2: 현재 미디어 목록 보여주기
```sql
SELECT id, url, label, sort_order, type FROM quote_site.portfolio_media
WHERE portfolio_id = '{id}' ORDER BY sort_order;
```
번호를 붙여서 목록을 보여준다.

### Step 3: 삭제 확인
사용자에게 "이 사진을 삭제할까요?" 반드시 확인한다.

### Step 4: DELETE
```sql
DELETE FROM quote_site.portfolio_media WHERE id = '{media_id}';
```

### Step 5: 결과 보고
- 삭제된 사진 수, 남은 사진 수

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
- 테이블: `portfolio_media` (type: gallery/photo/video)
- Storage 버킷: `portfolio`
