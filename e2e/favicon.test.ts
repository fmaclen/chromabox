import { expect, test } from '@playwright/test';

test.describe('Favicon', () => {
	test('changes when colors change', async ({ page }) => {
		await page.goto('/');

		const favicon = page.locator('link[rel="icon"]');
		const defaultColors = await favicon.getAttribute('href');
		expect(defaultColors).toContain('data:image/svg+xml');

		// Add one color
		await page.getByRole('button', { name: 'New color' }).click();
		const oneColor = await favicon.getAttribute('href');
		expect(oneColor).not.toBe(defaultColors);

		// Add a second color
		await page.getByRole('button', { name: 'New color' }).click();
		const twoColors = await favicon.getAttribute('href');
		expect(twoColors).not.toBe(defaultColors);
		expect(twoColors).not.toBe(oneColor);

		// Add a third color
		await page.getByRole('button', { name: 'New color' }).click();
		const threeColors = await favicon.getAttribute('href');
		expect(threeColors).not.toBe(defaultColors);
		expect(threeColors).not.toBe(oneColor);
		expect(threeColors).not.toBe(twoColors);

		// Favicon supports only 3 colors, so the fourth color is ignored
		await page.getByRole('button', { name: 'New color' }).click();
		const fourColors = await favicon.getAttribute('href');
		expect(fourColors).toBe(threeColors);
	});
});
