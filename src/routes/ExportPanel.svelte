<script lang="ts">
	import { STORE_URL } from '$lib';
	import { quadInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import { PUBLIC_IS_DEMO } from '$env/static/public';
	import A from '$lib/components/A.svelte';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';
	import { getPaletteContext, type Color } from '$lib/palette.svelte';

	type Format = 'Tailwind' | 'CSS' | 'SCSS' | 'JSON';

	const palette = getPaletteContext();

	let activeFormat = $state<Format>(PUBLIC_IS_DEMO ? 'JSON' : 'CSS');
	let textToExport = $state<string>('');

	$effect(() => {
		textToExport = formatExport(palette.colors);
	});

	const formats: Format[] = ['Tailwind', 'CSS', 'SCSS', 'JSON'];

	function formatVariant(tokenName: string, variantIndex: number, hex: string) {
		switch (activeFormat) {
			case 'Tailwind':
				return `        "${tokenName}-${variantIndex}": "${hex}",`;
			case 'CSS':
				return `--${tokenName}-${variantIndex}: ${hex};`;
			case 'SCSS':
				return `$${tokenName}-${variantIndex}: ${hex};`;
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

<aside
	class="export-panel"
	in:fly={{ x: 64, duration: 150, delay: 0, easing: quadInOut }}
	out:fade={{ duration: 75 }}
>
	<nav class="export-panel__nav">
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
	</nav>

	<Divider />

	<section class="export-panel__output">
		{#if PUBLIC_IS_DEMO && ['CSS', 'SCSS', 'Tailwind'].includes(activeFormat)}
			<section class="empty-section">
				<EmptyMessage>
					{activeFormat} export is only available in the
					<A href={STORE_URL} target="_blank">full version</A>.
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
		@apply sticky inset-0 right-0 z-10 grid min-w-80 overflow-y-auto border-l bg-chromeo-100;

		/* Offsets the border of the last `ColorCard` */
		@apply -ml-[1px];

		/* HACK: h2, divider, tabs, divider, code */
		@apply grid-rows-[max-content_max-content_auto];
	}

	nav.export-panel__nav {
		@apply flex items-center gap-2;
	}

	.export-panel__tabs {
		@apply flex w-full justify-evenly;
	}

	.export-panel__output {
		@apply relative box-border flex h-full flex-row overflow-y-auto;
	}

	pre.export-panel__pre {
		@apply absolute inset-0 w-full p-2 font-mono text-xs;
	}

	.export-panel__copy {
		@apply sticky right-0 top-0 ml-auto h-max;
	}

	button.button[role='tab'] {
		@apply flex flex-grow cursor-pointer items-center justify-center gap-2 border-y-2 border-y-transparent bg-chromeo-200 p-1 text-xs font-semibold tracking-tight;
		@apply p-2;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
		@apply active:scale-90;
		@apply transition-all duration-100;
	}

	button.button[role='tab'][aria-selected='true'] {
		@apply z-10 -my-0.5 border-b-2 border-b-accent bg-chromeo-50/50 text-accent;
	}

	.empty-section {
		@apply absolute inset-0 flex items-center justify-center p-10;
	}
</style>
