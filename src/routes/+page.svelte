<script lang="ts">
	import { fade } from 'svelte/transition';

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
	<Button title="New color" onclick={() => palette.newColor()}>
		<svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h3q.825 0 1.413.588T10 5v14q0 .825-.587 1.413T8 21zm7 0q-.425 0-.712-.288T11 20t.288-.712T12 19t.713.288T13 20t-.288.713T12 21m0-4q-.425 0-.712-.288T11 16t.288-.712T12 15t.713.288T13 16t-.288.713T12 17m0-4q-.425 0-.712-.288T11 12t.288-.712T12 11t.713.288T13 12t-.288.713T12 13m0-4q-.425 0-.712-.288T11 8t.288-.712T12 7t.713.288T13 8t-.288.713T12 9m0-4q-.425 0-.712-.288T11 4t.288-.712T12 3t.713.288T13 4t-.288.713T12 5m2 14q-.425 0-.712-.288T13 18t.288-.712T14 17t.713.288T15 18t-.288.713T14 19m0-4q-.425 0-.712-.288T13 14t.288-.712T14 13t.713.288T15 14t-.288.713T14 15m0-4q-.425 0-.712-.288T13 10t.288-.712T14 9t.713.288T15 10t-.288.713T14 11m0-4q-.425 0-.712-.288T13 6t.288-.712T14 5t.713.288T15 6t-.288.713T14 7m2 14q-.425 0-.712-.288T15 20t.288-.712T16 19t.713.288T17 20t-.288.713T16 21m0-4q-.425 0-.712-.288T15 16t.288-.712T16 15t.713.288T17 16t-.288.713T16 17m0-4q-.425 0-.712-.288T15 12t.288-.712T16 11t.713.288T17 12t-.288.713T16 13m0-4q-.425 0-.712-.288T15 8t.288-.712T16 7t.713.288T17 8t-.288.713T16 9m0-4q-.425 0-.712-.288T15 4t.288-.712T16 3t.713.288T17 4t-.288.713T16 5m2 14q-.425 0-.712-.288T17 18t.288-.712T18 17t.713.288T19 18t-.288.713T18 19m0-4q-.425 0-.712-.288T17 14t.288-.712T18 13t.713.288T19 14t-.288.713T18 15m0-4q-.425 0-.712-.288T17 10t.288-.712T18 9t.713.288T19 10t-.288.713T18 11m0-4q-.425 0-.712-.288T17 6t.288-.712T18 5t.713.288T19 6t-.288.713T18 7m2 14q-.425 0-.712-.288T19 20t.288-.712T20 19t.713.288T21 20t-.288.713T20 21m0-4q-.425 0-.712-.288T19 16t.288-.712T20 15t.713.288T21 16t-.288.713T20 17m0-4q-.425 0-.712-.288T19 12t.288-.712T20 11t.713.288T21 12t-.288.713T20 13m0-4q-.425 0-.712-.288T19 8t.288-.712T20 7t.713.288T21 8t-.288.713T20 9m0-4q-.425 0-.712-.288T19 4t.288-.712T20 3t.713.288T21 4t-.288.713T20 5"
			/>
		</svg>
		New color
	</Button>
	<Button title="Reset" onclick={() => (palette.colors = [])} disabled={!palette.colors.length}>
		<svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20"
			/>
		</svg>
		Reset
	</Button>
</div>

<Divider />

<div class="colors">
	{#if !palette.colors.length}
		<p class="empty" transition:fade={{ duration: 100 }}>No colors in the palette</p>
	{/if}
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
		@apply relative flex flex-grow flex-row overflow-auto;
	}

	.empty {
		@apply absolute inset-0 flex items-center justify-center text-balance text-center opacity-50;
	}
</style>
