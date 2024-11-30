<script lang="ts">
	import { colord, type Colord } from 'colord';

	import { generateRandomColor } from '$lib/utils';

	import ColorCard from './ColorCard.svelte';

	const colors: Colord[] = $state([]);
</script>

<h1>Chromabox</h1>
<button onclick={() => colors.push(colord(generateRandomColor()))}>New color</button>

<div class="palette">
	{#each colors as color}
		<ColorCard {color} />
	{/each}
</div>

<style>
	.palette {
		margin-top: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fill, 300px);
		gap: 20px;
	}
</style>
