<script lang="ts">
	import { page } from '$app/state';
	import A from '$lib/components/A.svelte';
</script>

<div class="error">
	{#if page.status === 404}
		<h2 class="error__h2">Error 404</h2>
		<p class="error__p">
			<strong class="block">No content found</strong> Perhaps there's a typo in the address or
			followed a broken link. <A href="/">Try starting over</A>
		</p>
	{:else}
		<h2 class="error__h2">Error {page.status}</h2>
		<p class="error__p">An error occurred while processing your request.</p>
	{/if}
</div>

<style lang="postcss">
	.error {
		@apply mx-auto flex h-full max-w-max items-center justify-center gap-4;
	}

	.error__h2 {
		@apply border-r pr-4 text-xl font-bold tracking-tight;
	}

	.error__p {
		@apply text-balance;
	}
</style>
