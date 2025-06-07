<!--suppress JSUnusedGlobalSymbols -->
<script lang="ts">
	import WeekDaySelector from "./WeekDaySelector.svelte";
	import Day from "./Day.svelte";
	import HorizontalPager from "../pager/HorizontalPager.svelte";
	import type { ScheduleEntryType } from "$lib/requests/schema/schedule";

	// types
	type WeekProps = {
		selectedDay?: number;
		loading?: boolean;
	} & Pick<ScheduleEntryType, "days">;

	// dynamic data

	// TODO: надо будет посмотреть где в приложении показывалась улица, ибо сейчас я не ебу и мне лень искать
	let { selectedDay = $bindable(0), loading, days }: WeekProps = $props();

	function onselect(id: number) {
		selectedDay = id;
	}
</script>

<div class="flex flex-col gap-4 p-2">
	<WeekDaySelector bind:value={selectedDay} startDate={days[0].date} {loading} />

	<div class="bg-contrast rounded-2xl py-1">
		<HorizontalPager page={selectedDay} {onselect} items={days} {loading}>
			{#snippet itemSnippet(item: unknown)}
				<Day lessons={(item as DayType).lessons} />
			{/snippet}
		</HorizontalPager>
	</div>
</div>
