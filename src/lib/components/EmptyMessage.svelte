<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<p class="empty-message">
	{@render children()}
</p>

<style lang="postcss">
	.empty-message {
		@apply text-balance text-center opacity-50;
	}
</style>
