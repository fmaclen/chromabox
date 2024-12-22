import { expect, test } from '@playwright/test';

test.describe('Export palette', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: 'New color' }).click();
		const hexInput = page.getByLabel('HEX', { exact: true });
		await hexInput.fill('#ff0000');
		await hexInput.blur();

		await page.getByTitle('Steps').fill('3');
	});

	test('should show all variants in export panel', async ({ page }) => {
		const exportPanel = page.locator('aside[aria-label="Export Panel"]');
		await expect(exportPanel).toBeVisible();
		await expect(exportPanel).toContainText('#ffffff');
		await expect(exportPanel).toContainText('#ff0000');
		await expect(exportPanel).toContainText('#000000');
		await expect(exportPanel).not.toContainText('#00ff00');
	});

	test('should export in different formats', async ({ page }) => {
		// Check CSS format
		await page.getByRole('tab', { name: 'CSS', exact: true }).click();
		const cssContent = await page.getByRole('code').textContent();
		expect(cssContent).toContain('--red-0: #ffffff;');
		expect(cssContent).toContain('--red-1: #ff0000;');
		expect(cssContent).toContain('--red-2: #000000;');
		expect(cssContent).not.toContain('--red-3: #00ff00;');
		expect(cssContent).not.toContain('$red-0: #ffffff;');
		expect(cssContent).not.toContain('"red": {\n    "0": "#ffffff"\n  }');

		// Check SCSS format
		await page.getByRole('tab', { name: 'SCSS', exact: true }).click();
		const scssContent = await page.getByRole('code').textContent();
		expect(scssContent).toContain('$red-0: #ffffff;');
		expect(scssContent).toContain('$red-1: #ff0000;');
		expect(scssContent).toContain('$red-2: #000000;');
		expect(scssContent).not.toContain('$red-3: #00ff00;');
		expect(scssContent).not.toContain('--red-0: #ffffff;');
		expect(scssContent).not.toContain('"red": {\n    "0": "#ffffff"\n  }');

		// Check Tailwind format
		await page.getByRole('tab', { name: 'Tailwind' }).click();
		const tailwindContent = await page.getByRole('code').textContent();
		expect(tailwindContent).toContain('module.exports = {');
		expect(tailwindContent).toContain('"red-0": "#ffffff"');
		expect(tailwindContent).toContain('"red-1": "#ff0000"');
		expect(tailwindContent).toContain('"red-2": "#000000"');
		expect(tailwindContent).not.toContain('"red-3": "#00ff00"');
		expect(tailwindContent).not.toContain('--red-0: #ffffff;');
		expect(tailwindContent).not.toContain('"red": {\n    "0": "#ffffff"\n  }');

		// Check JSON format
		await page.getByRole('tab', { name: 'JSON' }).click();
		const jsonContent = await page.getByRole('code').textContent();
		expect(jsonContent).toContain('"red": {\n    "0": "#ffffff"\n  }');
		expect(jsonContent).toContain('"red": {\n    "1": "#ff0000"\n  }');
		expect(jsonContent).toContain('"red": {\n    "2": "#000000"\n  }');
		expect(jsonContent).not.toContain('"red": {\n    "3": "#00ff00"\n  }');
		expect(jsonContent).not.toContain('--red-0: #ffffff;');
		expect(jsonContent).not.toContain('$red-0: #ffffff;');
		expect(jsonContent).not.toContain('"red-0": "#ffffff"');

		// Verify all formats are different
		expect(cssContent).not.toBe(scssContent);
		expect(cssContent).not.toBe(tailwindContent);
		expect(cssContent).not.toBe(jsonContent);
	});

	test('should copy export text to clipboard', async ({ page }) => {
		await page.getByRole('tab', { name: 'CSS', exact: true }).click();
		await page.getByRole('button', { name: 'Copy' }).click();

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText).toContain('--red-0: #ffffff;');
		expect(clipboardText).toContain('--red-1: #ff0000;');
		expect(clipboardText).toContain('--red-2: #000000;');
		expect(clipboardText).not.toContain('--red-3: #00ff00;');
		expect(clipboardText).not.toContain('$red-0: #ffffff;');
		expect(clipboardText).not.toContain('"red": {\n    "0": "#ffffff"\n  }');
	});
});
