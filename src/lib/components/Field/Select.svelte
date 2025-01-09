<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		value?: string | number;
		disabled?: boolean;
		placeholder?: string;
		required?: boolean;
		title?: string;
		children: Snippet;
	}

	let {
		id,
		value = $bindable(''),
		disabled,
		placeholder,
		required,
		title,
		children
	}: Props = $props();
</script>

<select class="field-select" {id} bind:value {disabled} {placeholder} {required} aria-label={title}>
	{@render children()}
</select>

<style lang="postcss">
	.field-select {
		@apply block h-full w-full appearance-none rounded bg-chromeo-200 p-2 font-mono text-xs text-chromeo-900 outline-2 outline-chromeo-800;
		@apply focus-within:bg-chromeo-50 focus-within:outline;
	}
</style>
