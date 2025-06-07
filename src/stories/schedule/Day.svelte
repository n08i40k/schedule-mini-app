<script lang="ts">
	import * as m from "$lib/paraglide/messages";
	import Lesson from "./Lesson.svelte";
	import type { DayType } from "$lib/requests/schema/schedule";
	import { LessonTypeEnum } from "$lib/requests/schema/schedule";

	type DayProps = Pick<DayType, "lessons">;

	// TODO: надо будет посмотреть где в приложении показывалась улица, ибо сейчас я не ебу и мне лень искать
	const { lessons }: DayProps = $props();

	function extractMinutes(date: Date) {
		return date.getHours() * 60 + date.getMinutes();
	}

	function getBreakDuration(id: number) {
		return extractMinutes(lessons[id + 1].time.start) - extractMinutes(lessons[id - 1].time.end);
	}
</script>

<div class="flex flex-col gap-4 p-2">
	{#each lessons as lesson, id (id)}
		{#if LessonTypeEnum.Break !== lesson.type}
			<Lesson {...lesson} />
		{:else}
			<div class="flex items-center">
				<div class="w-full grow border-1 px-4 opacity-30"></div>
				<div class="px-2 whitespace-nowrap opacity-50">{getBreakDuration(id)} {m.minutes()}</div>
				<div class="w-full grow border-1 px-4 opacity-30"></div>
			</div>
		{/if}
	{/each}

	{#if lessons.length === 0}
		<div class="bold light:text-green-700 w-full text-center font-bold dark:text-green-500">
			{m.no_lessons()}
		</div>
	{/if}
</div>
