import { expect, test } from '@playwright/test';

test.describe('Favicon', () => {
	test('changes when colors change', async ({ page }) => {
		await page.goto('/');

		// Wait for favicon to have a non-empty href attribute
		await page.waitForFunction(() => {
			const favicon = document.querySelector('link[rel="icon"]');
			return favicon && favicon.getAttribute('href')?.includes('data:image/svg+xml');
		});

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

		// Add a fourth color
		await page.getByRole('button', { name: 'New color' }).click();
		const fourColors = await favicon.getAttribute('href');
		expect(fourColors).not.toBe(defaultColors);
		expect(fourColors).not.toBe(oneColor);
		expect(fourColors).not.toBe(twoColors);
		expect(fourColors).not.toBe(threeColors);

		// Add a fifth color
		await page.getByRole('button', { name: 'New color' }).click();
		const fiveColors = await favicon.getAttribute('href');
		expect(fiveColors).not.toBe(defaultColors);
		expect(fiveColors).not.toBe(oneColor);
		expect(fiveColors).not.toBe(twoColors);
		expect(fiveColors).not.toBe(threeColors);
		expect(fiveColors).not.toBe(fourColors);

		// Add a sixth color
		await page.getByRole('button', { name: 'New color' }).click();
		const sixColors = await favicon.getAttribute('href');
		expect(sixColors).not.toBe(defaultColors);
		expect(sixColors).not.toBe(oneColor);
		expect(sixColors).not.toBe(twoColors);
		expect(sixColors).not.toBe(threeColors);
		expect(sixColors).not.toBe(fourColors);
		expect(sixColors).not.toBe(fiveColors);

		// Favicon supports only 6 colors, so the seventh color is ignored
		await page.getByRole('button', { name: 'New color' }).click();
		const sevenColors = await favicon.getAttribute('href');
		expect(sevenColors).not.toBe(defaultColors);
		expect(sevenColors).not.toBe(oneColor);
		expect(sevenColors).not.toBe(twoColors);
		expect(sevenColors).not.toBe(threeColors);
		expect(sevenColors).not.toBe(fourColors);
		expect(sevenColors).not.toBe(fiveColors);
		expect(sevenColors).toBe(sixColors);

		// Update the first color from the color picker
		const colorCard = page.locator('.color').first();
		const firstColorHex = await colorCard.getByLabel('HEX', { exact: true }).inputValue();
		const picker = colorCard.locator('.picker').first();
		const box = await picker.boundingBox();

		// Click in the middle of the picker
		if (box) {
			await picker.click({
				position: {
					x: box.width / 2,
					y: box.height / 2
				}
			});
		}

		// Check the value in HEX has changed from the color picker
		expect(await colorCard.getByLabel('HEX', { exact: true }).inputValue()).not.toBe(firstColorHex);

		// Check the favicon has changed
		const updatedColors = await favicon.getAttribute('href');
		expect(updatedColors).not.toBe(defaultColors);
		expect(updatedColors).not.toBe(oneColor);
		expect(updatedColors).not.toBe(twoColors);
		expect(updatedColors).not.toBe(threeColors);
		expect(updatedColors).not.toBe(fourColors);
	});
});
