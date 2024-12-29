import { expect, test } from '@playwright/test';

test.describe('Docs', () => {
	test('take screenshot', async ({ page }) => {
		const DEFAULT_COLOR_PALETTE = [
			'#008CFF',
			'#A600FF',
			'#F600FF',
			'#FF0004',
			'#FF9000',
			'#FFBF00'
		];

		await page.goto('/');
		const colorBar = page.locator('.color');
		for (const { color, index } of DEFAULT_COLOR_PALETTE.map((color, index) => ({ color, index }))) {
			await page.getByRole('button', { name: 'New color' }).click();
			await colorBar.nth(index).getByLabel('HEX', { exact: true }).fill(color);
			await colorBar.nth(index).getByLabel('HEX', { exact: true }).blur();
		}
		await expect(colorBar).toHaveCount(DEFAULT_COLOR_PALETTE.length);

		await page.waitForTimeout(150); // Wait for transition to finish
		await colorBar.nth(0).scrollIntoViewIfNeeded();
		await page.screenshot({ path: 'docs/palette.png' });
	});
});
