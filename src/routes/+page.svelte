<script lang="ts">
	import { onMount } from 'svelte';

	import { PUBLIC_IS_DEMO } from '$env/static/public';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { getPaletteContext } from '$lib/palette.svelte';

	import ColorCard from './ColorCard.svelte';
	import ExportPanel from './ExportPanel.svelte';
	import Favicon from './Favicon.svelte';

	const paletteContext = getPaletteContext();

	const DEFAULT_COLOR_PALETTE = ['#008CFF', '#A600FF', '#F600FF', '#FF0004', '#FF9000', '#FFBF00'];

	onMount(() => {
		if (!PUBLIC_IS_DEMO) return;
		paletteContext.colors = DEFAULT_COLOR_PALETTE.map((color) =>
			paletteContext.stringToColor(color)
		);
	});
</script>

<Favicon colors={paletteContext.colors} />

<div class="palette">
	<Button title="New color" onclick={() => paletteContext.newColor()}>New color</Button>
	<Button
		title="Reset"
		onclick={() => (paletteContext.colors = [])}
		disabled={!paletteContext.colors.length}>Reset</Button
	>
</div>

<Divider />

<div class="colors">
	{#each paletteContext.colors as color}
		<ColorCard bind:color />
	{/each}
</div>

<ExportPanel />

<style lang="postcss">
	.palette {
		@apply flex gap-1.5 p-2.5;
	}

	.colors {
		@apply flex flex-grow flex-row overflow-auto;
	}
</style>
