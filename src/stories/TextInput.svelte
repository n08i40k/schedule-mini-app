<script lang="ts">
	interface Props {
		type?: "number" | "text" | "email" | "password" | "search" | "tel" | "url";

		name?: string;
		value?: string;

		autofocus?: boolean;

		pattern?: string;

		placeholder?: string;
		leadingIcon?: string;

		readonly?: boolean;
		error?: boolean;
		disabled?: boolean;

		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
	}

	let {
		type = "text",

		name,
		value = $bindable(""),

		autofocus,

		pattern,

		placeholder,
		leadingIcon,

		readonly,
		error,
		disabled,

		oninput: _oninput,
		onchange: _onchange
	}: Props = $props();

	const oninput = () => _oninput?.(value);
	const onchange = () => _onchange?.(value);
</script>

<div
	class="bg-contrast flex h-fit w-full items-center rounded-xl border-none py-1 outline-transparent"
>
	{#if leadingIcon !== undefined}
		<span
			class="mso px-2 text-[1.2em] transition-colors duration-150"
			class:text-gray-500={value.length === 0}
			class:text-error={error}
		>
			{leadingIcon}
		</span>
	{/if}

	<!-- svelte-ignore a11y_autofocus -->
	<input
		class="disable-focus-outline w-full rounded-none border-none bg-transparent py-1 transition-colors duration-150"
		class:text-gray-500={value.length === 0}
		class:text-error={error}
		class:placeholder-error={error}
		class:pl-0={leadingIcon != null}
		{type}
		{name}
		bind:value
		{autofocus}
		{pattern}
		{placeholder}
		{readonly}
		{disabled}
		{oninput}
		{onchange}
	/>
</div>
