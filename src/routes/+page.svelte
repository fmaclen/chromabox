<script lang="ts">
	import { colord, type Colord } from 'colord';

	import { generateRandomColor } from '$lib/utils';

	import ColorPaletteCard from './ColorPaletteCard.svelte';

	const colors: Colord[] = $state([]);
</script>

<h1>Explore and Create Color Combos</h1>
<p>A creative tool to experiment with and perfect your color combinations.</p>
<button onclick={() => colors.push(colord(generateRandomColor()))}>New color</button>

<div class="color-grid">
	{#each colors as color}
		<ColorPaletteCard {color} />
	{/each}
</div>

<style>
	.color-grid {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fill, 300px);
		gap: 20px;
	}
</style>
