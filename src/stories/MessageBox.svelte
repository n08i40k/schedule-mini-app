<script lang="ts">
	import { flip } from "svelte/animate";

	export interface MessageBoxProps {
		messages: Array<string>;
		error?: boolean;
		success?: boolean;
	}

	const { messages, error = false, success = false }: MessageBoxProps = $props();
</script>

<div class="message-box flex w-full flex-col items-center gap-3">
	{#each messages as msg, id (id)}
		<div
			class="message"
			class:last:border-red-700={error}
			class:last:border-green-700={success}
			animate:flip={{ duration: 350 }}
		>
			<div class="flex w-full items-center justify-between">
				<p style="transform: translateY(1.25px);" class="w-full pr-2 text-center uppercase">
					{msg}
				</p>

				<div
					class="h-4 w-4 rounded-full transition-colors duration-350"
					class:bg-yellow-800={!(success || error) && id === messages.length - 1}
					class:bg-red-800={error && id === messages.length - 1}
					class:bg-green-800={success || id < messages.length - 1}
					class:animate-pulse={!(success || error) && id === messages.length - 1}
				></div>
			</div>
		</div>
	{/each}
</div>
