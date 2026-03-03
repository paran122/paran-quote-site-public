# 포트폴리오 MD 템플릿

아래 형식으로 MD 파일을 작성하면 스킬이 파싱하여 DB에 등록합니다.

---

```markdown
---
title: "행사 제목"
event_type: "교육행사대행"          # 교육행사대행 | 영상 기념품 제작 | 콘텐츠 제작
event_date: "2025-03-15"            # YYYY-MM-DD
year: 2025
venue: "행사 장소"
client: "고객사명"                  # 선택
thumbnail: "https://example.com/thumbnail.jpg"
gradient_type: "seminar"            # seminar | conference | corporate | festival | workshop
tags:
  - 교육
  - 세미나
is_visible: true
sort_order: 1                       # 낮을수록 상단
---

## 설명

행사에 대한 상세 설명을 작성합니다.
여러 줄로 작성 가능합니다.

## 갤러리

- ![사진 설명 1](https://example.com/photo1.jpg)
- ![사진 설명 2](https://example.com/photo2.jpg)
- ![현장 전경](https://example.com/photo3.jpg)

## 고객 후기

### 홍길동 | 교육담당자 | 경기도교육청
교육 프로그램이 체계적이고, 현장 운영도 매끄러웠습니다. 참가자 만족도가 매우 높았습니다.
평점: 5

### 김철수 | 과장 | 해군본부
전문적인 기획과 운영 능력에 감사드립니다.
평점: 5
```

## 필드 설명

### 프론트매터 (YAML)
| 필드 | 필수 | 설명 |
|------|------|------|
| title | O | 행사 제목 |
| event_type | O | 행사 유형 |
| event_date | X | 행사 날짜 (YYYY-MM-DD) |
| year | O | 연도 |
| venue | O | 장소 |
| client | X | 고객사명 |
| thumbnail | X | 대표 이미지 URL |
| gradient_type | O | 카드 스타일 |
| tags | O | 태그 목록 |
| is_visible | X | 기본 true |
| sort_order | X | 기본 0 |

### 본문 섹션
- `## 설명`: portfolios.description에 저장
- `## 갤러리`: 마크다운 이미지 문법 파싱 → event_photos 테이블
- `## 고객 후기`: `### 이름 | 직책 | 소속` 형식 파싱 → event_reviews 테이블
