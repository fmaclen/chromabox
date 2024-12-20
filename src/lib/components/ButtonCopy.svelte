<script lang="ts">
	import Button from './Button.svelte';

	let { content }: { content: string } = $props();
</script>

<Button title="Copy" onclick={() => navigator.clipboard.writeText(content)}>Copy</Button>
