<script lang="ts">
	import { STORE_URL } from '$lib';

	import { PUBLIC_IS_DEMO } from '$env/static/public';
	import A from '$lib/components/A.svelte';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';
	import { getPaletteContext, type Color } from '$lib/palette.svelte';

	type Format = 'CSS' | 'SCSS' | 'Tailwind' | 'JSON';

	const palette = getPaletteContext();

	let activeFormat = $state<Format>('CSS');
	let textToExport = $state<string>('');

	$effect(() => {
		textToExport = formatExport(palette.colors);
	});

	const formats: Format[] = ['CSS', 'SCSS', 'Tailwind', 'JSON'];

	function formatVariant(tokenName: string, variantIndex: number, hex: string) {
		switch (activeFormat) {
			case 'CSS':
				return `--${tokenName}-${variantIndex}: ${hex};`;
			case 'SCSS':
				return `$${tokenName}-${variantIndex}: ${hex};`;
			case 'Tailwind':
				return `        "${tokenName}-${variantIndex}": "${hex}",`;
			case 'JSON':
				return `  "${tokenName}-${variantIndex}": "${hex}",`;
		}
	}

	function formatExport(colors: Color[]) {
		const exports: string[] = [];

		for (const color of colors) {
			exports.push(
				color.variants
					.map((variant, index) =>
						formatVariant(
							color.tokenName || palette.getClosestCSSColorName(color.source.hex),
							index,
							variant.hex
						)
					)
					.join('\n')
			);

			if (['CSS', 'SCSS'].includes(activeFormat)) exports.push('\n');
		}

		if (activeFormat === 'Tailwind')
			return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${exports.join('\n')}\n      }\n    }\n  }\n}`;

		if (activeFormat === 'JSON') return exports.length ? '{\n' + exports.join('\n') + '\n}' : '{}';

		return exports.join('\n');
	}
</script>

<aside class="export-panel">
	<h2 class="export-panel__title">Export palette</h2>
	<Divider />

	<div role="tablist" class="export-panel__tabs">
		{#each formats as format}
			<button
				class="button"
				role="tab"
				aria-selected={activeFormat === format}
				onclick={() => (activeFormat = format)}
			>
				{format}
			</button>
		{/each}
	</div>

	<Divider />

	<section class="export-panel__output">
		{#if PUBLIC_IS_DEMO && ['CSS', 'SCSS', 'Tailwind'].includes(activeFormat)}
			<section class="empty-section">
				<EmptyMessage>
					{activeFormat} export is only available in the
					<A href={STORE_URL}>full version</A>.
				</EmptyMessage>
			</section>
		{:else}
			<pre class="export-panel__pre">{textToExport}</pre>
			<div class="export-panel__copy">
				<ButtonCopy content={textToExport} />
			</div>
		{/if}
	</section>
</aside>

<style lang="postcss">
	.export-panel {
		@apply sticky inset-0 right-0 z-10 grid min-w-80 overflow-y-auto border-l bg-white;

		/* Offsets the border of the last `ColorCard` */
		@apply -ml-[1px];

		/* HACK: h2, divider, tabs, divider, code */
		@apply grid-rows-[max-content_max-content_max-content_max-content_auto];
	}

	h2.export-panel__title {
		@apply flex items-center gap-1.5 px-2.5 font-bold tracking-tight;
		@apply h-[50px]; /* Aligned with the first row in `ColorCard` */
	}

	.export-panel__tabs {
		@apply flex gap-1.5 p-2.5;
	}

	.export-panel__output {
		@apply relative box-border flex h-full flex-row overflow-y-auto rounded;
	}

	pre.export-panel__pre {
		@apply absolute inset-0 w-full p-2.5 font-mono text-xs;
	}

	.export-panel__copy {
		@apply sticky right-0 top-0 ml-auto h-max;
	}

	button.button[role='tab'] {
		@apply flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold tracking-tight;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
		@apply active:scale-90;
		@apply transition-all duration-100;
	}

	[role='tab'][aria-selected='true'] {
		@apply bg-stone-900 text-stone-50;
	}

	.empty-section {
		@apply absolute inset-0 flex items-center justify-center p-10;
	}
</style>
