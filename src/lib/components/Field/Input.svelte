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
		onchange,
		onblur,
		children
	}: Props = $props();
</script>

<div class="container">
	<input
		bind:value
		class="field-input"
		{type}
		{disabled}
		{title}
		{placeholder}
		{required}
		{id}
		{min}
		{onchange}
		{onblur}
	/>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="postcss">
	.container {
		@apply flex w-full items-center rounded border outline-2 focus-within:outline;
	}

	.field-input {
		@apply block w-full bg-transparent p-2 font-mono text-xs outline-none;
	}
</style>
