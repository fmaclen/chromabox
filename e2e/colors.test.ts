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
		expect((await page.locator('section.color').all()).length).toBe(0);
	});

	test('should add a new color when clicking the New color button', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		expect((await page.locator('section.color').all()).length).toBe(1);
	});

	test('should add multiple color cards', async ({ page }) => {
		const newColorButton = page.getByRole('button', { name: 'New color' });
		await newColorButton.click();
		await newColorButton.click();
		await newColorButton.click();

		expect((await page.locator('section.color').all()).length).toBe(3);
	});

	test('should update color when changing hex value', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		const swatch = page.locator('.swatch');
		await expect(swatch).toBeVisible();
		await expect(swatch).not.toHaveAttribute('style', /background-color: #ff0000/);

		await hexInput.fill('#FF0000');
		await hexInput.blur();

		await expect(rgbInput).toHaveValue('rgb(255, 0, 0)');
		await expect(hslInput).toHaveValue('hsl(0, 100%, 50%)');
		await expect(swatch).toHaveAttribute('style', /background-color: #ff0000/);
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

	test('should use default values for variants range', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await expect(page.getByLabel('Property')).toHaveValue('l');
		await expect(page.getByLabel('Start')).toHaveValue('0');
		await expect(page.getByLabel('End')).toHaveValue('100');
	});

	test('should display correct number of variants based on steps input', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		const variants = page.locator('.variant');
		const stepsInput = page.getByLabel('Steps');
		await expect(variants).toHaveCount(12);
		await expect(variants).not.toHaveCount(7);

		await stepsInput.fill('-1');
		await expect(variants).toHaveCount(0);
		await expect(stepsInput).toHaveAttribute('min', '0');

		await stepsInput.fill('7');
		await expect(variants).toHaveCount(7);
		await expect(variants).not.toHaveCount(12);

		await stepsInput.fill('8');
		await expect(variants).toHaveCount(8);
		await expect(variants).not.toHaveCount(7);
		await expect(variants).not.toHaveCount(12);
	});

	test('should update lightness variants when changing easing function', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		const easingSelect = page.getByLabel('Easing');

		// Set colors for consistent testing
		const originalColor = '#ff0000';
		const linearExpectedSecondColor = 'background-color: #ffd1d1;';
		const linearExpectedPenultimateColor = 'background-color: #2e0000;';
		const quadInOutExpectedSecondColor = 'background-color: #fff7f7;';
		const quadInOutExpectedPenultimateColor = 'background-color: #080000;';
		const quadInExpectedSecondColor = 'background-color: #fffbfb;';
		const quadInExpectedPenultimateColor = 'background-color: #590000;';
		const quadOutExpectedSecondColor = 'background-color: #ffa6a6;';
		const quadOutExpectedPenultimateColor = 'background-color: #040000;';

		await hexInput.fill(originalColor);
		await hexInput.blur();

		const secondVariant = page.locator('.variant').nth(1);
		const penultimateVariant = page.locator('.variant').nth(10);

		// Store initial values with linear easing (default)
		const linearSecondColor = await secondVariant.getAttribute('style');
		const linearPenultimateColor = await penultimateVariant.getAttribute('style');

		// Verify colors are correct for linear easing
		expect(linearSecondColor).toBe(linearExpectedSecondColor);
		expect(linearPenultimateColor).toBe(linearExpectedPenultimateColor);

		// Change to Quad In Out
		await easingSelect.selectOption('quadInOut');
		const quadInOutSecondColor = await secondVariant.getAttribute('style');
		const quadInOutPenultimateColor = await penultimateVariant.getAttribute('style');

		// Verify colors are correct and changed from linear
		expect(quadInOutSecondColor).toBe(quadInOutExpectedSecondColor);
		expect(quadInOutPenultimateColor).toBe(quadInOutExpectedPenultimateColor);
		expect(quadInOutSecondColor).not.toBe(linearSecondColor);
		expect(quadInOutPenultimateColor).not.toBe(linearPenultimateColor);

		// Change to Quad In
		await easingSelect.selectOption('quadIn');
		const quadInSecondColor = await secondVariant.getAttribute('style');
		const quadInPenultimateColor = await penultimateVariant.getAttribute('style');

		// Verify colors are correct and changed from quad-in-out and linear
		expect(quadInSecondColor).toBe(quadInExpectedSecondColor);
		expect(quadInPenultimateColor).toBe(quadInExpectedPenultimateColor);
		expect(quadInSecondColor).not.toBe(quadInOutSecondColor);
		expect(quadInPenultimateColor).not.toBe(quadInOutPenultimateColor);
		expect(quadInSecondColor).not.toBe(linearSecondColor);
		expect(quadInPenultimateColor).not.toBe(linearPenultimateColor);

		// Change to Quad Out
		await easingSelect.selectOption('quadOut');
		const quadOutSecondColor = await secondVariant.getAttribute('style');
		const quadOutPenultimateColor = await penultimateVariant.getAttribute('style');

		// Verify colors are correct and changed from quad-in, quad-in-out and linear
		expect(quadOutSecondColor).toBe(quadOutExpectedSecondColor);
		expect(quadOutPenultimateColor).toBe(quadOutExpectedPenultimateColor);
		expect(quadOutSecondColor).not.toBe(quadInSecondColor);
		expect(quadOutPenultimateColor).not.toBe(quadInPenultimateColor);
		expect(quadOutSecondColor).not.toBe(quadInOutSecondColor);
		expect(quadOutPenultimateColor).not.toBe(quadInOutPenultimateColor);
		expect(quadOutSecondColor).not.toBe(linearSecondColor);
		expect(quadOutPenultimateColor).not.toBe(linearPenultimateColor);
	});

	test('should maintain number of variants when updating color input', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await page.getByLabel('Steps').fill('4');
		const variants = page.locator('.variant');
		await expect(variants).toHaveCount(4);

		await hexInput.fill('#00ff00');
		await hexInput.blur();
		await expect(variants).toHaveCount(4);
	});

	test('should handle minimum and maximum lightness values', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		const variants = page.locator('.variant');

		// First variant should be white (100% lightness)
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ffffff/);

		// Last variant should be black (0% lightness)
		await expect(variants.last()).toHaveAttribute('style', /background-color: #000000/);
	});

	test('should update variants when changing variants range options', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		await hexInput.fill('#ff0000');
		await hexInput.blur();

		const variants = page.locator('.variant');
		const propertySelect = page.getByLabel('Property');
		const startInput = page.getByLabel('Start');
		const endInput = page.getByLabel('End');

		// Test default lightness variants (0-100%)
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ffffff/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #000000/);

		// Test lightness with custom range (25-75%)
		await startInput.fill('25');
		await endInput.fill('75');
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ff8080/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #800000/);
		await expect(variants.first()).not.toHaveAttribute('style', /background-color: #ffffff/);
		await expect(variants.last()).not.toHaveAttribute('style', /background-color: #000000/);

		// Test hue variants (0-360 degrees)
		await propertySelect.selectOption('Hue');
		await startInput.fill('0');
		await endInput.fill('360');
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ff0000/);
		await expect(variants.nth(2)).toHaveAttribute('style', /background-color: #e800ff/);
		await expect(variants.nth(5)).toHaveAttribute('style', /background-color: #00b9ff/);
		await expect(variants.nth(9)).toHaveAttribute('style', /background-color: #e8ff00/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #ff0000/);
		await expect(variants.first()).not.toHaveAttribute('style', /background-color: #ff9f9f/);
		await expect(variants.last()).not.toHaveAttribute('style', /background-color: #400000/);

		// Test hue with custom range (120-240 degrees)
		await startInput.fill('120');
		await endInput.fill('240');
		await expect(variants.first()).toHaveAttribute('style', /background-color: #0000ff/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #00ff00/);

		// Test saturation variants (0-100%)
		await propertySelect.selectOption('Saturation');
		await startInput.fill('0');
		await endInput.fill('100');
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ff0000/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #808080/);
		await expect(variants.first()).not.toHaveAttribute('style', /background-color: #00ff00/);
		await expect(variants.last()).not.toHaveAttribute('style', /background-color: #0000ff/);

		// Test saturation with custom range (25-75%)
		await startInput.fill('25');
		await endInput.fill('75');
		await expect(variants.first()).toHaveAttribute('style', /background-color: #df2020/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #9f6060/);
	});

	test('should reverse variants range', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		const variants = page.locator('.variant');
		const reverseButton = page.getByRole('button', { name: 'Reverse' });
		await expect(variants.first()).toHaveAttribute('style', /background-color: #ffffff/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #000000/);

		await reverseButton.click();
		await expect(variants.first()).toHaveAttribute('style', /background-color: #000000/);
		await expect(variants.last()).toHaveAttribute('style', /background-color: #ffffff/);
		await expect(variants.first()).not.toHaveAttribute('style', /background-color: #ffffff/);
		await expect(variants.last()).not.toHaveAttribute('style', /background-color: #000000/);
	});

	test('should remove multiple colors when clicking Reset', async ({ page }) => {
		const newColorButton = page.getByRole('button', { name: 'New color' });
		const resetButton = page.getByRole('button', { name: 'Reset' });
		const colors = page.locator('section.color');

		await expect(colors).toHaveCount(0);
		await expect(resetButton).toBeDisabled();

		await newColorButton.click();
		await expect(colors).toHaveCount(1);
		await expect(resetButton).toBeEnabled();

		await resetButton.click();
		await expect(colors).toHaveCount(0);
		await expect(resetButton).toBeDisabled();

		await newColorButton.click();
		await newColorButton.click();
		await newColorButton.click();
		await expect(colors).toHaveCount(3);
		await expect(resetButton).toBeEnabled();

		await resetButton.click();
		await expect(colors).toHaveCount(0);
		await expect(resetButton).toBeDisabled();
	});

	test('should copy color values from input fields and from variants', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();

		await hexInput.fill('#ff0000');
		await hexInput.blur();

		await page.locator('.field', { hasText: 'HEX' }).getByRole('button', { name: 'Copy' }).click();
		const hexClipboard = await page.evaluate(() => navigator.clipboard.readText());
		expect(hexClipboard).toBe('#ff0000');

		await page.locator('.field', { hasText: 'RGB' }).getByRole('button', { name: 'Copy' }).click();
		const rgbClipboard = await page.evaluate(() => navigator.clipboard.readText());
		expect(rgbClipboard).toBe('rgb(255, 0, 0)');

		await page.locator('.field', { hasText: 'HSL' }).getByRole('button', { name: 'Copy' }).click();
		const hslClipboard = await page.evaluate(() => navigator.clipboard.readText());
		expect(hslClipboard).toBe('hsl(0, 100%, 50%)');

		await page.getByLabel('Steps').fill('3');

		// Test copying first variant (should be white)
		await page.locator('.variant').nth(0).getByRole('button', { name: 'Copy' }).click();
		const firstVariantClipboard = await page.evaluate(() => navigator.clipboard.readText());
		expect(firstVariantClipboard).toBe('#ffffff');

		// Test copying middle variant (should be the original color)
		await page.locator('.variant').nth(1).getByRole('button', { name: 'Copy' }).click();
		const middleVariantClipboard = await page.evaluate(() => navigator.clipboard.readText());
		expect(middleVariantClipboard).toBe('#ff0000');

		// Test copying last variant (should be black)
		await page.locator('.variant').nth(2).getByRole('button', { name: 'Copy' }).click();
		const lastVariantClipboard = await page.evaluate(() => navigator.clipboard.readText());
		expect(lastVariantClipboard).toBe('#000000');
	});

	test('should display correct token name placeholder based on color', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		const tokenInput = page.locator('#color-token-0');

		await hexInput.fill('#ff0000');
		await hexInput.blur();
		await expect(tokenInput).toHaveAttribute('placeholder', 'red');

		await hexInput.fill('#ff6347');
		await hexInput.blur();
		await expect(tokenInput).toHaveAttribute('placeholder', 'tomato');

		await hexInput.fill('#7fffd4');
		await hexInput.blur();
		await expect(tokenInput).toHaveAttribute('placeholder', 'aquamarine');

		// Test color similar to aquamarine
		await hexInput.fill('#7fffd5');
		await hexInput.blur();
		await expect(tokenInput).toHaveAttribute('placeholder', 'aquamarine');

		// Copy button shouldn't be visible if token input is empty
		const tokenField = page.getByTitle('Token');
		await expect(tokenField.getByRole('button', { name: 'Copy' })).not.toBeVisible();

		await tokenInput.fill('border');
		await expect(tokenField.getByRole('button', { name: 'Copy' })).toBeVisible();
	});

	test('variants labels should have enough contrast', async ({ page }) => {
		await page.getByRole('button', { name: 'New color' }).click();
		await hexInput.fill('#fafafa');
		await hexInput.blur();

		const lightVariants = page.locator('.variant:not(.variant--dark)');
		const darkVariants = page.locator('.variant--dark');

		await expect(lightVariants).toHaveCount(6);
		await expect(darkVariants).toHaveCount(6);
	});
});
