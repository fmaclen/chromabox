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

	test('default color palette is visible', { tag: '@demo' }, async ({ page }) => {
		const color = page.locator('.color');

		await page.goto('/');
		await expect(color).toHaveCount(6);
		await expect(color.nth(0).getByLabel('HEX', { exact: true })).toHaveValue('#008cff');
		await expect(color.nth(1).getByLabel('HEX', { exact: true })).toHaveValue('#a600ff');
		await expect(color.nth(2).getByLabel('HEX', { exact: true })).toHaveValue('#f600ff');
		await expect(color.nth(3).getByLabel('HEX', { exact: true })).toHaveValue('#ff0004');
		await expect(color.nth(4).getByLabel('HEX', { exact: true })).toHaveValue('#ff9000');
		await expect(color.nth(5).getByLabel('HEX', { exact: true })).toHaveValue('#ffbf00');
	});
});
