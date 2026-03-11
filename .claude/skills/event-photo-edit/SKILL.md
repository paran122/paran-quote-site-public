---
name: event-photo-edit
description: 행사 사진/영상 편집/보정 스킬. 자동 보정 + 이미지/영상 최적화 + Supabase Storage 재업로드.
triggers:
  - 행사 사진 편집해줘
  - 행사 사진 수정해줘
  - 행사 이미지 편집해줘
  - 포트폴리오 사진 편집해줘
  - 행사 사진 보정해줘
  - 포트폴리오 사진 보정해줘
  - 사진 퀄리티 올려줘
  - 행사 영상 편집해줘
  - 포트폴리오 영상 최적화해줘
---

# 사진/영상 편집

## 전체 흐름
```
미디어 선택 → 편집/보정 → 최적화(사진: 1080px WebP q80 / 영상: 720p H.264) → Storage 업로드 → DB 업데이트
```

## 파일 분류 기준
URL 확장자로 자동 분류:
- **사진**: jpg, jpeg, png, webp, heic, tiff, bmp
- **영상**: mp4, mov, avi, mkv, webm, m4v

---

## 절차

### Step 1: 대상 포트폴리오 찾기
```sql
SELECT id, title FROM quote_site.portfolios WHERE title ILIKE '%{키워드}%';
```

### Step 2: 미디어 목록 표시
```sql
SELECT id, url, label, sort_order, type FROM quote_site.portfolio_media
WHERE portfolio_id = '{id}' ORDER BY sort_order;
```
- 각 항목을 "[번호] [type] 라벨 - URL" 형식으로 표시
- type 컬럼으로 gallery/photo/video 구분

### Step 3: 편집 모드 선택
AskUserQuestion:

**질문**: "어떤 편집을 할까요?"
**옵션**:
1. **자동 보정** - 휴대폰 사진 자동 감지 + 일괄 보정 (화밸/노이즈/샤프닝/밝기)
2. **직접 편집** - 특정 사진을 골라 원하는 편집 지시
3. **전체 일괄 보정** - 모든 사진에 보정 적용 (DSLR 포함)
4. **영상 최적화** - 영상을 720p H.264 (no audio)로 최적화

> "보정", "퀄리티" 표현 → 옵션 1 추천
> 구체적 편집 지시 → 옵션 2로 바로 진행
> "영상" 표현 → 옵션 4 추천

---

## 보정/편집 제외 대상
시안물, 포스터, 현수막 시안, 리플렛 등 **디자인 납품물(deliverable)**은 보정·편집하지 않는다.
이미 전문 디자이너가 작업한 결과물이므로 원본 그대로 WebP 최적화만 적용한다.
자동 보정 시 해당 파일은 자동으로 제외하고, 직접 편집 시에도 사용자에게 안내 후 스킵한다.

## 모드 A: 자동 보정 (사진만)

### Step A-1: 휴대폰 사진 감지
판별 기준 (2개 이상 해당 시 휴대폰):
- 실내 조명 색틀어짐, 저조도 노이즈, 플랫한 톤, 과도한 SW 샤프닝

감지 결과 보여주고 AskUserQuestion: "진행" / "번호 조정"

### Step A-2: 일괄 보정 실행
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
톤 통일: 첫 보정 결과를 `referenceImages`에 넣어 맞춤.

→ Step 5로 이동

---

## 모드 B: 직접 편집

### Step B-1: 편집할 미디어 선택
### Step B-2: 편집 지시 확인
### Step B-3: Replicate MCP로 편집 실행 (사진만)
Replicate MCP를 우선 사용한다. Replicate MCP 사용 불가 시 나노바나나 Pro MCP를 폴백으로 사용.
- 만족 → Step 5
- 추가 수정 → 재편집
- 취소 → 종료

---

## 모드 C: 전체 일괄 보정

모드 A와 동일, DSLR/휴대폰 구분 없이 모든 사진에 적용.
→ Step 5로 이동

---

## 모드 D: 영상 최적화

