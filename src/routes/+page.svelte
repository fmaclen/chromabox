<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import { getPaletteContext } from '$lib/palette.svelte';

	import ColorCard from './ColorCard.svelte';
	import ExportPanel from './ExportPanel.svelte';
	import Favicon from './Favicon.svelte';

	const palette = getPaletteContext();
</script>

<Favicon colors={palette.colors} />

<div class="palette">
	<Button title="New color" onclick={() => palette.newColor()}>New color</Button>
	<Button title="Reset" onclick={() => (palette.colors = [])} disabled={!palette.colors.length}>
		Reset
	</Button>
</div>

<Divider />

<div class="colors">
	{#each palette.colors as color, index}
		<ColorCard bind:color {index} />
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
