<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="field">
	{@render children()}
</div>

<style lang="postcss">
	.field {
		@apply flex w-full items-center gap-2;
	}
</style>
