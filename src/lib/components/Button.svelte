<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		children,
		onclick,
		disabled
	}: { title: string; children: Snippet; onclick: () => void; disabled?: boolean } = $props();
</script>

<button class="button" type="button" {title} {onclick} {disabled}>
	{@render children()}
</button>

<style lang="postcss">
	.button {
		@apply cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold tracking-tight;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
	}
</style>
