<script lang="ts">
	import { STORE_URL } from '$lib';

	import { PUBLIC_IS_DEMO } from '$env/static/public';
	import ButtonCopy from '$lib/components/ButtonCopy.svelte';
	import { getPaletteContext, type Color } from '$lib/palette.svelte';
	import A from '$lib/components/A.svelte';

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
	<h2 class="export-panel__title">Export Palette</h2>

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

	<div class="export-panel__content">
		{#if PUBLIC_IS_DEMO && ['CSS', 'SCSS', 'Tailwind'].includes(activeFormat)}
			<p class="export-panel__demo-message">
				{activeFormat} export is available in the
				<A href={STORE_URL}> full version </A>.
			</p>
		{:else}
			<pre><code>{textToExport}</code></pre>
			<ButtonCopy content={textToExport} />
		{/if}
	</div>
</aside>

<style>
	.export-panel {
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 300px;
		background: white;
		border-left: 1px solid rgba(0, 0, 0, 0.1);
		padding: 20px;
		overflow-y: auto;
	}

	.export-panel__title {
		margin-bottom: 20px;
	}

	.export-panel__tabs {
		display: flex;
		gap: 5px;
		margin-bottom: 20px;
	}

	.export-panel__content {
		position: relative;
	}

	.export-panel__demo-message {
		margin-bottom: 20px;
	}

	pre {
		background: #f5f5f5;
		padding: 10px;
		border-radius: 5px;
		overflow-x: auto;
	}

	[role='tab'][aria-selected='true'] {
		background: #f5f5f5;
	}
</style>
