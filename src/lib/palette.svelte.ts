import { colord, extend, type Colord } from 'colord';
import namesPlugin from 'colord/plugins/names';
import { getContext, setContext } from 'svelte';

extend([namesPlugin]);

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
}

export class Palette {
	colors = $state<Color[]>([]);

	private colordToSwatch(colord: Colord): Swatch {
		return {
			hex: colord.toHex(),
			rgb: colord.toRgb(),
			rgbString: colord.toRgbString(),
			hsl: colord.toHsl(),
			hslString: colord.toHslString()
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
}

const PALETTE_CONTEXT_KEY = Symbol('PALETTE');

export function setPaletteState() {
	return setContext(PALETTE_CONTEXT_KEY, new Palette());
}

export function getPaletteState() {
	return getContext<ReturnType<typeof setPaletteState>>(PALETTE_CONTEXT_KEY);
}
