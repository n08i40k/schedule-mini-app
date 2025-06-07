<script lang="ts">
	import { slide } from "svelte/transition";

	interface Props {
		text: string;
		type?: "success" | "default" | "warning" | "error";
		disabled?: boolean;
	}

	const { text, type = "default", disabled = false }: Props = $props();
</script>

{#if !disabled}
	<p
		transition:slide
		class="center text-hint [.success]:text-success [.warning]:text-warning [.error]:text-error px-2 pt-1 text-sm"
		class:success={type === "success"}
		class:warning={type === "warning"}
		class:error={type === "error"}
	>
		<span class="mso align-bottom text-sm">
			{#if type === "success"}
				check_circle
			{:else if type === "default"}
				info
			{:else if type === "warning"}
				warning
			{:else if type === "error"}
				error
			{/if}
		</span>
		{text}
	</p>
{/if}