### Step D-1: 영상 파일 선택
목록에서 영상 파일만 필터링하여 보여준다.
AskUserQuestion: "어떤 영상을 최적화할까요?"
- 옵션 1: "전체" → 모든 영상
- 옵션 2: "선택" → 번호 지정

### Step D-2: ffmpeg 설치 확인
```bash
ffmpeg -version 2>/dev/null || echo "ffmpeg 설치 필요"
```
없으면 안내: `winget install ffmpeg`

### Step D-3: 영상 최적화 실행
```bash
ffmpeg -i {입력} \
  -vf "scale=-2:720" \
  -c:v libx264 -crf 23 -preset medium \
  -an \
  -movflags +faststart \
  {출력}.mp4
```

| 항목 | 값 | 설명 |
|------|-----|------|
| 해상도 | 720p (-2:720) | 비율 유지, 짝수 보정 |
| 코덱 | H.264 (libx264) | 브라우저 호환성 최고 |
| 품질 | CRF 23 | 시각적으로 무손실 수준 |
| 프리셋 | medium | 속도/품질 균형 |
| 오디오 | 없음 (-an) | 행사 영상은 음소거 재생 |
| 웹 최적화 | -movflags +faststart | 스트리밍 바로 재생 |

### Step D-4: 썸네일(poster) 생성
```bash
ffmpeg -i {입력} -ss 00:00:01 -vframes 1 -q:v 2 {출력}_poster.jpg
npx sharp-cli -i {poster}.jpg -o {poster}.webp --format webp --quality 80 --resize 1080
```

### Step D-5: 최적화 결과 보고
```
[1] 행사 하이라이트: 800MB → 250MB (720p H.264, 69% 감소) ✓
    poster: 생성 완료 (42KB)
```

→ Step 5로 이동

---

## 공통: 사진 최적화 + Storage + DB

### Step 5: 사진 최적화 (사진 편집/보정한 경우)

편집/보정된 사진을 WebP로 최적화:
```bash
npx sharp-cli -i {입력} -o {출력}.webp --format webp --quality 80 --resize 1080
```
| 항목 | 값 |
|------|-----|
| 최대 가로 | 1080px |
| 포맷 | WebP |
| 품질 | 80 |

### Step 6: Supabase Storage 업로드

#### 버킷 확인
```sql
SELECT id FROM storage.buckets WHERE id = 'portfolio';
```
없으면 생성.

#### 파일 업로드
`@supabase/supabase-js` 클라이언트를 사용하여 업로드한다 (sb_secret_ 키 형식 호환).
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

### Step 7: DB 업데이트

AskUserQuestion: "편집/최적화된 파일로 DB를 업데이트할까요?"
- 옵션 1: "전부 반영"
- 옵션 2: "일부만 반영"
- 옵션 3: "취소"

```sql
UPDATE quote_site.portfolio_media
SET url = '{storage_public_url}'
WHERE id = '{media_id}';
```

### Step 8: 결과 보고
```
## 편집/보정/최적화 완료

- 행사: {행사명}
- 사진 보정: {N}장 (화밸/노이즈/샤프닝/밝기)
- 사진 최적화: {N}장 (WebP, {절감율}% 감소)
- 영상 최적화: {N}개 (720p H.264, {절감율}% 감소, poster 생성)
- Storage: portfolio/{event_slug}/

`/work` 페이지에서 확인하세요.
```

## 환경
- Supabase MCP 프로젝트 ID: `aiarnrhftmuffmcninyl`
- 스키마: `quote_site`
- 테이블: `portfolio_media` (type: gallery/photo/video)
- Storage 버킷: `portfolio`
- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY: `.env.local`에서 읽기
- 이미지 편집/보정: **Replicate MCP (우선)**, 나노바나나 Pro MCP (폴백: `edit_image`, `list_generated_images`)
- 이미지 최적화: sharp-cli (`npx sharp-cli`)
- 영상 최적화: ffmpeg (`ffmpeg`)
