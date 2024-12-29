<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		href: string;
		target?: string;
		children: Snippet;
	}

	const { href, target, children }: Props = $props();
</script>

<a class="a" href={href} target={target}>
	{@render children()}
</a>

<style lang="postcss">
	.a {
		@apply border-b max-w-max ;
		@apply hover:border-b-neutral-50/0;
		@apply transition-all duration-75;
	}
</style>
