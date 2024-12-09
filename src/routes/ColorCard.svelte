<script lang="ts">
	import { colord, type Colord } from 'colord';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { linear, quadIn, quadInOut, quadOut } from 'svelte/easing';

	let { color = $bindable() }: { color: Colord } = $props();

	// It seems that the ColorPicker component doesn't work as expected when binded
	// to the 'color: Colord' prop. However, it does update the color value when it is
	// binded to the 'hex: string' prop.
	let hex = $state(color.toHex());
	let steps = $state(12);
	let easingFn = $state('linear');

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
	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

	<fieldset class="color__fieldset">
		<div class="color__input-item">
			<label for="color-hex">HEX</label>
			<input id="color-hex" type="text" value={color.toHex()} onblur={handleColorInput} />
		</div>

		<div class="color__input-item">
			<label for="color-rgb">RGB</label>
			<input id="color-rgb" type="text" value={color.toRgbString()} onblur={handleColorInput} />
		</div>

		<div class="color__input-item">
			<label for="color-hsl">HSL</label>
			<input id="color-hsl" type="text" value={color.toHslString()} onblur={handleColorInput} />
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
			</div>
		{/each}
	</div>
</form>

<style>
	form.color {
		/* These are the styles of the ColorPicker component */
		:global(.color-picker .wrapper) {
			margin: 0;
			border: none;
		}
		:global(.text-input) {
			display: none;
		}
		width: fit-content;
		padding: 10px;
		border: 1px solid rgba(0, 0, 0, 0.25);
		border-radius: 10px;
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
</style>
