<script lang="ts">
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
		onblur
	}: Props = $props();
</script>

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

<style lang="postcss">
	.field-input {
		@apply block w-full rounded border p-1.5 text-xs;
	}
</style>
