<script lang="ts">
	let { content }: { content: string } = $props();
</script>

<button
	type="button"
	title="Copy"
	class="button-copy"
	onclick={() => navigator.clipboard.writeText(content)}
>
	Copy
</button>
