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

	test('JSON format is selected by default', { tag: '@demo' }, async ({ page }) => {
		await page.goto('/');
		const exportPanel = page.locator('aside.export-panel');

		await page.getByRole('button', { name: 'New color' }).click();

		await expect(exportPanel).toBeVisible();
		await expect(exportPanel.getByRole('tab', { name: 'JSON', exact: true })).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(exportPanel.getByRole('tab', { name: 'CSS', exact: true })).not.toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(exportPanel.getByRole('tab', { name: 'SCSS', exact: true })).not.toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect(
			exportPanel.getByRole('tab', { name: 'Tailwind', exact: true })
		).not.toHaveAttribute('aria-selected', 'true');
	});

	test('export formats other than JSON are locked', { tag: '@demo' }, async ({ page }) => {
		await page.goto('/');
		const exportPanel = page.locator('aside.export-panel');
		const emptyMessage = ' export is only available in the full version.';

		await page.getByRole('button', { name: 'New color' }).click();

		await expect(exportPanel).toBeVisible();
		await expect(page.getByText(emptyMessage)).not.toBeVisible();

		await page.getByRole('tab', { name: 'CSS', exact: true }).click();
		await expect(page.getByText('CSS' + emptyMessage, { exact: true })).toBeVisible();

		await page.getByRole('tab', { name: 'SCSS', exact: true }).click();
		await expect(page.getByText('SCSS' + emptyMessage, { exact: true })).toBeVisible();

		await page.getByRole('tab', { name: 'Tailwind', exact: true }).click();
		await expect(page.getByText('Tailwind' + emptyMessage, { exact: true })).toBeVisible();
	});
});
