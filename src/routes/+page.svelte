<script lang="ts">
	import { fade } from 'svelte/transition';

	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import EmptyMessage from '$lib/components/EmptyMessage.svelte';
	import { getPaletteContext } from '$lib/palette.svelte';

	import ColorCard from './ColorCard.svelte';
	import ExportPanel from './ExportPanel.svelte';
	import Favicon from './Favicon.svelte';

	const palette = getPaletteContext();

	let theme = $state<'light' | 'dark'>('dark');
	const hasColors = $derived(palette.colors.length > 0);

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.className = theme;
	}
</script>

<Favicon colors={palette.colors} />

<div class="toolbar">
	<nav class="toolbar__nav">
		<Button
			title="New color"
			variant={hasColors ? undefined : 'primary'}
			onclick={() => palette.newColor()}
		>
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
	</nav>

	<nav class="toolbar__nav">
		<Button title="Toggle theme" onclick={toggleTheme}>
			{#if theme === 'light'}
				<svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17M2 13q-.425 0-.712-.288T1 12t.288-.712T2 11h2q.425 0 .713.288T5 12t-.288.713T4 13zm18 0q-.425 0-.712-.288T19 12t.288-.712T20 11h2q.425 0 .713.288T23 12t-.288.713T22 13zm-8-8q-.425 0-.712-.288T11 4V2q0-.425.288-.712T12 1t.713.288T13 2v2q0 .425-.288.713T12 5m0 18q-.425 0-.712-.288T11 22v-2q0-.425.288-.712T12 19t.713.288T13 20v2q0 .425-.288.713T12 23M5.65 7.05L4.575 6q-.3-.275-.288-.7t.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7t-.275.7t-.687.288t-.713-.288M18 19.425l-1.05-1.075q-.275-.3-.275-.712t.275-.688q.275-.3.688-.287t.712.287L19.425 18q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3M16.95 7.05q-.3-.275-.288-.687t.288-.713L18 4.575q.275-.3.7-.288t.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275t-.7-.275M4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.712-.275t.688.275q.3.275.288.688t-.288.712L6 19.425q-.275.3-.7.288t-.725-.288"
					/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362t.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21"
					/>
				</svg>
			{/if}
		</Button>
	</nav>
</div>

<Divider />

<div class="palette__colors-export">
	<div class="colors">
		{#if !hasColors}
			<section class="empty-section" transition:fade={{ duration: 100 }}>
				<EmptyMessage>No colors in the palette</EmptyMessage>
			</section>
		{/if}
		{#each palette.colors as color, index}
			<ColorCard {color} {index} />
		{/each}
	</div>

	{#if hasColors}
		<ExportPanel />
	{/if}
</div>

<style lang="postcss">
	.toolbar {
		@apply flex justify-between gap-2.5 bg-chromeo-200 p-2.5;
	}

	.toolbar__nav {
		@apply flex flex-row gap-1.5;
	}

	.palette__colors-export {
		@apply relative flex h-full flex-grow flex-row overflow-auto;
	}

	.colors {
		@apply flex flex-grow flex-row;
	}

	.empty-section {
		@apply absolute inset-0 flex items-center justify-center bg-chromeo-200;
	}
</style>
