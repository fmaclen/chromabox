import Field from './Field.svelte';
import Input from './Input.svelte';
import Label from './Label.svelte';
import Select from './Select.svelte';
import Toggle from './Toggle.svelte';

const FieldComponent = Object.assign(Field, {
	Input,
	Label,
	Select,
	Toggle
});

export default FieldComponent;
