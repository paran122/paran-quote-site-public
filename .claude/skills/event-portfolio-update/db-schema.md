# DB 스키마 문서

스키마: `quote_site`

## portfolios 테이블

| 컬럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| id | UUID | gen_random_uuid() | PK |
| title | TEXT | - | 포트폴리오 제목 (필수) |
| event_type | TEXT | NULL | 행사 유형 (교육행사대행, 영상 기념품 제작, 콘텐츠 제작) |
| year | INTEGER | NULL | 행사 연도 |
| venue | TEXT | NULL | 행사 장소 |
| emoji | TEXT | NULL | 이모지 (DB 저장용, UI 미표시) |
| description | TEXT | NULL | 행사 설명 |
| image_url | TEXT | NULL | 대표 이미지 URL |
| gallery_urls | TEXT[] | '{}' | 갤러리 이미지 URL 배열 |
| tags | TEXT[] | '{}' | 태그 배열 |
| gradient_type | TEXT | NULL | 카드 그라디언트 (seminar, conference, corporate, festival, workshop) |
| is_visible | BOOLEAN | true | 공개 여부 |
| sort_order | INTEGER | 0 | 정렬 순서 (낮을수록 먼저) |
| client | TEXT | NULL | 고객사명 |
| event_date | DATE | NULL | 행사 날짜 |
| created_at | TIMESTAMPTZ | now() | 생성일 |
| updated_at | TIMESTAMPTZ | now() | 수정일 |
| attendees | TEXT | NULL | 참여 인원 (예: "약 200명") |

## portfolio_media 테이블

| 컬럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| id | UUID | gen_random_uuid() | PK |
| portfolio_id | UUID | - | FK → portfolios(id), CASCADE 삭제 |
| event_slug | TEXT | NULL | 행사 슬러그 (Storage 경로용) |
| type | TEXT | NULL | 미디어 유형 (gallery/photo/video) |
| label | TEXT | NULL | 미디어 라벨/설명 |
| url | TEXT | - | 미디어 URL (필수) |
| sort_order | INTEGER | 0 | 정렬 순서 |
| created_at | TIMESTAMPTZ | now() | 생성일 |

## event_reviews 테이블

| 컬럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| id | UUID | gen_random_uuid() | PK |
| portfolio_id | UUID | - | FK → portfolios(id), CASCADE 삭제 |
| reviewer_name | TEXT | - | 작성자 이름 (필수) |
| reviewer_role | TEXT | NULL | 작성자 직책 |
| organization | TEXT | NULL | 소속 기관 |
| content | TEXT | - | 후기 내용 (필수) |
| rating | INTEGER | NULL | 평점 (1~5, CHECK 제약) |
| created_at | TIMESTAMPTZ | now() | 생성일 |

## RLS 정책
- `portfolio_media`: 모든 사용자 SELECT 허용
- `event_reviews`: 모든 사용자 SELECT 허용
- INSERT/UPDATE/DELETE는 서비스 역할(service_role) 또는 Supabase MCP를 통해서만 가능
