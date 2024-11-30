<script lang="ts">
	import { colord, type Colord } from 'colord';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';

	let { color }: { color: Colord } = $props();

	// It seems that the ColorPicker component doesn't work as expected when binded
	// to the 'color: Colord' prop. However, it does update the color value when it is
	// binded to the 'hex: string' prop.
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

<form class="color">
	<ColorPicker bind:hex components={ChromeVariant} isDialog={false} sliderDirection="horizontal" />

	<fieldset class="color__fieldset">
		<div class="color__input-item">
			<label for="color-hex">HEX</label>
			<input id="color-hex" type="text" value={color.toHex()} onblur={handleColorInput} />
		</div>

		<div class="color__input-item">
			<label for="color-rgb">RGB</label>
			<input id="color-rgb" type="text" value={color.toRgbString()} onblur={handleColorInput} />
		</div>

		<div class="color__input-item">
			<label for="color-hsl">HSL</label>
			<input id="color-hsl" type="text" value={color.toHslString()} onblur={handleColorInput} />
		</div>
	</fieldset>
</form>

<style>
	form.color {
		/* These are the styles of the ColorPicker component */
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

	fieldset.color__fieldset {
		display: flex;
		flex-direction: column;
		gap: 5px;
		border: none;
		padding: 0;
		margin: 0;
	}

	.color__input-item {
		display: flex;
		gap: 10px;
	}

	.color__input-item input {
		width: 100%;
	}
</style>
