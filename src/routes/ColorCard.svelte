<script lang="ts">
	import { colord, extend, type Colord } from 'colord';
	import namesPlugin from 'colord/plugins/names';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

	import ButtonCopy from '$lib/components/ButtonCopy.svelte';

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

<form class="color">
	<div class="color__token">
		<input bind:value={tokenName} placeholder={tokenNamePlaceholder} />
		<ButtonCopy content={tokenName} />
	</div>

	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

	<fieldset class="color__fieldset">
		<div class="color__input-item">
			<label for="color-hex">HEX</label>
			<div class="color__input-copy">
				<input id="color-hex" type="text" value={color.toHex()} onblur={handleColorInput} />
				<ButtonCopy content={color.toHex()} />
			</div>
		</div>

		<div class="color__input-item">
			<label for="color-rgb">RGB</label>
			<div class="color__input-copy">
				<input id="color-rgb" type="text" value={color.toRgbString()} onblur={handleColorInput} />
				<ButtonCopy content={color.toRgbString()} />
			</div>
		</div>

		<div class="color__input-item">
			<label for="color-hsl">HSL</label>
			<div class="color__input-copy">
				<input id="color-hsl" type="text" value={color.toHslString()} onblur={handleColorInput} />
				<ButtonCopy content={color.toHslString()} />
			</div>
		</div>
	</fieldset>

	<div class="variants__controls">
		<select bind:value={easingFn} title="Easing">
			<option value="linear">Linear</option>
			<option value="quadInOut">Quad In Out</option>
			<option value="quadIn">Quad In</option>
			<option value="quadOut">Quad Out</option>
		</select>

		<input type="number" bind:value={steps} title="Steps" />
	</div>

	<div class="variants">
		{#each variants as variant}
			<div class="variant__box" style={`background-color: ${variant.toHex()}`}>
				<p class="variant__text">{variant.toHex()}</p>
				<ButtonCopy content={variant.toHex()} />
			</div>
		{/each}
	</div>
</form>

<style lang="postcss">
	form.color {
		/* These are the styles of the ColorPicker component */
		:global(.color-picker .wrapper) {
			margin: 0;
			border: none;
		}
		:global(.text-input) {
			display: none;
		}

		@apply w-fit border-r p-2.5;
	}

	.color__token {
		display: flex;
		gap: 5px;
	}

	.color__token input {
		width: 100%;
	}

	fieldset.color__fieldset {
		display: flex;
		flex-direction: column;
		gap: 5px;
		border: none;
		padding: 0;
		margin: 0;
	}

	.color__input-item {
		display: flex;
		gap: 10px;
	}

	.color__input-item input {
		width: 100%;
	}

	.color__input-copy {
		display: flex;
		gap: 5px;
		width: 100%;
	}

	.variants__controls {
		margin-top: 10px;
		width: 100%;
		display: flex;
		gap: 5px;
	}

	.variants {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-top: 10px;
	}

	.variants__controls select,
	.variants__controls input {
		width: 100%;
	}

	.variant__box {
		display: flex;
		align-items: center;
		padding: 0 10px;
		height: 30px;
		border-radius: 5px;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.variant__text {
		color: white;
	}

	.variant__box {
		justify-content: space-between;
	}
</style>
