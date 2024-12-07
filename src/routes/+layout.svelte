<script lang="ts">
	import '../app.css';

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
	<div class="layout">
		<header class="header">
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
		<main class="main">
			<slot />
		</main>
		<footer class="footer">
			<p>&copy; {new Date().getFullYear()} Chromabox</p>
			<nav>
				<a href="https://fmaclen.gumroad.com/l/chromabox" target="_blank">Gumroad</a>
				<a href="https://github.com/fmaclen/chromabox" target="_blank">GitHub</a>
				<a href="https://fernando.is" target="_blank">Contact</a>
			</nav>
		</footer>
	</div>
{:else}
	<slot />
{/if}

<style lang="postcss">
	.layout {
		@apply grid h-full min-h-screen grid-rows-[max-content_auto_max-content] gap-16 bg-stone-50 py-16;
	}

	.header {
		@apply container mx-auto flex flex-col items-center gap-4 text-center;

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
		@apply mx-16 max-h-[75vh] rounded-lg border;
	}

	.footer {
		@apply container mx-auto flex flex-row items-center justify-center gap-4;

		nav {
			@apply ml-auto flex flex-row items-center justify-center gap-4;
		}
	}
</style>
