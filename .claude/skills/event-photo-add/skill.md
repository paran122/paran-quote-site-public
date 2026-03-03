---
name: event-photo-add
description: 행사에 사진/영상을 추가하는 스킬. 휴대폰 자동 보정 + 이미지/영상 최적화 + Supabase Storage 업로드.
triggers:
  - 행사 사진 추가해줘
  - 포트폴리오 사진 추가해줘
  - 행사 영상 추가해줘
  - 포트폴리오 영상 올려줘
---

# 사진/영상 추가

## 전체 흐름
```
파일 받기 → 사진/영상 분류 → 사진: 분석+보정 / 영상: 그대로
→ 최적화(사진: WebP / 영상: 720p H.264) → Storage 업로드 → DB 등록
```

## 파일 분류 기준
확장자로 자동 분류한다:
- **사진**: jpg, jpeg, png, webp, heic, tiff, bmp
- **영상**: mp4, mov, avi, mkv, webm, m4v

---

## 절차

### Step 1: 대상 포트폴리오 찾기
```sql
SELECT id, title FROM quote_site.portfolios WHERE title ILIKE '%{키워드}%';
```

### Step 2: 현재 미디어 확인
```sql
SELECT id, url, label, sort_order, type FROM quote_site.portfolio_media
WHERE portfolio_id = '{id}' ORDER BY sort_order;
```

---

## 보정/편집 제외 대상
시안물, 포스터, 현수막 시안, 리플렛 등 **디자인 납품물(deliverable)**은 보정·편집하지 않는다.
이미 전문 디자이너가 작업한 결과물이므로 원본 그대로 WebP 최적화만 적용하여 업로드한다.

## 사진 처리 (이미지 파일인 경우)

### Step 3-P: 이미지 품질 분석
Replicate MCP를 우선 사용하여 품질 검사. Replicate MCP 사용 불가 시 나노바나나 Pro MCP를 폴백으로 사용.
```
검사 항목: 잘린 이미지, 과도한 흐림/노이즈, 비정상 비율, 극단적 노출, 부적절한 구도
```
- 문제 없음 → Step 4-P
- 문제 발견 → AskUserQuestion: "편집 후 업로드" / "그대로 업로드"

### Step 4-P: 휴대폰 사진 자동 보정
판별 기준 (2개 이상 해당 시 휴대폰):
- 실내 조명 색틀어짐, 저조도 노이즈, 플랫한 톤, 과도한 SW 샤프닝

감지 결과 보여주고 AskUserQuestion: "보정할까요?" → "진행" / "원본 그대로"

#### 보정 프롬프트
Replicate MCP를 우선 사용한다. Replicate MCP 사용 불가 시 나노바나나 Pro MCP를 폴백으로 사용.
```
edit_image:
  imagePath: {사진 경로}
  prompt: >
    Enhance this indoor event/seminar photo taken with a smartphone.
    Apply exactly these 7 corrections:
    1. WHITE BALANCE: Fix color cast from indoor fluorescent/LED lighting.
       Neutralize green or blue tint. Restore natural skin tones.
    2. NOISE REDUCTION: Remove digital noise from low-light indoor environment.
       Preserve text on presentations/banners and facial details.
    3. SHARPENING: Apply gentle natural sharpening to improve clarity.
       Do not over-sharpen. Keep it natural-looking.
    4. BRIGHTNESS/CONTRAST: Brighten underexposed indoor areas.
       Apply subtle S-curve contrast for depth without crushing shadows.
    5. MOTION BLUR REDUCTION: Reduce motion blur from people walking
       in indoor event environments. Sharpen moving subjects naturally
       without creating artifacts. Keep background naturally soft.
    6. SHADOW RECOVERY: Recover detail in dark/shadow areas,
       especially in stage or auditorium photos where screens are bright
       but surrounding areas are very dark. Lift shadows without
       overexposing bright areas.
    7. TEXT/DETAIL CLARITY: Enhance readability of text on banners,
       presentation screens, exhibition panels, and signage.
       Make text sharp and legible without over-processing.
    IMPORTANT: Keep the original composition exactly as-is.
    The goal is subtle professional correction, not dramatic transformation.
```
여러 장일 때: 첫 보정 결과를 `referenceImages`에 넣어 톤 통일.

### Step 5-P: 사진 최적화

> **원칙**: 최적화는 화질이 깨지지 않는 선에서 최대한 용량을 줄이는 것이 목표다.
> 육안으로 원본과 차이를 느낄 수 없는 수준을 유지한다.

