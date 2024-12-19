<script lang="ts">
	import { colord, type Colord } from 'colord';

	import { generateRandomColor } from '$lib/utils';

	import ColorCard from './ColorCard.svelte';
	import Favicon from './Favicon.svelte';

	let colors: Colord[] = $state([]);
</script>

<Favicon {colors} />

<div class="controls">
	<button class="button" type="button" onclick={() => colors.push(colord(generateRandomColor()))}>
		New color
	</button>
	<button class="button" type="button" onclick={() => (colors = [])} disabled={!colors.length}>
		Reset
	</button>
</div>

<hr class="hr" />

<div class="palette">
	<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
	{#each colors as _, index}
		<ColorCard bind:color={colors[index]} />
	{/each}
</div>

<style lang="postcss">
	.controls,
	.palette {
		@apply gap-1.5 p-2.5;
	}

	.controls {
		@apply flex;
	}

	.palette {
		@apply grid;
	}

	.button {
		@apply rounded-md border px-3 py-1.5 text-sm font-medium cursor-pointer;
		@apply disabled:opacity-50 disabled:cursor-not-allowed;
	}

	.hr {
		@apply border-b border-t-0;
	}
</style>
