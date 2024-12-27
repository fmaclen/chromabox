<script lang="ts">
	interface Props {
		id: string;
		value?: string | File | null | number;
		disabled?: boolean;
		placeholder?: string;
		type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'url' | 'file';
		required?: boolean;
		accept?: string;
		onchange?: (e: Event) => void;
		onblur?: (e: Event) => void;
	}

	let {
		value = $bindable(''),
		disabled = false,
		placeholder = '',
		type = 'text',
		required = false,
		id = '',
		accept = '',
		onchange,
		onblur
	}: Props = $props();
</script>

<input
	bind:value
	class="field-input"
	{type}
	{disabled}
	{placeholder}
	{required}
	{id}
	{accept}
	{onchange}
	{onblur}
/>

<style lang="postcss">
	.field-input {
		@apply block w-full rounded border p-1.5 text-xs;
	}
</style>
