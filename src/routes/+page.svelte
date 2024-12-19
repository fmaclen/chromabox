<script lang="ts">
	import { colord, type Colord } from 'colord';

	import { generateRandomColor } from '$lib/utils';

	import ColorCard from './ColorCard.svelte';
	import Favicon from './Favicon.svelte';

	let colors: Colord[] = $state([]);
</script>

<Favicon {colors} />

<div class="controls">
	<button type="button" onclick={() => colors.push(colord(generateRandomColor()))}>New color</button>
	<button type="button" onclick={() => (colors = [])} disabled={!colors.length}>Reset</button>
</div>

<div class="palette">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each colors as _, index}
		<ColorCard bind:color={colors[index]} />
	{/each}
</div>

<style>
	.controls {
		display: flex;
		gap: 10px;
	}

	.palette {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fill, 300px);
		gap: 20px;
	}
</style>
