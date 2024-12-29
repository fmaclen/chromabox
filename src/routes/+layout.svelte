<script lang="ts">
	import '../app.css';

	import { STORE_URL, VIEWPORT_SIZE } from '$lib';

	import {
		PUBLIC_IS_DEMO,
		PUBLIC_PLAUSIBLE_API,
		PUBLIC_PLAUSIBLE_DOMAIN,
		PUBLIC_PLAUSIBLE_SRC
	} from '$env/static/public';
	import A from '$lib/components/A.svelte';
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
			<div class="demo-header__titles">
				<h1>Chromabox</h1>
				<h2>The ultimate color palette generator for designers & developers</h2>
			</div>
			<nav class="flex flex-row items-center justify-center gap-2">
				<a class="button" href={STORE_URL} target="_blank"> Buy now </a>
				<a
					class="button button--secondary"
					href="https://github.com/fmaclen/chromabox#self-hosting"
					target="_blank"
				>
					Self-host
				</a>
			</nav>
		</header>

		<main class="main main--demo" style="height: {VIEWPORT_SIZE.height}px;">
			{@render children()}
		</main>

		<footer class="demo-footer">
			<p>&copy; {new Date().getFullYear()} Chromabox</p>
			<nav>
				<A href={STORE_URL} target="_blank">Gumroad</A>
				<A href="https://github.com/fmaclen/chromabox" target="_blank">GitHub</A>
				<A href="https://fernando.is" target="_blank">Contact</A>
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
		@apply container mx-auto my-32 flex flex-col items-center gap-16 text-center;

		h1 {
			@apply text-6xl font-bold tracking-tighter;
		}

		h2 {
			@apply text-balance text-2xl font-light tracking-wider;
		}
	}

	.demo-header__titles {
		@apply flex flex-col gap-3;
	}

	.button {
		@apply rounded-md bg-stone-900 px-8 py-3 text-lg font-semibold text-stone-50 shadow;
		@apply hover:scale-105 hover:shadow-lg;
		@apply active:scale-95 active:shadow-none;
		@apply transition-all duration-100;
	}

	.button--secondary {
		@apply border border-stone-900/25 bg-transparent text-stone-900;
	}

	.main {
		@apply overflow-auto;
		@apply flex h-full flex-col;
	}

	.main--demo {
		@apply container mx-auto overflow-hidden rounded-lg border shadow-2xl;
	}

	.demo-footer {
		@apply container mx-auto my-16 flex flex-row items-center justify-center gap-4;

		nav {
			@apply ml-auto flex flex-row items-center justify-center gap-4;
		}
	}
</style>
