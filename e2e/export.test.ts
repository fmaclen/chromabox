import { expect, test } from '@playwright/test';

test.describe('Export palette', () => {
	test('should show all variants in export panel with 3 steps', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New color' }).click();
		await page.getByLabel('HEX', { exact: true }).fill('#ff0000');
		await page.getByTitle('Steps').fill('3');

		const exportPanel = page.locator('aside.export-panel');
		await expect(exportPanel).toBeVisible();
		await expect(exportPanel).toContainText('#ffffff');
		await expect(exportPanel).toContainText('#ff0000');
		await expect(exportPanel).toContainText('#000000');
	});

	test('should use custom token name or placeholder in exports', async ({ page }) => {
		await page.goto('/');
		const exportPanel = page.locator('aside.export-panel');

		// Use default placeholder
		await page.getByRole('button', { name: 'New color' }).click();
		await page.getByLabel('HEX', { exact: true }).fill('#ff0000');
		await page.getByTitle('Steps').fill('3');
		await expect(exportPanel).toContainText('red-0');
		await expect(exportPanel).toContainText('red-1');
		await expect(exportPanel).toContainText('red-2');
		await expect(exportPanel).not.toContainText('myredcolor-0');
		await expect(exportPanel).not.toContainText('myredcolor-1');
		await expect(exportPanel).not.toContainText('myredcolor-2');

		await page.getByRole('button', { name: 'Reset' }).click();

		// Use custom token name
		await page.getByRole('button', { name: 'New color' }).click();
		await page.getByLabel('HEX', { exact: true }).fill('#ff0000');
		await page.getByRole('textbox').first().fill('myredcolor');
		await page.getByTitle('Steps').fill('3');
		await expect(exportPanel).toContainText('myredcolor-0');
		await expect(exportPanel).toContainText('myredcolor-1');
		await expect(exportPanel).toContainText('myredcolor-2');
		await expect(exportPanel).not.toContainText('red-0');
		await expect(exportPanel).not.toContainText('red-1');
		await expect(exportPanel).not.toContainText('red-2');
	});

	test('should handle default 12 steps with custom easing', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New color' }).click();
		await page.getByLabel('HEX', { exact: true }).fill('#ff0000');
		await page.getByTitle('Steps').fill('12');
		await page.getByTitle('Easing').selectOption('quadInOut');

		// Only check a few key variants instead of all 12
		const exportPanel = page.locator('aside.export-panel');
		await expect(exportPanel).toContainText('red-1: #fff7f7');
		await expect(exportPanel).toContainText('red-3: #ffb3b3');
		await expect(exportPanel).toContainText('red-7: #870000');
		await expect(exportPanel).toContainText('red-10: #080000');
		await expect(exportPanel).not.toContainText('red-12');
		await expect(exportPanel).not.toContainText('red-1: #ff0000');
	});

	test('should export multiple colors with different steps and easings', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: 'New color' }).click();
		const firstColor = page.locator('section.color').nth(0);
		await firstColor.getByLabel('HEX', { exact: true }).fill('#0000ff');
		await firstColor.getByTitle('Steps').fill('5');
		await firstColor.getByTitle('Easing').selectOption('quadIn');
		await firstColor.getByRole('textbox').first().fill('primary');

		await page.getByRole('button', { name: 'New color' }).click();
		const secondColor = page.locator('section.color').nth(1);
		await secondColor.getByLabel('HEX', { exact: true }).fill('#00ff00');
		await secondColor.getByTitle('Steps').fill('7');
		await secondColor.getByTitle('Easing').selectOption('quadOut');
		await secondColor.getByRole('textbox').first().fill('secondary');

		await page.getByRole('tab', { name: 'CSS', exact: true }).click();
		const cssContent = await page.getByRole('code').textContent();
		expect(cssContent).toContain('--primary-0: #ffffff');
		expect(cssContent).toContain('--primary-1: #dfdfff');
		expect(cssContent).toContain('--primary-2: #8080ff');
		expect(cssContent).toContain('--primary-3: #0000df');
		expect(cssContent).toContain('--primary-4: #000000');
		expect(cssContent).not.toContain('--primary-5');
		expect(cssContent).not.toContain('--primary-0: #0000ff');

		expect(cssContent).toContain('--secondary-0: #ffffff');
		expect(cssContent).toContain('--secondary-1: #63ff63');
		expect(cssContent).toContain('--secondary-2: #00e300');
		expect(cssContent).toContain('--secondary-3: #008000');
		expect(cssContent).toContain('--secondary-4: #003900');
		expect(cssContent).toContain('--secondary-5: #000e00');
		expect(cssContent).toContain('--secondary-6: #000000');
		expect(cssContent).not.toContain('--secondary-7');
		expect(cssContent).not.toContain('--secondary-0: #00ff00');
	});

	test('should copy export text to clipboard', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'New color' }).click();
		await page.getByLabel('HEX', { exact: true }).fill('#ff0000');
		await page.getByTitle('Steps').fill('5');

		await page.getByRole('tab', { name: 'CSS', exact: true }).click();
		await page.locator('aside.export-panel').getByRole('button', { name: 'Copy' }).click();

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText).toContain('--red-0: #ffffff');
		expect(clipboardText).toContain('--red-1: #ff8080');
		expect(clipboardText).toContain('--red-2: #ff0000');
		expect(clipboardText).toContain('--red-3: #800000');
		expect(clipboardText).toContain('--red-4: #000000');
		expect(clipboardText).not.toContain('--red-5');
		expect(clipboardText).not.toContain('--red-0: #ff0000');
	});
});
