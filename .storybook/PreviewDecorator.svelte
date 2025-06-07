<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="light:bg-white h-full w-full border-1 dark:bg-neutral-900"
	style="border-color: #88888810"
>
	{@render children()}
</div>
