import { expect, Locator, test } from '@playwright/test';

test.describe('Color card', () => {
	let hexInput: Locator;
	let rgbInput: Locator;
	let hslInput: Locator;

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		hexInput = page.getByTestId('hex-input');
		rgbInput = page.getByTestId('rgb-input');
		hslInput = page.getByTestId('hsl-input');
	});

	test('should start with an empty color grid', async ({ page }) => {
		expect((await page.locator('.color-card').all()).length).toBe(0);
	});

	test('should add a new color when clicking the New color button', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		expect((await page.locator('.color-card').all()).length).toBe(1);
	});

	test('should add multiple color cards', async ({ page }) => {
		const newColorButton = page.getByRole('button', { name: 'New color' });
		await newColorButton.click();
		await newColorButton.click();
		await newColorButton.click();

		expect((await page.locator('.color-card').all()).length).toBe(3);
	});

	test('should update color when changing hex value', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await hexInput.fill('#FF0000');
		await hexInput.blur();

		await expect(rgbInput).toHaveValue('rgb(255, 0, 0)');
		await expect(hslInput).toHaveValue('hsl(0, 100%, 50%)');
	});

	test('should update color when changing RGB value', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await rgbInput.fill('rgb(0, 255, 0)');
		await rgbInput.blur();

		await expect(hexInput).toHaveValue('#00ff00');
		await expect(hslInput).toHaveValue('hsl(120, 100%, 50%)');
	});

	test('should update color when changing HSL value', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await hslInput.fill('hsl(240, 100%, 50%)');
		await hslInput.blur();

		await expect(hexInput).toHaveValue('#0000ff');
		await expect(rgbInput).toHaveValue('rgb(0, 0, 255)');
	});

	test('should not update color with invalid input', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await hexInput.fill('#00ff00');
		await hexInput.blur();

		await expect(rgbInput).toHaveValue('rgb(0, 255, 0)');
		await expect(hslInput).toHaveValue('hsl(120, 100%, 50%)');

		await hexInput.fill('invalid-color');
		await hexInput.blur();

		await expect(rgbInput).toHaveValue('rgb(0, 255, 0)');
		await expect(hslInput).toHaveValue('hsl(120, 100%, 50%)');
	});
});
