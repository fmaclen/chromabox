import { colord, extend, random, type Colord } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { getContext, setContext } from 'svelte';
import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

import { PUBLIC_IS_DEMO } from '$env/static/public';

extend([namesPlugin]);

const DEFAULT_COLOR_PALETTE = ['#008CFF', '#A600FF', '#F600FF', '#FF0004', '#FF9000', '#FFBF00'];
const easingFns = { linear, quadInOut, quadIn, quadOut };

interface VariantsRange {
	property: 'h' | 's' | 'l';
	start: number;
	end: number;
}

export interface Color {
	source: Swatch;
	easingFn: string;
	steps: number;
	tokenName: string;
	variants: Swatch[];
	variantsRange: VariantsRange;
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

	constructor() {
		if (!PUBLIC_IS_DEMO) return;
		this.colors = DEFAULT_COLOR_PALETTE.map((color) => this.stringToColor(color));
	}

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

	updateColorVariants(color: Color) {
		color.variants = this.generateVariants(color);
	}

	private hslToSwatch(hsl: { h: number; s: number; l: number }): Swatch {
		return this.colordToSwatch(colord({ ...hsl }));
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
		const color = {
			source: this.colordToSwatch(colord),
			easingFn: 'linear',
			steps: 12,
			tokenName: '',
			variantsRange: {
				property: 'l',
				start: 0,
				end: 100
			} as VariantsRange,
			variants: []
		};
		return { ...color, variants: this.generateVariants(color) };
	}

	private generateVariants(color: Color): Swatch[] {
		const colorVariants: Swatch[] = [];
		const { h, s, l } = color.source.hsl;
		const { start = 0, end = 100, property = 'l' } = color.variantsRange;
		const range = end - start;

		for (let i = 0; i < color.steps; i++) {
			const progress = i / (color.steps - 1);
			const easedProgress = easingFns[color.easingFn as keyof typeof easingFns](progress);
			const rangePercentage = range * (1 - easedProgress);
			const hsl = { h, s, l, [property]: start + rangePercentage };

			const variant = this.hslToSwatch(hsl);
			colorVariants.push(variant);
		}

		return colorVariants;
	}
}

const PALETTE_CONTEXT_KEY = Symbol('PALETTE');

export function setPaletteContext() {
	return setContext(PALETTE_CONTEXT_KEY, new Palette());
}

export function getPaletteContext() {
	return getContext<ReturnType<typeof setPaletteContext>>(PALETTE_CONTEXT_KEY);
}
