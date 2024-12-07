import { expect, test } from '@playwright/test';

test.describe('Demo', () => {
	test('landing page is not visible', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Buy now')).not.toBeVisible();
	});

	test('landing page is visible', { tag: '@demo' }, async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Buy now')).toBeVisible();
	});
});
