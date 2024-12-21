<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

	import { getColorsState, type Color, type Swatch } from '$lib/colors.svelte';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';

	let { color = $bindable() }: { color: Color } = $props();

	const paletteStore = getColorsState();

	const tokenNamePlaceholder = $derived(paletteStore.getClosestCSSColorName(color.source.hex));

	$effect(() => {
		// When the color is changed through the color picker, update all the other formats
		// but not hex since it would create an infinite loop.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { hex: _, ...otherFormats } = paletteStore.stringToColor(color.source.hex).source;
		Object.assign(color.source, otherFormats);
	});

	const variants: Swatch[] = $derived.by(() => {
		const colorVariants: Swatch[] = [];
		const hsl = color.source.hsl;

		const MIN_LIGHTNESS = 0;
		const MAX_LIGHTNESS = 100;
		const RANGE = MAX_LIGHTNESS - MIN_LIGHTNESS;

		for (let i = 0; i < color.steps; i++) {
			const progress = i / (color.steps - 1);
			const easedProgress = easingFns[color.easingFn as keyof typeof easingFns](progress);
			const rangePercentage = RANGE * (1 - easedProgress);
			const lightness = MIN_LIGHTNESS + rangePercentage;

			const variant = paletteStore.hslToColor({ ...hsl, l: lightness });
			colorVariants.push(variant.source);
		}

		return colorVariants;
	});

	const easingFns = {
		linear,
		quadInOut,
		quadIn,
		quadOut
	};

	function handleColorInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (paletteStore.isColorValid(event.target.value))
			color.source = paletteStore.stringToColor(event.target.value).source;
	}
</script>

<section class="color">
	<fieldset class="color__fieldset color__fieldset--row">
		<input class="input" bind:value={color.tokenName} placeholder={tokenNamePlaceholder} />
		<ButtonCopy content={color.tokenName} />
	</fieldset>

	<Divider />

	<ColorPicker
		bind:hex={color.source.hex}
		components={ChromeVariant}
		isDialog={false}
		sliderDirection="horizontal"
	/>

	<fieldset class="color__fieldset">
		<div class="color__input-item">
			<label for="color-hex">HEX</label>
			<div class="color__input-copy">
				<input
					class="input"
					id="color-hex"
					type="text"
					value={color.source.hex}
					onblur={handleColorInput}
				/>
				<ButtonCopy content={color.source.hex} />
			</div>
		</div>

		<div class="color__input-item">
			<label for="color-rgb">RGB</label>
			<div class="color__input-copy">
				<input
					class="input"
					id="color-rgb"
					type="text"
					value={color.source.rgbString}
					onblur={handleColorInput}
				/>
				<ButtonCopy content={color.source.rgbString} />
			</div>
		</div>

		<div class="color__input-item">
			<label for="color-hsl">HSL</label>
			<div class="color__input-copy">
				<input
					class="input"
					id="color-hsl"
					type="text"
					value={color.source.hslString}
					onblur={handleColorInput}
				/>
				<ButtonCopy content={color.source.hslString} />
			</div>
		</div>
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--row">
		<select bind:value={color.easingFn} title="Easing" class="select">
			<option value="linear">Linear</option>
			<option value="quadInOut">Quad In Out</option>
			<option value="quadIn">Quad In</option>
			<option value="quadOut">Quad Out</option>
		</select>

		<input class="input" type="number" bind:value={color.steps} title="Steps" />
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--variants">
		{#each variants as variant}
			<div class="variant" style={`background-color: ${variant.hex}`}>
				<p class="variant__color">{variant.hex}</p>
				<ButtonCopy content={variant.hex} />
			</div>
		{/each}
	</fieldset>
</section>

<style lang="postcss">
	section.color {
		@apply max-w-min border-r;

		/* These are the styles of the ColorPicker component */
		:global(.color-picker .wrapper) {
			@apply m-0 border-none p-2;
		}

		:global(.text-input) {
			@apply hidden;
		}
	}

	fieldset.color__fieldset {
		@apply m-0 flex flex-col gap-1 border-none p-2;
	}

	fieldset.color__fieldset--row {
		@apply flex-row gap-2;
	}

	fieldset.color__fieldset--variants {
		@apply gap-0 p-0;
	}

	.variant {
		@apply flex flex-row items-center justify-between gap-2 p-2;
	}

	.color__input-copy,
	.color__input-item {
		@apply flex flex-row items-center gap-2;
	}

	.color__input-item {
		@apply gap-2;
	}

	.color__input-copy {
		@apply w-full gap-1;
	}

	.select,
	.input {
		@apply w-full rounded-md border px-3 py-1.5;
	}
</style>
