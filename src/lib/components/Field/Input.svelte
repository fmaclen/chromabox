<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		value?: string | File | null | number;
		disabled?: boolean;
		title?: string;
		placeholder?: string;
		type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'url' | 'file';
		required?: boolean;
		min?: number;
		max?: number;
		onchange?: (e: Event) => void;
		onblur?: (e: Event) => void;
		children?: Snippet;
	}

	let {
		value = $bindable(''),
		disabled = false,
		title,
		placeholder,
		type = 'text',
		required = false,
		id,
		min,
		max,
		onchange,
		onblur,
		children
	}: Props = $props();
</script>

<div class="field-input" {title}>
	<input
		bind:value
		class="field-input__input"
		{type}
		{disabled}
		{placeholder}
		{required}
		{id}
		{min}
		{max}
		aria-label={title}
		{onchange}
		{onblur}
	/>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="postcss">
	.field-input {
		@apply flex w-full items-center rounded bg-chromeo-200 outline-2 outline-chromeo-800;
		@apply focus-within:bg-transparent focus-within:outline;
	}

	.field-input__input {
		@apply block w-full bg-transparent p-2 font-mono text-xs text-chromeo-900 outline-none;
		@apply placeholder:text-chromeo-950/30;
	}
</style>
