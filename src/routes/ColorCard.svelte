<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { getPaletteContext, type Color, type Swatch } from '$lib/palette.svelte';

	let { color = $bindable() }: { color: Color } = $props();

	const paletteContext = getPaletteContext();

	const tokenNamePlaceholder = $derived(paletteContext.getClosestCSSColorName(color.source.hex));

	$effect(() => {
		// When the color is changed through the color picker, update all the other formats
		// but not hex since it would create an infinite loop.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { hex: _, ...otherFormats } = paletteContext.stringToColor(color.source.hex).source;
		Object.assign(color.source, otherFormats);
	});

	$effect(() => {
		// This $effect is used to update the color variants.
		// Assigning the variants without copying the object triggers an infinite render loop
		// for some reason. Reference of this approach:
		// https://github.com/sveltejs/svelte/issues/11938#issuecomment-2153699547
		const colorCopy = color;
		colorCopy.variants = paletteContext.generateVariants(color.source, color.steps, color.easingFn);
	});

	function handleColorInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (paletteContext.isColorValid(event.target.value))
			color.source = paletteContext.stringToColor(event.target.value).source;
	}
</script>

<section
	class="color"
	in:fly={{ y: 64, duration: 150, easing: quadInOut }}
	out:fade={{ duration: 75 }}
>
	<fieldset class="color__fieldset color__fieldset--row">
		<input
			name="token"
			class="input"
			bind:value={color.tokenName}
			placeholder={tokenNamePlaceholder}
		/>
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
			<label class="color__input-label">
				HEX
				<input
					name="hex"
					class="input"
					type="text"
					value={color.source.hex}
					onblur={handleColorInput}
				/>
			</label>
			<ButtonCopy content={color.source.hex} />
		</div>

		<div class="color__input-item">
			<label class="color__input-label">
				RGB
				<input
					name="rgb"
					class="input"
					type="text"
					value={color.source.rgbString}
					onblur={handleColorInput}
				/>
			</label>
			<ButtonCopy content={color.source.rgbString} />
		</div>

		<div class="color__input-item">
			<label class="color__input-label">
				HSL
				<input
					name="hsl"
					class="input"
					type="text"
					value={color.source.hslString}
					onblur={handleColorInput}
				/>
			</label>
			<ButtonCopy content={color.source.hslString} />
		</div>
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--row">
		<select name="easing" bind:value={color.easingFn} title="Easing" class="select">
			<option value="linear">Linear</option>
			<option value="quadInOut">Quad In Out</option>
			<option value="quadIn">Quad In</option>
			<option value="quadOut">Quad Out</option>
		</select>

		<input name="steps" class="input" type="number" bind:value={color.steps} title="Steps" />
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--variants">
		{#each color.variants as variant}
			<div
				class="variant"
				class:variant--dark={variant.isDark}
				style={`background-color: ${variant.hex}`}
			>
				<p class="variant__color">{variant.hex}</p>
				<ButtonCopy content={variant.hex} />
			</div>
		{/each}
	</fieldset>
</section>

<style lang="postcss">
	section.color {
		@apply w-min border-r;

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

	.variant--dark {
		@apply text-white;
	}

	.color__input-item {
		@apply flex flex-row items-center gap-1;
	}

	.color__input-label {
		@apply flex flex-row items-center gap-2;
	}

	.select,
	.input {
		@apply w-full rounded-md border px-3 py-1.5;
	}
</style>
