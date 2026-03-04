# Git 워크플로우 변경 보고

## 변경 사항 요약
기존 Private 레포에서 **Public 레포로 전환**하고, **브랜치 보호 규칙(Rulesets)** 을 적용했습니다.

## 변경 이유
- GitHub Rulesets 기능 사용을 위해 Public 전환 필요
- 배포 전 코드 검토 단계 추가
- main 브랜치 직접 수정 방지 (실수로 인한 배포 사고 예방)

## 레포 구성

| 레포 | 상태 | 용도 |
|------|------|------|
| paran-quote-site-public | Public | 메인 개발 + Netlify 배포 |
| paran-qoute-site-t- | Private | 백업 |
| paran-quote-site | Private | 아카이브 (이전 히스토리) |

- Public 전환 시 민감 정보(API 키, 토큰 등) 전부 제거 완료
- 환경변수는 Netlify에서 별도 관리 (레포에 포함되지 않음)

## 개발 흐름

```
코드 수정 (dev 브랜치)
    ↓
git push origin dev
    ↓
GitHub에서 Pull Request 생성
    ↓
변경 내용 확인
    ↓
Merge 버튼 클릭
    ↓
Netlify 자동 배포
```

## 브랜치 규칙
- **dev** : 작업용 브랜치 (여기서 코드 수정)
- **main** : 배포용 브랜치 (직접 push 불가, PR 머지로만 반영)

## 팀원 작업 방법

### 최초 1회 설정
```bash
git clone https://github.com/paran122/paran-quote-site-public.git
cd paran-quote-site-public
git checkout dev
npm install
```

### 이후 작업
1. VS Code 왼쪽 하단이 **dev** 인지 확인
2. 코드 수정 후 커밋
3. `git push origin dev`
4. GitHub에서 Pull Request 생성 → 확인 → Merge

## 보안 조치
- .env.local (API 키) : 레포에 포함되지 않음
- .claude/settings.local.json : 레포에 포함되지 않음
- 기존 히스토리에 포함되었던 키 : 새 레포에는 히스토리 없이 클린 상태로 시작
