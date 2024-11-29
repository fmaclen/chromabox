<script lang="ts">
	import { colord, type Colord } from 'colord';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';

	let { color }: { color: Colord } = $props();

	let hex = $state(color.toHex());

	$effect(() => {
		hex = color.toHex();
	});

	$effect(() => {
		color = colord(hex);
	});

	function handleColorInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (colord(event.target.value).isValid()) color = colord(event.target.value);
	}
</script>

<div class="color-card">
	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

	<div class="color-card__input-group">
		<div class="color-card__input-item">
			<div>HEX</div>
			<input type="text" value={color.toHex()} onblur={handleColorInput} data-testid="hex-input" />
		</div>

		<div class="color-card__input-item">
			<div>RGB</div>
			<input
				type="text"
				value={color.toRgbString()}
				onblur={handleColorInput}
				data-testid="rgb-input"
			/>
		</div>

		<div class="color-card__input-item">
			<div>HSL</div>
			<input
				type="text"
				value={color.toHslString()}
				onblur={handleColorInput}
				data-testid="hsl-input"
			/>
		</div>
	</div>
</div>

<style>
	.color-card {
		:global(.color-picker .wrapper) {
			margin: 0;
			border: none;
		}
		:global(.text-input) {
			display: none;
		}
		width: fit-content;
		padding: 10px;
		border: 1px solid rgba(0, 0, 0, 0.25);
		border-radius: 10px;
	}

	.color-card__input-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.color-card__input-item {
		display: flex;
		gap: 10px;
	}

	.color-card__input-item input {
		width: 100%;
	}
</style>
