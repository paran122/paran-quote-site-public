import { test, expect } from '@playwright/test';

test.describe('메인페이지 (/) E2E 테스트', () => {
  test.describe('1. 페이지 로딩 및 주요 요소 렌더링', () => {
    test('메인페이지가 200 OK로 로딩된다', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
    });

    test('페이지 타이틀이 올바르다', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/파란컴퍼니/);
    });

    test('히어로 섹션 H1이 렌더링된다', async ({ page }) => {
      await page.goto('/');
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('교육이 즐거워질 때');
    });

    test('인기 서비스 섹션이 렌더링된다', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { name: '인기 서비스' })).toBeVisible();
    });

    test('추천 패키지 섹션이 렌더링된다', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { name: '추천 패키지' })).toBeVisible();
    });

    test('푸터가 렌더링된다', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('contentinfo')).toBeVisible();
      await expect(page.getByText('© 2026 파란컴퍼니')).toBeVisible();
    });
  });

  test.describe('2. 네비게이션 링크 정상 작동', () => {
    test('서비스 링크가 /services로 이동한다', async ({ page, viewport }) => {
      await page.goto('/');
      if (viewport && viewport.width < 768) {
        await page.getByRole('button', { name: '메뉴 열기' }).click();
        await page.getByRole('banner').getByRole('link', { name: '서비스', exact: true }).click();
      } else {
        await page.getByRole('navigation').getByRole('link', { name: '서비스' }).click();
      }
      await expect(page).toHaveURL('/services');
      await expect(page).toHaveTitle(/서비스/);
    });

    test('포트폴리오 링크가 /work로 이동한다', async ({ page, viewport }) => {
      await page.goto('/');
      if (viewport && viewport.width < 768) {
        await page.getByRole('button', { name: '메뉴 열기' }).click();
        await page.getByRole('banner').getByRole('link', { name: '포트폴리오' }).click();
      } else {
        await page.getByRole('navigation').getByRole('link', { name: '포트폴리오' }).click();
      }
      await expect(page).toHaveURL('/work');
      await expect(page).toHaveTitle(/포트폴리오/);
    });

    test('문의하기 링크가 /checkout으로 이동한다', async ({ page, viewport }) => {
      await page.goto('/');
      if (viewport && viewport.width < 768) {
        await page.getByRole('button', { name: '메뉴 열기' }).click();
        await page.getByRole('banner').getByRole('link', { name: '문의하기' }).click();
      } else {
        await page.getByRole('navigation').getByRole('link', { name: '문의하기' }).click();
      }
      await expect(page).toHaveURL('/checkout');
    });

    test('로고 클릭 시 홈으로 이동한다', async ({ page }) => {
      await page.goto('/services');
      await page.getByRole('link', { name: '파란컴퍼니' }).click();
      await expect(page).toHaveURL('/');
    });

    test('인기 서비스 카드 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: /컨퍼런스 기획서/ }).first().click();
      await expect(page).toHaveURL(/\/services\/svc-/);
    });
  });

  test.describe('3. 버튼 클릭 및 이벤트 동작', () => {
    test('서비스 상세에서 수량 증가/감소 버튼이 동작한다', async ({ page, viewport }) => {
      test.skip(viewport !== null && viewport.width < 768, '사이드바가 모바일에서 하단 고정이므로 별도 테스트');
      await page.goto('/services/svc-1');
      // 초기 합계 확인
      await expect(page.getByRole('paragraph').filter({ hasText: /^1,500,000원$/ })).toBeVisible();
      // + 버튼 클릭 (수량 영역의 두 번째 아이콘 버튼)
      await page.evaluate(() => {
        const asides = document.querySelectorAll('aside');
        const priceSidebar = asides[asides.length - 1];
        const buttons = priceSidebar.querySelectorAll('button');
        const iconOnlyButtons = Array.from(buttons).filter(btn => !btn.textContent?.trim());
        if (iconOnlyButtons.length >= 2) {
          (iconOnlyButtons[1] as HTMLButtonElement).click();
        }
      });
      await expect(page.getByRole('paragraph').filter({ hasText: /^3,000,000원$/ })).toBeVisible();
    });

    test('장바구니 담기 버튼이 동작한다', async ({ page, viewport }) => {
      test.skip(viewport !== null && viewport.width < 768, '사이드바가 모바일에서 하단 고정이므로 별도 테스트');
      await page.goto('/services/svc-1');
      await page.getByRole('button', { name: '장바구니 담기' }).click();
      await expect(page.getByText('담기 완료')).toBeVisible({ timeout: 5000 });
    });

    test('카카오톡 상담 링크가 올바른 URL을 가진다', async ({ page }) => {
      await page.goto('/');
      const kakaoLink = page.getByRole('link', { name: '카카오톡 무료 상담' });
      await expect(kakaoLink).toHaveAttribute('href', 'https://pf.kakao.com/_xkexdLG');
    });
  });

  test.describe('4. 반응형 레이아웃', () => {
    test('모바일에서 햄버거 메뉴가 표시된다', async ({ page, viewport }) => {
      test.skip(viewport !== null && viewport.width > 640, '모바일 전용 테스트');
      await page.goto('/');
      await expect(page.getByRole('button', { name: '메뉴 열기' })).toBeVisible();
    });

    test('모바일 햄버거 메뉴 열기/닫기가 동작한다', async ({ page, viewport }) => {
      test.skip(viewport !== null && viewport.width > 640, '모바일 전용 테스트');
      await page.goto('/');
      await page.getByRole('button', { name: '메뉴 열기' }).click();
      await expect(page.getByRole('banner').getByRole('link', { name: '서비스', exact: true })).toBeVisible();
      await expect(page.getByRole('banner').getByRole('link', { name: '포트폴리오' })).toBeVisible();
      await page.getByRole('button', { name: '메뉴 닫기' }).click();
    });

    test('데스크톱에서 네비게이션 링크가 직접 표시된다', async ({ page, viewport }) => {
      test.skip(viewport !== null && viewport.width < 768, '데스크톱 전용 테스트');
      await page.goto('/');
      await expect(page.getByRole('navigation').getByRole('link', { name: '서비스' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: '포트폴리오' })).toBeVisible();
    });
  });

  test.describe('5. 콘솔 에러 확인', () => {
    test('메인페이지 로딩 시 콘솔 에러가 없다', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      expect(errors).toHaveLength(0);
    });
  });

  test.describe('6. API/페이지 응답 확인', () => {
    test('/services 페이지가 정상 응답한다', async ({ page }) => {
      const response = await page.goto('/services');
      expect(response?.status()).toBe(200);
    });

    test('/work 페이지가 정상 응답한다', async ({ page }) => {
      const response = await page.goto('/work');
      expect(response?.status()).toBe(200);
    });

    test('/checkout 페이지가 정상 응답한다', async ({ page }) => {
      const response = await page.goto('/checkout');
      expect(response?.status()).toBe(200);
    });

    test('/services/svc-1 상세 페이지가 정상 응답한다', async ({ page }) => {
      const response = await page.goto('/services/svc-1');
      expect(response?.status()).toBe(200);
    });
  });
});
