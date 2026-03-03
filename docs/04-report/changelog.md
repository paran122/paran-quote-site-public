# Paran Company Quote Site - Changelog

## [2026-02-11] - v1.1.0 (Match Rate 94%, v3 Analysis)

### Added
- **P2 Price Filter**: 5-tier price range filter (under 100, 100-300, 300-500, over 500 man won) in `src/app/services/page.tsx` L13-19
- **P7 Confetti Effect**: canvas-confetti celebration with `particleCount: 100, spread: 70` in `src/app/checkout/complete/page.tsx` L11, L40-47

### Changed
- **GNB Transition**: Improved to `duration-500 ease-in-out` for smooth transparent/solid transition in `src/components/layout/GNB.tsx` L35
- **P3 Service Detail**: Drawer.tsx and drawerStore.ts removed; now exclusively separate page at `/services/[id]` per CLAUDE.md Version B

### Removed
- **Drawer.tsx**: `src/components/ui/Drawer.tsx` removed (was present in v1.0.0)
- **drawerStore.ts**: `src/stores/drawerStore.ts` removed (was present in v1.0.0)

### Documentation
- Gap analysis updated to v3: `docs/03-analysis/landing.analysis.md` (94%)
- Completion report updated to v2.0: `docs/04-report/features/landing.report.md`
- Corrected file count: 42 -> 35 (v1.0.0 counted non-existent files)
- Corrected CRUD function count: 17 -> 18 (fetchPortfolios was missed)
- Corrected store count: 3 -> 2 (drawerStore removed)

### Known Issues Resolved
- ~~Price filter not implemented~~ (resolved)
- ~~Confetti effect not implemented~~ (resolved)

---

## [2026-02-11] - v1.0.0 Initial Release (Match Rate 93%)

### Added
- **P1 풀스크린 랜딩**: Hero Section, 투명→백색 GNB 전환, 인기 서비스 가로 스크롤, 패키지 섹션, 통계 카운트업, CTA 섹션
- **P2 서비스 탐색**: 7개 카테고리 탭 + 패키지 탭, 검색/정렬 필터, 서비스 카드 그리드, 패키지 카드 그리드
- **P3 서비스 상세**: Drawer 컴포넌트 (우측 슬라이드), 별도 페이지 (/services/[id]), 옵션/규모 선택, 장바구니 담기
- **P4 스텝 위저드**: 4단계 진행 (행사유형 → 구성방법 → 서비스선택 → 확인), Framer Motion 슬라이드 애니메이션
- **P5+P6 체크아웃**: 좌우 분할 레이아웃 (장바구니 + 견적폼), 패키지/서비스 아이템, 수량 조절, 할인 계산, 담당자/행사 정보 폼, 모바일 탭 전환
- **P7 견적 완료**: 성공 애니메이션, 견적번호 표시 + 복사 기능, 요약 카드, 5단계 타임라인, 홈/포트폴리오 CTA
- **P8 포트폴리오**: Dark Hero, Masonry 그리드, 필터 (유형/연도/검색), 카드 hover 오버레이, 상세 모달, 갤러리 슬라이드, 무료견적 CTA
- **PA1 대시보드**: 요약 카드 4개 (이번달 견적, 총 서비스, 총 패키지, 이번달 매출), 최근 견적 5건 테이블, 바로가기 3개
- **PA2 서비스 관리**: 카테고리별 아코디언, 검색 필터, SlidePanel 편집 (기본정보/이미지/포함사항/프로세스/규모별가격/옵션)
- **PA3 패키지 관리**: 패키지 카드 그리드, 포함 서비스 목록, 할인율 자동 계산, SlidePanel 편집, 이미지 관리
- **PA4 견적 관리**: 견적 테이블 (6열), 상태 인라인 드롭다운, 상태 뱃지 색상, 상세 SlidePanel, 담당자/행사정보, 내부 메모, 검색/필터
- **PA5 포트폴리오 관리**: 포트폴리오 카드 그리드, 편집 SlidePanel (행사명/이모지/연도/유형/색상/장소/태그), 공개/비공개 토글, 이미지 + 갤러리 관리, 삭제 기능
- **PA6 사이트 문구**: 그룹별 폼 (히어로/통계/CTA/회사/견적), 각 필드 입력 폼, 하단 고정 저장 바, Supabase 저장
- **공통 레이아웃**: GNB (투명→백색 전환), Footer (3열 그리드), CategoryTabs (8개 탭), SiteDataLoader
- **상태 관리**: cartStore (항목 추가/제거/수량/할인), drawerStore (서비스 상세 Drawer), siteDataStore (Supabase 데이터 + 폴백)
- **Supabase 연동**:
  - 클라이언트 설정 (quote_site 스키마)
  - 17개 CRUD 함수 (fetchCategories, fetchServices, fetchPackages, submitQuote, fetchQuotes, updateQuoteStatus, fetchAdminNotes, addAdminNote, updateService, updatePackage, updatePortfolio, deletePortfolio, fetchDashboardStats, fetchRecentQuotes, updateSiteSetting, fetchSiteSettings, fetchServiceById)
  - snake_case → camelCase 변환 (mapRow)
