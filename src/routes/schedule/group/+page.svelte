<script lang="ts">
	import type { LayoutProps } from "./$types";
	import Week from "../../../stories/schedule/Week.svelte";

	let { data }: LayoutProps = $props();
	let selectedDay = $state(0);
</script>

<div class="p-2">
	<Week bind:selectedDay days={data.group.days} />
</div>
