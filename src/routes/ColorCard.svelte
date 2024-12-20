<script lang="ts">
	import { colord, extend, type Colord } from 'colord';
	import namesPlugin from 'colord/plugins/names';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';

	let { color = $bindable() }: { color: Colord } = $props();

	// It seems that the ColorPicker component doesn't work as expected when binded
	// to the 'color: Colord' prop. However, it does update the color value when it is
	// binded to the 'hex: string' prop.
	let hex = $state(color.toHex());
	let tokenName = $state('');
	let steps = $state(12);
	let easingFn = $state('linear');

	const tokenNamePlaceholder = $derived(color.toName({ closest: true }));

	$effect(() => {
		hex = color.toHex();
	});

	$effect(() => {
		color = colord(hex);
	});

	const variants: Colord[] = $derived.by(() => {
		const colorVariants: Colord[] = [];
		const hsl = color.toHsl();

		const MIN_LIGHTNESS = 0;
		const MAX_LIGHTNESS = 100;
		const RANGE = MAX_LIGHTNESS - MIN_LIGHTNESS;

		for (let i = 0; i < steps; i++) {
			const progress = i / (steps - 1);
			const easedProgress = easingFns[easingFn as keyof typeof easingFns](progress);
			const rangePercentage = RANGE * (1 - easedProgress);
			const lightness = MIN_LIGHTNESS + rangePercentage;

			const variant = colord({
				h: hsl.h,
				s: hsl.s,
				l: lightness
			});
			colorVariants.push(variant);
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
		if (colord(event.target.value).isValid()) color = colord(event.target.value);
	}
</script>

<section class="color">
	<fieldset class="color__fieldset color__fieldset--row">
		<input class="input" bind:value={tokenName} placeholder={tokenNamePlaceholder} />
		<ButtonCopy content={tokenName} />
	</fieldset>

	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

	<fieldset class="color__fieldset">
		<div class="color__input-item">
			<label for="color-hex">HEX</label>
			<div class="color__input-copy">
				<input class="input" id="color-hex" type="text" value={color.toHex()} onblur={handleColorInput} />
				<ButtonCopy content={color.toHex()} />
			</div>
		</div>

		<div class="color__input-item">
			<label for="color-rgb">RGB</label>
			<div class="color__input-copy">
				<input class="input"  id="color-rgb" type="text" value={color.toRgbString()} onblur={handleColorInput} />
				<ButtonCopy content={color.toRgbString()} />
			</div>
		</div>

		<div class="color__input-item">
			<label for="color-hsl">HSL</label>
			<div class="color__input-copy">
				<input class="input"  id="color-hsl" type="text" value={color.toHslString()} onblur={handleColorInput} />
				<ButtonCopy content={color.toHslString()} />
			</div>
		</div>
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--row">
		<select bind:value={easingFn} title="Easing" class="select" >
			<option value="linear">Linear</option>
			<option value="quadInOut">Quad In Out</option>
			<option value="quadIn">Quad In</option>
			<option value="quadOut">Quad Out</option>
		</select>

		<input class="input" type="number" bind:value={steps} title="Steps" />
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--variants">
		{#each variants as variant}
				<div class="variant" style={`background-color: ${variant.toHex()}`}>
					<p class="variant__color">{variant.toHex()}</p>
					<ButtonCopy content={variant.toHex()} />
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
		@apply p-0 gap-0;
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
		@apply w-full border px-3 py-1.5 rounded-md;
	}
</style>