- **디자인 시스템**: Tailwind 토큰 완벽 적용 (Primary #3B82F6, Accent #F59E0B, Success #10B981, 폰트, border-radius, maxWidth)
- **애니메이션**: 스크롤 페이드업 (useInView), 카운트업 (useCountUp), Framer Motion (스텝 위저드, 완료 화면)
- **이미지 지원**: Service/Package/Portfolio에 imageUrl 필드 추가, Portfolio에 갤러리 이미지 배열 지원

### Changed
- **P3 서비스 상세**: 기획서 Drawer only → Drawer + 별도 페이지 병행 (UX 향상)
- **P1 Hero CTA**: 텍스트 버튼 2개 → 카드형 CTA 2개 (시각적 개선)
- **P1 배경 패턴**: SVG grid → CSS linear-gradient (성능 최적화)
- **P7 성공 애니메이션**: SVG drawpath → Framer Motion spring (동등 효과)
- **모바일 탭 Breakpoint**: md (768px) → lg (1024px) 선택 (더 나은 UX)

### Fixed
- **Drawer ESC 닫기**: keydown 이벤트 리스너 구현
- **Drawer 오버레이 클릭**: 외부 영역 클릭 시 자동 닫기
- **장바구니 계산**: 패키지 할인 정확히 적용
- **견적번호 생성**: QT-YYYYMMDD-NNN 형식 정확 적용

### Refactored
- **컴포넌트 구조**: landing 페이지를 5개 섹션 컴포넌트로 분리
- **라이브러리 함수**: 공통 유틸 (useInView, useCountUp) 추출
- **상태 관리**: 3개 스토어로 명확히 분리 (cart, drawer, siteData)
- **쿼리 함수**: 17개 함수로 체계화 (category, service, package, quote, portfolio, admin_notes, site_settings)

### Removed
- N/A (초기 완성 버전)

### Deprecated
- N/A

### Security
- **Supabase 클라이언트**: NEXT_PUBLIC_* 환경 변수로 보안 관리
- **RLS 정책**: Supabase 기본 정책 적용 (향후 강화 필요)
- **Admin Auth**: 미구현 (다음 단계)

### Documentation
- **기획서**: docs/ParanCompany_v7_VersionB.md
- **갭 분석**: docs/03-analysis/landing.analysis.md
- **완료 보고서**: docs/04-report/features/landing.report.md
- **변경로그**: docs/04-report/changelog.md (이 파일)

### Breaking Changes
- N/A

### Performance
- **스크롤 감지**: useInView + Intersection Observer로 최적화
- **카운트업**: requestAnimationFrame으로 부드러운 애니메이션
- **번들 크기**: ~308KB (gzip, 예상)

### Testing
- 기능 테스트: 모든 페이지 UI 동작 확인
- 반응형 테스트: sm, md, lg breakpoint 확인
- Supabase 연동: 데이터 fetch/insert/update 확인
- 브라우저 호환성: Chrome, Safari, Firefox 기본 테스트

### Known Issues
1. **Admin Auth 미구현**: 관리자 로그인 없음 (개발 예정)
2. **CREATE 기능 미구현**: 신규 항목 추가 버튼만 있고 기능 없음
3. **가격대 필터**: P2 필터 드롭다운 미구현
4. **규모 슬라이더**: P4 range input 미구현
5. **.env.example 없음**: 팀 온보딩용 템플릿 미생성

### Migration Guide
N/A (초기 릴리스)

---

## 통계

### 코드
- 총 파일: 42개
- 라우트 페이지: 15개 (8 공개 + 6 관리자 + layout)
- 컴포넌트: 13개
- 상태 스토어: 3개
- 라이브러리 함수: 5개 (supabase, queries, constants, portfolioData, utils)
- 타입 정의: 7개
- 설정: 3개

### 기능
- 공개 페이지: 8/8 (100%)
- 관리자 페이지: 6/6 (100%)
- Supabase 테이블: 7/7 (100%)
- CRUD 함수: 17/17 (100%)

### 메트릭
- 개발 기간: 2일 (집중 개발)
- 1차 분석: 63%
- 2차 분석: 93% (+30pp)
- 최종 일치도: 93% (목표 90% 이상)

---

**변경로그 작성일**: 2026-02-11
**프로젝트**: 파란컴퍼니 견적 사이트
**버전**: 1.0.0 (초기 완성)
