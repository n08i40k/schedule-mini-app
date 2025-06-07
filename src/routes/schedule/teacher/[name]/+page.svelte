<script lang="ts">
	import type { LayoutProps } from "./$types";
	import Week from "../../../../stories/schedule/Week.svelte";
	import { afterNavigate, beforeNavigate } from "$app/navigation";

	let { data }: LayoutProps = $props();
	let selectedDay = $state(0);
	let loading = $state(false);

	beforeNavigate(() => (loading = true));
	afterNavigate(() => (loading = false));
</script>

<div class="p-2">
	<Week bind:selectedDay days={data.teacher.days} {loading} />
</div>
