<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { getPaletteContext, type Color } from '$lib/palette.svelte';

	let { color = $bindable(), index }: { color: Color; index: number } = $props();

	const palette = getPaletteContext();

	const tokenNamePlaceholder = $derived(palette.getClosestCSSColorName(color.source.hex));

	$effect(() => {
		// When the color is changed through the color picker, update all the other formats
		// but not hex since it would create an infinite loop.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { hex: _, ...otherFormats } = palette.stringToColor(color.source.hex).source;
		Object.assign(color.source, otherFormats);
	});

	$effect(() => palette.updateColorVariants(color));

	function handleColorInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (palette.isColorValid(event.target.value))
			color.source = palette.stringToColor(event.target.value).source;
	}
</script>

<section
	class="color"
	in:fly={{ y: 64, duration: 150, easing: quadInOut }}
	out:fade={{ duration: 75 }}
>
	<fieldset class="color__fieldset color__fieldset--row">
		<input
			class="input"
			id={`color-token-${index}`}
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
		name={`color-picker-${index}`}
	/>

	<fieldset class="color__fieldset">
		<div class="color__input-item">
			<label for={`color-hex-${index}`}>HEX</label>
			<div class="color__input-copy">
				<input
					class="input"
					id={`color-hex-${index}`}
					type="text"
					value={color.source.hex}
					onblur={handleColorInput}
				/>
				<ButtonCopy content={color.source.hex} />
			</div>
		</div>

		<div class="color__input-item">
			<label for={`color-rgb-${index}`}>RGB</label>
			<div class="color__input-copy">
				<input
					class="input"
					id={`color-rgb-${index}`}
					type="text"
					value={color.source.rgbString}
					onblur={handleColorInput}
				/>
				<ButtonCopy content={color.source.rgbString} />
			</div>
		</div>

		<div class="color__input-item">
			<label for={`color-hsl-${index}`}>HSL</label>
			<div class="color__input-copy">
				<input
					class="input"
					id={`color-hsl-${index}`}
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
		<select title="Easing" id={`color-easing-${index}`} bind:value={color.easingFn} class="select">
			<option value="linear">Linear</option>
			<option value="quadInOut">Quad In Out</option>
			<option value="quadIn">Quad In</option>
			<option value="quadOut">Quad Out</option>
		</select>

		<input
			title="Steps"
			class="input"
			type="number"
			id={`color-steps-${index}`}
			bind:value={color.steps}
			min={0}
		/>
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
