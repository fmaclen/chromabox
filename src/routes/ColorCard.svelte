<script lang="ts">
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import Button from '$lib/components/Button.svelte';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Field from '$lib/components/Field';
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

	function handleColorInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (palette.isColorValid(target.value)) {
			color.source = palette.stringToColor(target.value).source;
		}
	}

	function reverseColorVariants() {
		const { start, end } = color.variantsRange;
		color.variantsRange = { ...color.variantsRange, start: end, end: start };
	}
</script>

<section
	class="color"
	in:fly={{ y: 64, duration: 150, easing: quadInOut }}
	out:fade={{ duration: 75 }}
>
	<fieldset class="color__fieldset color__fieldset--row">
		<Field>
			<div class="swatch" style={`background-color: ${color.source.hex}`}></div>
			<Field.Input
				title="Token"
				id={`color-token-${index}`}
				placeholder={tokenNamePlaceholder}
				bind:value={color.tokenName}
			>
				{#if color.tokenName}
					<ButtonCopy content={color.tokenName} />
				{/if}
			</Field.Input>
		</Field>

		<Button title="Delete" variant="icon" onclick={() => palette.deleteColor(index)}>Delete</Button>
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
			<Field.Input id={`color-hex-${index}`} value={color.source.hex} onblur={handleColorInput}>
				<ButtonCopy content={color.source.hex} />
			</Field.Input>
		</Field>

		<Field>
			<Field.Label id={`color-rgb-${index}`}>RGB</Field.Label>
			<Field.Input
				id={`color-rgb-${index}`}
				value={color.source.rgbString}
				onblur={handleColorInput}
			>
				<ButtonCopy content={color.source.rgbString} />
			</Field.Input>
		</Field>

		<Field>
			<Field.Label id={`color-hsl-${index}`}>HSL</Field.Label>
			<Field.Input
				id={`color-hsl-${index}`}
				value={color.source.hslString}
				onblur={handleColorInput}
			>
				<ButtonCopy content={color.source.hslString} />
			</Field.Input>
		</Field>
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset">
		<div class="color__row">
			<Field>
				<Field.Select title="Easing" id={`color-easing-${index}`} bind:value={color.easingFn}>
					<option value="linear" selected>Linear</option>
					<option value="quadInOut">Quad In Out</option>
					<option value="quadIn">Quad In</option>
					<option value="quadOut">Quad Out</option>
				</Field.Select>
			</Field>

			<div class="color__row">
				<Field>
					<Field.Input
						title="Steps"
						placeholder="Steps"
						type="number"
						min={0}
						id={`color-steps-${index}`}
						bind:value={color.steps}
					/>
				</Field>

				<Button title="Reverse" variant="icon" onclick={reverseColorVariants}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1.25em"
						height="1.25em"
						viewBox="0 0 24 24"
					>
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m3 8l4-4l4 4M7 4v9m6 3l4 4l4-4m-4-6v10"
						/>
					</svg>
				</Button>
			</div>
		</div>

		<div class="color__row">
			<Field>
				<Field.Select
					title="Property"
					id={`color-property-${index}`}
					bind:value={color.variantsRange.property}
				>
					<option value="h">Hue</option>
					<option value="s">Saturation</option>
					<option value="l">Lightness</option>
				</Field.Select>
			</Field>

			<div class="color__row">
				<Field>
					<Field.Input
						title="Start"
						placeholder="Start"
						type="number"
						min={0}
						max={color.variantsRange.property === 'h' ? 360 : 100}
						id={`color-start-${index}`}
						bind:value={color.variantsRange.start}
					/>
				</Field>

				<Field>
					<Field.Input
						title="End"
						placeholder="End"
						type="number"
						min={0}
						max={color.variantsRange.property === 'h' ? 360 : 100}
						id={`color-end-${index}`}
						bind:value={color.variantsRange.end}
					/>
				</Field>
			</div>
		</div>
	</fieldset>

	<Divider />

	<fieldset class="color__fieldset color__fieldset--variants">
		{#each color.variants as variant}
			<div
				class="variant"
				class:variant--dark={variant.isDark}
				style={`background-color: ${variant.hex};`}
			>
				<p class="variant__color">{palette.swatchToString(variant)}</p>
				<ButtonCopy content={palette.swatchToString(variant)} />
			</div>
		{/each}
	</fieldset>
</section>

<style lang="postcss">
	section.color {
		@apply h-max w-min border-r;

		/* These are the styles of the ColorPicker component */

		:global(.color-picker > *) {
			@apply rounded-none bg-chromeo-100;
		}

		:global(.color-picker .wrapper) {
			@apply m-0 border-none p-2;
		}

		:global(.text-input) {
			@apply hidden;
		}
	}

	.color__row {
		@apply flex w-full flex-row gap-1;
	}

	fieldset.color__fieldset {
		@apply m-0 flex flex-col gap-1 border-none bg-chromeo-100 p-2;
	}

	fieldset.color__fieldset--row {
		@apply flex-row gap-2;
	}

	fieldset.color__fieldset--variants {
		@apply gap-0 p-0;
	}

	.swatch {
		@apply h-8 w-1 rounded-sm;
	}

	.variant {
		@apply flex flex-row items-center justify-between gap-2;
		@apply -mx-[1px] px-[2px];
		@apply text-black;
		@apply transition-all duration-200 ease-in-out;
	}

	.variant--dark {
		@apply text-white;
	}

	.variant__color {
		@apply px-2 py-3 font-mono text-xs opacity-90;
	}
</style>
