<script lang="ts">
	import { colord, type Colord } from 'colord';
	import { onMount } from 'svelte';

	import Divider from '$lib/components/Divider.svelte';
	import { generateRandomColor } from '$lib/utils';

	import ColorCard from './ColorCard.svelte';
	import Favicon from './Favicon.svelte';

	let colors: Colord[] = $state([]);

	const DEFAULT_COLOR_PALETTE = ['#008CFF', '#A600FF', '#F600FF', '#FF0004', '#FF9000', '#FFBF00'];

	onMount(() => {
		colors = DEFAULT_COLOR_PALETTE.map((color) => colord(color));
	});
</script>

<Favicon {colors} />

<div class="palette">
	<button class="button" type="button" onclick={() => colors.push(colord(generateRandomColor()))}>
		New color
	</button>
	<button class="button" type="button" onclick={() => (colors = [])} disabled={!colors.length}>
		Reset
	</button>
</div>

<Divider />

<div class="colors">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each colors as _, index}
		<ColorCard bind:color={colors[index]} />
	{/each}
</div>

<style lang="postcss">
	.palette {
		@apply flex gap-1.5 p-2.5;
	}

	.colors {
		@apply flex flex-grow flex-row overflow-auto;
	}

	.button {
		@apply cursor-pointer rounded-md border px-3 py-1.5 text-sm font-semibold tracking-tight;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}
</style>
