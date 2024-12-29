<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		target?: string;
		children: Snippet;
	}

	const { href, target, children }: Props = $props();
</script>

<a class="a" {href} {target}>
	{@render children()}
</a>

<style lang="postcss">
	.a {
		@apply max-w-max border-b;
		@apply transition-all duration-75;

		/* We make the border invisible so it doesnt shift the text on hover */
		@apply hover:border-b-neutral-50/0;
	}
</style>
