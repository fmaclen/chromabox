import { expect, test } from '@playwright/test';

test.describe('Mobile', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('export panel is hidden by default', async ({ page }) => {
		await page.goto('/');

		const exportButton = page.getByRole('button', { name: 'Export' });
		const exportPanel = page.locator('aside.export-panel');
		await expect(exportButton).not.toBeVisible();
		await expect(exportPanel).not.toBeVisible();

		await page.getByRole('button', { name: 'New color' }).click();
		await expect(exportButton).toBeVisible();

		await exportButton.click();
		await expect(exportPanel).toBeVisible();

		await exportButton.click();
		await expect(exportPanel).not.toBeVisible();
	});
});
