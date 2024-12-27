<script lang="ts">
	import { onMount } from 'svelte';

	import type { Color } from '$lib/palette.svelte';

	const DEFAULT_COLOR_1 = '#EAEAEA';
	const DEFAULT_COLOR_2 = '#CCCCCC';
	const DEFAULT_COLOR_3 = '#999999';
	const DEFAULT_COLOR_4 = '#666666';
	const DEFAULT_COLOR_5 = '#333333';
	const DEFAULT_COLOR_6 = '#222222';

	let { colors }: { colors: Color[] } = $props();
	let faviconElement: HTMLLinkElement | undefined = $state();
	let box = $state({
		color1: DEFAULT_COLOR_1,
		color2: DEFAULT_COLOR_2,
		color3: DEFAULT_COLOR_3,
		color4: DEFAULT_COLOR_4,
		color5: DEFAULT_COLOR_5,
		color6: DEFAULT_COLOR_6
	});

	$effect(() => {
		box.color1 = colors[0]?.source.hex || DEFAULT_COLOR_1;
		box.color2 = colors[1]?.source.hex || DEFAULT_COLOR_2;
		box.color3 = colors[2]?.source.hex || DEFAULT_COLOR_3;
		box.color4 = colors[3]?.source.hex || DEFAULT_COLOR_4;
		box.color5 = colors[4]?.source.hex || DEFAULT_COLOR_5;
		box.color6 = colors[5]?.source.hex || DEFAULT_COLOR_6;
		setFavicon();
	});

	onMount(setFavicon);

	function setFavicon() {
		const svg = `
		<svg width="593" height="686" viewBox="0 0 593 686" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M294.586 685.465L296.112 342.822L0.137288 515.465L294.586 685.465Z" fill="${box.color1}"/>
		<path d="M296.113 342.821L1.66422 172.822L0.138761 515.464L296.113 342.821Z" fill="${box.color2}"/>
		<path d="M296.111 342.822L297.637 0.179677L1.66268 172.822L296.111 342.822Z" fill="${box.color3}"/>
		<path d="M296.111 342.822L297.637 0.178713L592.086 170.179L296.111 342.822Z" fill="${box.color4}"/>
		<path d="M296.111 342.823L592.086 170.18L590.561 512.822L296.111 342.823Z" fill="${box.color5}"/>
		<path d="M590.561 512.822L296.111 342.822L294.587 685.464L590.561 512.822Z" fill="${box.color6}"/>
		</svg>
		`;

		faviconElement?.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(svg)}`);
	}
</script>

<svelte:head>
	<link rel="icon" bind:this={faviconElement} />
</svelte:head>
