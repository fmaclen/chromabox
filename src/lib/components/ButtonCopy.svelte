<script lang="ts">
	let { content }: { content: string } = $props();

	function copyContent() {
		navigator.clipboard.writeText(content);
	}
</script>

<button title="Copy" class="button-copy" onclick={copyContent}>Copy</button>
