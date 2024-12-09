import { expect, Locator, test } from '@playwright/test';

test.describe('Color card', () => {
	let hexInput: Locator;
	let rgbInput: Locator;
	let hslInput: Locator;

	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		hexInput = page.getByLabel('HEX', { exact: true });
		rgbInput = page.getByLabel('RGB', { exact: true });
		hslInput = page.getByLabel('HSL', { exact: true });
	});

	test('should start with an empty color grid', async ({ page }) => {
		await page.waitForLoadState('domcontentloaded');
		await expect(page.getByRole('button', { name: 'New color' })).toBeVisible();
		expect((await page.locator('form.color').all()).length).toBe(0);
	});

	test('should add a new color when clicking the New color button', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		expect((await page.locator('form.color').all()).length).toBe(1);
	});

	test('should add multiple color cards', async ({ page }) => {
		const newColorButton = page.getByRole('button', { name: 'New color' });
		await newColorButton.click();
		await newColorButton.click();
		await newColorButton.click();

		expect((await page.locator('form.color').all()).length).toBe(3);
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

	test('should display correct number of variants based on steps input', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		const stepsInput = page.getByTitle('Steps');
		await stepsInput.fill('7');

		const variants = page.locator('.variant__box');
		await expect(variants).toHaveCount(7);

		await stepsInput.fill('8');
		await expect(variants).toHaveCount(8);
	});

	test('should update variants when changing easing function', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		const easingSelect = page.getByTitle('Easing function');

		// Set a known color and steps for consistent testing
		await hexInput.fill('#ff0000');
		await hexInput.blur();

		// Set an odd number of steps for ensuring the middle variant is the original color
		await page.getByTitle('Steps').fill('9');

		// Test different easing functions and verify the middle variant changes
		const middleVariant = page.locator('.variant__box').nth(4);

		// Linear (default), expect middle variant to be equal to the original color
		await expect(middleVariant).toHaveAttribute('style', /background-color: #ff0000/);

		// Change to Cubic In Out, expect middle variant to remain the same
		await easingSelect.selectOption('cubicInOut');
		await expect(middleVariant).toHaveAttribute('style', /background-color: #ff0000/);

		// Change to Cubic In, expect middle variant to be different
		await easingSelect.selectOption('cubicIn');
		await expect(middleVariant).not.toHaveAttribute('style', /background-color: #ff0000/);

		// Change to Cubic Out, expect middle variant to be different
		await easingSelect.selectOption('cubicOut');
		await expect(middleVariant).not.toHaveAttribute('style', /background-color: #ff0000/);
	});

	test('should maintain number of variants when updating color input', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await page.getByTitle('Steps').fill('4');
		const variants = page.locator('.variant__box');
		await expect(variants).toHaveCount(4);

		await hexInput.fill('#00ff00');
		await hexInput.blur();
		await expect(variants).toHaveCount(4);
	});

	test('should handle minimum and maximum lightness values', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await hexInput.fill('#ff0000');
		await hexInput.blur();

		const variants = page.locator('.variant__box');

		// First variant should be white (100% lightness)
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ffffff/);

		// Last variant should be black (0% lightness)
		await expect(variants.last()).toHaveAttribute('style', /background-color: #000000/);
	});
});
