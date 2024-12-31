<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		variant?: 'primary';
		children: Snippet;
		onclick: () => void;
		disabled?: boolean;
	}

	let { title, variant, children, onclick, disabled }: Props = $props();
</script>

<button
	class="button"
	type="button"
	{title}
	{onclick}
	{disabled}
	class:button--primary={variant === 'primary'}
>
	{@render children()}
</button>

<style lang="postcss">
	.button {
		@apply flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold tracking-tight;
		@apply hover:bg-chromeo-300;
		@apply disabled:cursor-not-allowed disabled:opacity-50;
		@apply active:scale-90;
		@apply transition-all duration-100;
	}

	.button--primary {
		@apply bg-accent text-white;
		@apply hover:bg-accent/80;
	}
</style>
