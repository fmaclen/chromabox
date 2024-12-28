<script lang="ts">
	import '../app.css';

	import {
		PUBLIC_IS_DEMO,
		PUBLIC_PLAUSIBLE_API,
		PUBLIC_PLAUSIBLE_DOMAIN,
		PUBLIC_PLAUSIBLE_SRC
	} from '$env/static/public';
	import { setPaletteContext } from '$lib/palette.svelte';

	let { children } = $props();

	setPaletteContext();
</script>

<svelte:head>
	{#if PUBLIC_IS_DEMO}
		<title>Chromabox: An open-source color palette generator</title>
	{:else}
		<title>Chromabox</title>
	{/if}

	{#if PUBLIC_PLAUSIBLE_DOMAIN}
		<script
			defer
			data-domain={PUBLIC_PLAUSIBLE_DOMAIN}
			data-api={PUBLIC_PLAUSIBLE_API}
			src={PUBLIC_PLAUSIBLE_SRC}
		></script>
	{/if}
</svelte:head>

{#if PUBLIC_IS_DEMO}
	<div class="layout layout--demo">
		<header class="demo-header">
			<h1>Chromabox</h1>
			<h2>The ultimate color palette generator for designers & developers</h2>
			<nav class="flex flex-row items-center justify-center gap-2">
				<a class="button" href="https://fmaclen.gumroad.com/l/chromabox" target="_blank">
					Buy now
				</a>
				<a class="button" href="https://github.com/fmaclen/chromabox#self-hosting" target="_blank">
					Self-host
				</a>
			</nav>
		</header>

		<main class="main main--demo">
			{@render children()}
		</main>

		<footer class="demo-footer">
			<p>&copy; {new Date().getFullYear()} Chromabox</p>
			<nav>
				<a href="https://fmaclen.gumroad.com/l/chromabox" target="_blank">Gumroad</a>
				<a href="https://github.com/fmaclen/chromabox" target="_blank">GitHub</a>
				<a href="https://fernando.is" target="_blank">Contact</a>
			</nav>
		</footer>
	</div>
{:else}
	<div class="layout">
		<main class="main">
			{@render children()}
		</main>
	</div>
{/if}

<style lang="postcss">
	.layout {
		@apply grid h-screen text-sm;
	}

	.layout--demo {
		@apply h-min;
	}

	.demo-header {
		@apply container mx-auto my-32 flex flex-col items-center gap-4 text-center;

		h1 {
			@apply text-6xl font-bold tracking-tighter;
		}

		h2 {
			@apply text-2xl font-light tracking-wider;
		}
	}

	.button {
		@apply rounded-md bg-stone-900 px-6 py-2 font-semibold text-stone-50;
	}

	.main {
		@apply overflow-auto rounded-lg border;
		@apply flex h-full flex-col;
	}

	.main--demo {
		@apply container mx-auto h-[1071px] overflow-hidden;
	}

	.demo-footer {
		@apply container mx-auto my-16 flex flex-row items-center justify-center gap-4;

		nav {
			@apply ml-auto flex flex-row items-center justify-center gap-4;
		}
	}
</style>
