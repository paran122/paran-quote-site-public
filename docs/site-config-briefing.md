# 파란컴퍼니 사이트 설정 현황 브리핑

**도메인**: https://parancompany.co.kr
**배포**: Netlify (자동 배포)
**기술 스택**: Next.js 14 + TypeScript + Supabase
**최종 업데이트**: 2026-02-26

---

## 1. 보안 설정

### 1-1. HTTP 보안 헤더 (next.config.mjs)

모든 페이지(`/(.*)`)에 아래 5개 보안 헤더가 자동 적용됩니다.

| 헤더 | 값 | 역할 |
|------|-----|------|
| X-Frame-Options | `DENY` | 클릭재킹 방지 (iframe 삽입 차단) |
| X-Content-Type-Options | `nosniff` | MIME 스니핑 공격 방지 |
| Referrer-Policy | `strict-origin-when-cross-origin` | 외부 사이트로 상세 URL 유출 방지 |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` | 카메라/마이크/위치 접근 차단 |
| Strict-Transport-Security (HSTS) | `max-age=63072000; includeSubDomains; preload` | HTTPS 강제 (2년간) |

### 1-2. 관리자/인증 시스템 제거 (커밋 #28)

보안 위험 요소를 원천 제거한 항목:

- `/admin` 페이지 전체 삭제 (10개 파일) - 외부 접근 불가
- 카카오/네이버 OAuth 로그인 시스템 제거
- AuthProvider, LoginModal, authStore, middleware 삭제
- `.env.local`에서 OAuth 키 삭제

### 1-3. Supabase 데이터베이스 보안

- RLS(Row Level Security) 위험 정책 18개 제거
- 현재 허용된 정책: **SELECT(조회)와 INSERT(삽입)만 유지**
- 일반 사용자가 데이터를 수정/삭제할 수 없음

### 1-4. 크롤러 접근 제어 (robots.txt)

검색엔진 크롤러가 접근하면 안 되는 경로를 차단합니다.

```
차단된 경로:
- /admin, /admin/
- /auth, /auth/
- /checkout, /checkout/
- /api, /api/
```

### 1-5. Git 저장소 보안

- 두 리모트(origin, personal) 모두 **Private** 상태
- `.env.local` (API 키 포함)은 `.gitignore`에 등록되어 Git에 포함되지 않음
- `.mcp.json` (MCP 설정, API 키)도 `.gitignore`에 등록

### 1-6. HTTPS

- Netlify에서 SSL 인증서 자동 발급/갱신
- HSTS 헤더로 브라우저가 항상 HTTPS로 접속하도록 강제

---

## 2. SEO (검색엔진 최적화) 설정

### 2-1. 메타태그 (layout.tsx)

```
title: "파란컴퍼니 | 행사 기획·디자인·운영 전문 에이전시"
description: "공공기관·기업 행사 전문 에이전시. 세미나·컨퍼런스·포럼·축제 기획부터 디자인·운영까지. 250+ 프로젝트 수행 실적..."
```

**등록된 키워드** (19개):
행사 대행, 행사 대행사, 행사 기획 대행, 세미나 대행, 컨퍼런스 대행, 포럼 기획, 행사 견적, 행사 비용, 이벤트 견적, 공공기관 행사, 관공서 행사 대행, 기업행사, 이벤트 기획, 행사 디자인, 행사 시안물, 행사 포스터 제작, 행사 운영 대행, 축제 기획, 파란컴퍼니

### 2-2. Open Graph / Twitter Card

카카오톡, 페이스북, 트위터 등에서 링크 공유 시 표시되는 정보:
- 제목: "파란컴퍼니 | 행사 기획·디자인·운영 전문 에이전시"
- 설명: "공공기관·기업 행사 전문 에이전시..."
- 이미지: `/og-image.png` (1200x630)

### 2-3. JSON-LD 구조화 데이터 (JsonLd.tsx)

Google 검색 결과에서 회사 정보가 풍부하게 표시되도록 3종의 구조화 데이터 등록:

| 타입 | 포함 정보 |
|------|----------|
| Organization | 회사명, URL, 로고, 설명, 전화번호 |
| LocalBusiness | 회사명, 주소(서울), 영업시간(평일 09-18), 서비스 지역(대한민국) |
| WebSite | 사이트명, URL |

**전화번호**: +82-2-6953-4422

### 2-4. 사이트맵 (sitemap.xml)

자동 생성되는 사이트맵에 등록된 페이지:

| 페이지 | 우선순위 | 변경 빈도 |
|--------|---------|----------|
| / (홈) | 1.0 | 주간 |
| /services (서비스) | 0.8 | 주간 |
| /work (포트폴리오) | 0.7 | 주간 |
| /build (견적) | 0.6 | 월간 |

### 2-5. 검색엔진 등록 완료

| 검색엔진 | 인증 방식 | 사이트맵 제출 |
|----------|----------|-------------|
| Google Search Console | HTML 메타태그 인증 완료 | 제출 완료 |
| 네이버 서치어드바이저 | HTML 메타태그 인증 완료 | 제출 완료 |

- Google 색인 반영: 며칠 ~ 2주
- 네이버 색인 반영: 며칠 ~ 1주

---

## 3. 애널리틱스 (방문자 분석)

### Google Analytics 4

- **측정 ID**: G-323NGQ108L
- **로딩 방식**: afterInteractive (페이지 렌더링 후 로드, 성능 영향 없음)
- **수집 데이터**: 방문자 수, 페이지뷰, 유입 경로, 체류 시간, 디바이스 등
- **확인 방법**: [GA4 대시보드](https://analytics.google.com/) 에서 실시간 및 보고서 확인

---

## 4. 향후 보안 관련 진행 예정 사항

| 항목 | 설명 | 우선순위 |
|------|------|---------|
| Supabase RLS 세부 강화 | 데이터 확정 후 테이블별 정책 세분화 | 중간 |
| Zod 서버 검증 | 견적 폼 등 사용자 입력값 서버사이드 검증 추가 | 중간 |
| CSRF 토큰 | 폼 제출 시 위변조 방지 토큰 적용 | 낮음 (현재 관리자 기능 없어 위험도 낮음) |
| .env.local 키 재생성 | 저장소 Private 상태라 긴급도 낮음, 비즈앱 전환 시 함께 진행 | 낮음 |
