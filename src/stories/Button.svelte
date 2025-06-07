<script lang="ts">
	import "./button.css";

	interface Props {
		primary?: boolean;
		disabled?: boolean;
		backgroundColor?: string;
		size?: "small" | "medium" | "large";
		label: string;
		onclick?: () => void;
	}

	const {
		primary = false,
		disabled = false,
		backgroundColor,
		size = "medium",
		label,
		onclick
	}: Props = $props();
</script>

<button
	type="button"
	class={`storybook-button--${size} inline-block w-full cursor-pointer rounded-2xl border-none leading-none font-bold transition-[filter] active:brightness-80`}
	class:storybook-button--primary={primary}
	class:storybook-button--secondary={!primary}
	style:background-color={backgroundColor}
	{onclick}
	{disabled}
>
	{label}
</button>