```bash
npx sharp-cli -i {입력} -o {출력}.webp --format webp --quality 95
```
| 항목 | 값 | 설명 |
|------|-----|------|
| 포맷 | WebP | JPG 대비 동일 화질에서 용량 절감 |
| 품질 | 95 | 육안 차이 없는 최고 품질 |
| 리사이즈 | 안 함 (원본 해상도 유지) | 화질 손상 방지 |
| 메타데이터 | EXIF 제거 | 용량 절감 + 개인정보 보호 |

---

## 영상 처리 (비디오 파일인 경우)

### Step 3-V: ffmpeg 설치 확인
```bash
ffmpeg -version 2>/dev/null || echo "ffmpeg 설치 필요"
```
ffmpeg 없으면 사용자에게 안내: `winget install ffmpeg` 또는 https://ffmpeg.org

### Step 4-V: 영상 최적화
```bash
ffmpeg -i {입력} \
  -vf "scale=-2:1080" \
  -c:v libx264 -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  {출력}.mp4
```

| 항목 | 값 | 설명 |
|------|-----|------|
| 해상도 | 1080p (-2:1080) | 비율 유지, 짝수 보정 |
| 코덱 | H.264 (libx264) | 브라우저 호환성 최고 |
| 품질 | CRF 23 | 시각적으로 무손실 수준 |
| 프리셋 | medium | 속도/품질 균형 |
| 오디오 | AAC 128kbps | 충분한 음질 |
| 웹 최적화 | -movflags +faststart | 스트리밍 바로 재생 |

> CRF 23 = 원본과 화질 차이 구분 불가능 수준. 웹 재생 시 체감 동일.

### Step 5-V: 썸네일(poster) 생성
영상 1초 지점에서 정지화면을 추출하여 poster로 사용한다.
```bash
ffmpeg -i {입력} -ss 00:00:01 -vframes 1 -q:v 2 {출력}_poster.jpg
```
poster도 WebP로 최적화:
```bash
npx sharp-cli -i {poster}.jpg -o {poster}.webp --format webp --quality 95
```

---

## 공통: Storage 업로드 + DB 등록

### Step 6: Supabase Storage 업로드

#### 버킷 확인/생성
```sql
SELECT id FROM storage.buckets WHERE id = 'portfolio';
```
없으면:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true);
```

#### 파일 업로드
`@supabase/supabase-js` 클라이언트를 사용하여 업로드한다 (sb_secret_ 키 형식 호환).

사진:
```typescript
const { data, error } = await supabase.storage
  .from('portfolio')
  .upload(`{event_slug}/{파일명}.webp`, file, {
    contentType: 'image/webp',
    upsert: true,
  });
```

영상:
```typescript
const { data, error } = await supabase.storage
  .from('portfolio')
  .upload(`{event_slug}/{파일명}.mp4`, file, {
    contentType: 'video/mp4',
    upsert: true,
  });
```

poster:
```typescript
const { data, error } = await supabase.storage
  .from('portfolio')
  .upload(`{event_slug}/{파일명}_poster.webp`, file, {
    contentType: 'image/webp',
    upsert: true,
  });
```

**파일 경로 규칙**: `portfolio/{event_slug}/{timestamp}_{순번}.{webp|mp4}`

### Step 7: DB 등록
```sql
INSERT INTO quote_site.portfolio_media (portfolio_id, event_slug, type, label, url, sort_order)
VALUES ('{portfolio_id}', '{event_slug}', '{photo|video}', '{label}', '{storage_public_url}', {기존_최대값+1});
```

### Step 8: 결과 보고
```
## 미디어 추가 완료

- 행사: {행사명}
- 사진: {N}장 추가 (보정 {X}장, WebP 변환)
- 영상: {N}개 추가 (1080p H.264, poster 생성)
- 최적화: 총 {원본 용량} → {최적화 용량} ({절감율}% 감소)
- Storage: portfolio/{event_slug}/

`/work` 페이지에서 확인하세요.
```

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
- 테이블: `portfolio_media` (type: gallery/photo/video)
- Storage 버킷: `portfolio`
- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY: `.env.local`에서 읽기
- 이미지 분석/보정: **Replicate MCP (우선)**, 나노바나나 Pro MCP (폴백: `edit_image`, `restore_image`, `generate_image`)
- 이미지 최적화: sharp-cli (`npx sharp-cli`)
- 영상 최적화: ffmpeg (`ffmpeg`)
