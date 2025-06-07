<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import Hint from "./Hint.svelte";

	import * as m from "$lib/paraglide/messages";

	interface Props {
		name?: string;
		value: string;

		autofocus?: boolean;

		readonly?: boolean;
		error?: boolean;
		disabled?: boolean;

		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
	}

	let {
		name,
		value = $bindable(),
		autofocus,
		readonly,
		error,
		disabled,
		oninput,
		onchange
	}: Props = $props();
	const tooShort = $derived(value.length < 4 || value.length > 32);
</script>

<div>
	<TextInput
		{name}
		bind:value
		{autofocus}
		{readonly}
		{disabled}
		error={error || tooShort}
		{oninput}
		{onchange}
	/>

	<Hint text={m.error_username_length()} type="error" disabled={!tooShort} />
</div>
