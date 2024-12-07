<script lang="ts">
	import { type Colord } from 'colord';
	import { onMount } from 'svelte';

	const DEFAULT_COLOR_TOP = '#ccc';
	const DEFAULT_COLOR_LEFT = '#d1d1d1';
	const DEFAULT_COLOR_RIGHT = '#999';

	let { colors }: { colors: Colord[] } = $props();
	let faviconElement: HTMLLinkElement | undefined = $state();
	let box: { top: string; left: string; right: string } = $state({
		top: DEFAULT_COLOR_TOP,
		left: DEFAULT_COLOR_LEFT,
		right: DEFAULT_COLOR_RIGHT
	});

	$effect(() => {
		box.top = colors[1]?.toHex() || DEFAULT_COLOR_TOP;
		box.left = colors[0]?.toHex() || DEFAULT_COLOR_LEFT;
		box.right = colors[2]?.toHex() || DEFAULT_COLOR_RIGHT;
		setFavicon();
	});

	onMount(setFavicon);

	function setFavicon() {
		const svg = `
    <svg width="475" height="598" viewBox="0 0 475 598" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="top" d="M234.5 327L0 161.5V430L234.5 597.5V327Z" fill="${box.top}"/>
    <path class="left" d="M233 0L0 161.5L235.5 327L474.5 161.5L233 0Z" fill="${box.left}"/>
    <path class="right" d="M474.5 162L235 327.5V596L472.5 424L474.5 162Z" fill="${box.right}"/>
    </svg>
    `;

		faviconElement?.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(svg)}`);
	}
</script>

<svelte:head>
	<link rel="icon" bind:this={faviconElement} />
</svelte:head>
