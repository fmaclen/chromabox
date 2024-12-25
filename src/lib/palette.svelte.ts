import { colord, extend, random, type Colord } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { getContext, setContext } from 'svelte';
import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

extend([namesPlugin]);

const easingFns = { linear, quadInOut, quadIn, quadOut };

export interface Color {
	source: Swatch;
	easingFn: string;
	steps: number;
	variants: Swatch[];
	tokenName: string;
}

export interface Swatch {
	hex: string;
	rgb: { r: number; g: number; b: number };
	rgbString: string;
	hsl: { h: number; s: number; l: number };
	hslString: string;
	isDark: boolean;
}

export class Palette {
	colors = $state<Color[]>([]);

	newColor() {
		this.colors.push(this.stringToColor(random().toHex()));
	}

	stringToColor(colorString: string): Color {
		return this.colordToColor(colord(colorString));
	}

	getClosestCSSColorName(colorString: string): string {
		return colord(colorString).toName({ closest: true }) ?? '';
	}

	isColorValid(colorString: string): boolean {
		return colord(colorString).isValid();
	}

	hslToColor(hsl: { h: number; s: number; l: number }): Color {
		return this.colordToColor(colord({ ...hsl }));
	}

	updateColorVariants(color: Color) {
		color.variants = this.generateVariants(color);
	}

	private colordToSwatch(colord: Colord): Swatch {
		return {
			hex: colord.toHex(),
			rgb: colord.toRgb(),
			rgbString: colord.toRgbString(),
			hsl: colord.toHsl(),
			hslString: colord.toHslString(),
			isDark: colord.isDark()
		};
	}

	private colordToColor(colord: Colord): Color {
		return {
			source: this.colordToSwatch(colord),
			easingFn: 'linear',
			steps: 12,
			variants: [],
			tokenName: ''
		};
	}

	private generateVariants(color: Color): Swatch[] {
		const colorVariants: Swatch[] = [];
		const hsl = color.source.hsl;

		const MIN_LIGHTNESS = 0;
		const MAX_LIGHTNESS = 100;
		const RANGE = MAX_LIGHTNESS - MIN_LIGHTNESS;

		for (let i = 0; i < color.steps; i++) {
			const progress = i / (color.steps - 1);
			const easedProgress = this.getEasingValue(color.easingFn, progress);
			const rangePercentage = RANGE * (1 - easedProgress);
			const lightness = MIN_LIGHTNESS + rangePercentage;

			const variant = this.hslToColor({ ...hsl, l: lightness });
			colorVariants.push(variant.source);
		}

		return colorVariants;
	}

	private getEasingValue(easingFn: string, progress: number): number {
		return easingFns[easingFn as keyof typeof easingFns](progress);
	}
}

const PALETTE_CONTEXT_KEY = Symbol('PALETTE');

export function setPaletteContext() {
	return setContext(PALETTE_CONTEXT_KEY, new Palette());
}

export function getPaletteContext() {
	return getContext<ReturnType<typeof setPaletteContext>>(PALETTE_CONTEXT_KEY);
}
