<script lang="ts">
	import "../app.css";
	import SvelteTheme from "$lib/svelte-themes/SvelteTheme.svelte";
	import type { LayoutProps } from "./$types";
	import BottomNavBar from "../stories/BottomNavBar.svelte";

	let { data, children }: LayoutProps = $props();
</script>

{#if data.user?.group}
	<BottomNavBar>
		{@render children()}
	</BottomNavBar>
{:else}
	{@render children()}
{/if}

<SvelteTheme attribute="class" />
