import { test } from '@playwright/test';

test('capture new pronto snabbit style website', async ({ page }) => {
  // Desktop
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'test-results/pronto-snabbit-desktop.png', fullPage: false });
  await page.screenshot({ path: 'test-results/pronto-snabbit-full-desktop.png', fullPage: true });

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'test-results/pronto-snabbit-mobile.png', fullPage: false });
});

