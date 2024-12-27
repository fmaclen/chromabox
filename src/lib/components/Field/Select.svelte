<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		value?: string | number;
		disabled?: boolean;
		placeholder?: string;
		required?: boolean;
		children: Snippet;
	}

	let { id, value = $bindable(''), disabled, placeholder, required, children }: Props = $props();
</script>

<select class="field-select" {id} bind:value {disabled} {placeholder} {required}>
	{@render children()}
</select>

<style lang="postcss">
	.field-select {
		@apply block w-full rounded border p-1.5 text-xs;
	}
</style>
