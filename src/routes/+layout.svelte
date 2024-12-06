<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<svelte:head>
	<title>Chromabox: An open-source color palette generator</title>

	{#if env.PUBLIC_PLAUSIBLE_DOMAIN}
		<script
			defer
			data-domain={env.PUBLIC_PLAUSIBLE_DOMAIN}
			data-api={env.PUBLIC_PLAUSIBLE_API}
			src={env.PUBLIC_PLAUSIBLE_SRC}
		></script>
	{/if}
</svelte:head>

<h1>Chromabox</h1>

<hr />

<main>
	<slot />
</main>
