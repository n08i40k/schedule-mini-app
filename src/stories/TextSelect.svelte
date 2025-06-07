<script lang="ts">
	interface Props {
		leadingIcon?: string;
		value?: string | null;
		variants: Map<string, string>;
		disabled?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		leadingIcon,
		value = $bindable(),
		variants,
		disabled,
		onchange: _onchange
	}: Props = $props();

	const onchange = (event: Event) =>
		_onchange?.call(undefined, (event.target as HTMLSelectElement).value);
</script>

<div class="bg-contrast flex w-full flex-row items-center rounded-xl">
	{#if leadingIcon}
		<span class="mso pl-2 text-[1.2em]">{leadingIcon}</span>
	{/if}

	<select
		bind:value
		{disabled}
		class="disable-focus-outline w-full border-none bg-transparent pl-2"
		{onchange}
	>
		{#each variants ?? [] as [value, text] (value)}
			<option {value}>{text}</option>
		{/each}
	</select>
</div>
