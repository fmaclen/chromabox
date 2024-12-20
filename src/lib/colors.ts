import { colord, extend, type Colord } from 'colord';
import namesPlugin from 'colord/plugins/names';

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

function colordToSwatch(colord: Colord): Swatch {
	return {
		hex: colord.toHex(),
		rgb: colord.toRgb(),
		rgbString: colord.toRgbString(),
		hsl: colord.toHsl(),
		hslString: colord.toHslString()
	};
}

function colordToColor(colord: Colord): Color {
	return {
		source: colordToSwatch(colord),
		easingFn: 'linear',
		steps: 12,
		variants: [],
		tokenName: ''
	};
}

export function stringToColor(colorString: string): Color {
	return colordToColor(colord(colorString));
}

export function getClosestCSSColorName(colorString: string): string {
	return colord(colorString).toName({ closest: true }) ?? '';
}

export function isColorValid(colorString: string): boolean {
	return colord(colorString).isValid();
}

export function hslToColor(hsl: { h: number; s: number; l: number }): Color {
	return colordToColor(colord({ ...hsl }));
}
