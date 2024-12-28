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
		@apply block w-full rounded border p-1.5 font-mono text-xs;
	}
</style>
