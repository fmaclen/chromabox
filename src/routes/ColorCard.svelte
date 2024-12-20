<script lang="ts">
	import { colord, extend } from 'colord';
	import namesPlugin from 'colord/plugins/names';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

	import { colordToSwatch, stringToColor, type Color, type Swatch } from '$lib/colors';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';

	let { color = $bindable() }: { color: Color } = $props();

	// It seems that the ColorPicker component doesn't work as expected when binded
	// to the 'color: Colord' prop. However, it does update the color value when it is
	// binded to the 'hex: string' prop.
	let hex = $state(color.source.hex);

	const tokenNamePlaceholder = $derived(colord(color.source.hex).toName({ closest: true }));

	$effect(() => {
		// Update the picker when the color is changed through the inputs
		hex = color.source.hex;
	});

	$effect(() => {
		// Update the inputs when the color is changed through the picker
		color.source = stringToColor(hex).source;
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

			const variant = colord({
				h: hsl.h,
				s: hsl.s,
				l: lightness
			});
			colorVariants.push(colordToSwatch(variant));
		}

		return colorVariants;
	});

	extend([namesPlugin]);

	const easingFns = {
		linear,
		quadInOut,
		quadIn,
		quadOut
	};

	function handleColorInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (colord(event.target.value).isValid())
			color.source = stringToColor(event.target.value).source;
	}
</script>

<section class="color">
	<fieldset class="color__fieldset color__fieldset--row">
		<input class="input" bind:value={color.tokenName} placeholder={tokenNamePlaceholder} />
		<ButtonCopy content={color.tokenName} />
	</fieldset>

	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

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
		/* These are the styles of the ColorPicker component */
		:global(.color-picker .wrapper) {
			@apply m-0 border-none;
		}

		:global(.text-input) {
			@apply hidden;
		}

		@apply w-fit border-r;
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
		@apply gap-1;
	}

	.select,
	.input {
		@apply w-full rounded-md border px-3 py-1.5;
	}
</style>
