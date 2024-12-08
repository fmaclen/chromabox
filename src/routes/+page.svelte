<script lang="ts">
	import { colord, type Colord } from 'colord';

	import { generateRandomColor } from '$lib/utils';

	import ColorCard from './ColorCard.svelte';
	import Favicon from './Favicon.svelte';

	let colors: Colord[] = $state([]);
</script>

<Favicon {colors} />

<button onclick={() => colors.push(colord(generateRandomColor()))}>New color</button>

<div class="palette">
	{#each colors as _, index}
		<ColorCard bind:color={colors[index]}/>
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
