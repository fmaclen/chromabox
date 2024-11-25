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

<div class="color-picker-container">
	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

	<div class="color-picker-input-group">
		<div class="color-picker-input-item">
			<div>HEX</div>
			<input type="text" value={color.toHex()} onblur={handleColorInput} />
		</div>

		<div class="color-picker-input-item">
			<div>RGB</div>
			<input type="text" value={color.toRgbString()} onblur={handleColorInput} />
		</div>

		<div class="color-picker-input-item">
			<div>HSL</div>
			<input type="text" value={color.toHslString()} onblur={handleColorInput} />
		</div>
	</div>
</div>

<style>
	.color-picker-container {
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

	.color-picker-input-group {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.color-picker-input-item {
		display: flex;
		gap: 10px;
	}

	.color-picker-input-item input {
		width: 100%;
	}
</style>
