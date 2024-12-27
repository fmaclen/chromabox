<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { getPaletteContext, type Color } from '$lib/palette.svelte';
	import Field from '$lib/components/Field';

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

	function handleColorInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (palette.isColorValid(target.value)) {
			color.source = palette.stringToColor(target.value).source;
		}
	}
</script>

<section
	class="color"
	in:fly={{ y: 64, duration: 150, easing: quadInOut }}
	out:fade={{ duration: 75 }}
>
	<fieldset class="color__fieldset color__fieldset--row">
		<Field>
			<Field.Label id={`color-token-${index}`}>Token name</Field.Label>
			<Field.Input
				id={`color-token-${index}`}
				placeholder={tokenNamePlaceholder}
				bind:value={color.tokenName}
			/>
			<ButtonCopy content={color.tokenName} />
		</Field>
	</fieldset>

	<Divider />

	<ColorPicker
		bind:hex={color.source.hex}
		components={ChromeVariant}
		isDialog={false}
		sliderDirection="horizontal"
	/>

	<fieldset class="color__fieldset">
		<Field>
			<Field.Label id={`color-hex-${index}`}>HEX</Field.Label>
			<Field.Input
				id={`color-hex-${index}`}
				value={color.source.hex}
				onblur={handleColorInput}
			/>
			<ButtonCopy content={color.source.hex} />
		</Field>

		<Field>
			<Field.Label id={`color-rgb-${index}`}>RGB</Field.Label>
			<Field.Input
				id={`color-rgb-${index}`}
				value={color.source.rgbString}
				onblur={handleColorInput}
			/>
			<ButtonCopy content={color.source.rgbString} />
		</Field>

		<Field>
			<Field.Label id={`color-hsl-${index}`}>HSL</Field.Label>
			<Field.Input
				id={`color-hsl-${index}`}
				value={color.source.hslString}
				onblur={handleColorInput}
			/>
			<ButtonCopy content={color.source.hslString} />
		</Field>
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--row">
		<select title="Easing" class="select" id={`color-easing-${index}`} bind:value={color.easingFn}>
			<option value="linear">Linear</option>
			<option value="quadInOut">Quad In Out</option>
			<option value="quadIn">Quad In</option>
			<option value="quadOut">Quad Out</option>
		</select>

		<input
			title="Steps"
			class="input"
			type="number"
			min={0}
			id={`color-steps-${index}`}
			bind:value={color.steps}
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

	.select,
	.input {
		@apply w-full rounded-md border px-3 py-1.5;
	}
</style>
