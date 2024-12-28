<script lang="ts">
	import Button from './Button.svelte';

	let { content }: { content: string } = $props();
</script>

<button
	aria-label="Copy"
	class="button-copy"
	title="Copy"
	onclick={() => navigator.clipboard.writeText(content)}
>
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M3 18.5v-2h2v2zM3 15v-2h2v2zm0-3.5v-2h2v2zM6.5 22v-2h2v2zM9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm1 6v-2h2v2zm-5 0q-.825 0-1.412-.587T3 20h2zm8.5 0v-2h2q0 .825-.587 1.413T13.5 22M3 8q0-.825.588-1.412T5 6v2zm10.5 2"
		/>
	</svg>
</button>

<style lang="postcss">
	.button-copy {
		@apply block h-full p-2 opacity-40 hover:opacity-100;
		@apply hover:scale-125;
		@apply active:scale-75;
		@apply transition-all duration-100;
	}
</style>
