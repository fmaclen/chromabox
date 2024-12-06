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

{#if env.PUBLIC_IS_DEMO}
	<header>
		<div>
			<h1>Chromabox</h1>
			<h2>The ultimate color palette generator for designers & developers</h2>
		</div>
		<nav>
			<a href="https://fmaclen.gumroad.com/l/chromabox" target="_blank">Buy now</a>
			<a href="https://github.com/fmaclen/chromabox#self-hosting" target="_blank">Self-host</a>
		</nav>
	</header>
	<hr />
{/if}

<slot />
