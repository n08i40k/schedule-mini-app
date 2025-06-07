<script lang="ts">
	import * as m from "$lib/paraglide/messages";
	import {
		type LessonType,
		LessonTypeEnum,
		type SubGroupType
	} from "$lib/requests/schema/schedule";

	const typeMap = new Map<LessonTypeEnum, () => string>([
		[LessonTypeEnum.Consultation, m.lesson_type_consultation],
		[LessonTypeEnum.IndependentWork, m.lesson_type_independent_work],
		[LessonTypeEnum.Exam, m.lesson_type_exam],
		[LessonTypeEnum.ExamWithGrade, m.lesson_type_exam_with_grade],
		[LessonTypeEnum.ExamDefault, m.lesson_type_exam_default],
		[LessonTypeEnum.CourseProject, m.lesson_type_course_project],
		[LessonTypeEnum.CourseProjectDefense, m.lesson_type_course_project_defense]
	]);

	interface TextWithIconProps {
		icon: string;
		text: string;
	}

	const { current = false, ...lesson }: LessonType & { current?: boolean } = $props();

	const index = $derived(lesson.range?.at(0));
	const size = $derived(lesson.range ? lesson.range![1] - lesson.range![0] + 1 : null);

	const indexStr = $derived(
		size && index ? (size === 1 ? index.toString() : `${index}-${index + size - 1}`) : null
	);
	const typeStr = $derived(typeMap.get(lesson.type));
</script>

<div
	class="flex items-center gap-4 [.long-lesson]:py-1 [.longer-lesson]:py-2"
	class:long-lesson={size === 2}
	class:longer-lesson={size === 3}
>
	<!--time block-->
	<div class="flex flex-col items-center gap-1.5 *:font-mono *:leading-none">
		<div>{lesson.time.start.toTimeString().substring(0, 5)}</div>
		<div>{lesson.time.end.toTimeString().substring(0, 5)}</div>

		{#if indexStr}
			<div class="light:border-black w-10 rounded-sm border-1"></div>
			<div class="text-sm">{indexStr}</div>
		{/if}
	</div>

	<!--divider between two main blocks-->
	<div
		class="light:border-black light:[.current-lesson]:border-blue-400 h-12 rounded-sm border-1 [.current-lesson]:animate-[pulsing_1s_ease-in-out_infinite] dark:[.current-lesson]:border-blue-600"
		class:current-lesson={current}
	></div>

	<!--main block-->
	<div class="flex w-full flex-col gap-1 not-first:leading-none">
		{#snippet text_with_icon({ icon, text }: TextWithIconProps)}
			<div class="flex items-center gap-2">
				<span class="mso text-sm">
					{icon}
				</span>
				<div class="pt-[0.0875em] align-text-bottom text-sm leading-none">{text}</div>
			</div>
		{/snippet}

		{#snippet subgroup_col(data: SubGroupType | null, index: number)}
			<div class="flex flex-col gap-0.5 text-sm">
				{#if data}
					{@render text_with_icon({ icon: "school", text: data.teacher || "??" })}
					{@render text_with_icon({ icon: "meeting_room", text: data.cabinet || "??" })}
				{:else}
					{index === 0 ? m.only_first_subgroup() : m.only_second_subgroup()}
				{/if}
			</div>
		{/snippet}

		<!--first row-->
		<div>
			{#if typeStr}
				<div
					class="leading-5 font-bold [.priority-high]:text-red-500 [.priority-low]:text-green-500 [.priority-low]:opacity-30 [.priority-medium]:text-orange-500 [.priority-medium]:opacity-60"
					class:priority-low={[
						LessonTypeEnum.Consultation,
						LessonTypeEnum.IndependentWork
					].includes(lesson.type)}
					class:priority-medium={[LessonTypeEnum.CourseProject].includes(lesson.type)}
					class:priority-high={[
						LessonTypeEnum.Exam,
						LessonTypeEnum.ExamWithGrade,
						LessonTypeEnum.ExamDefault,
						LessonTypeEnum.CourseProjectDefense
					]}
				>
					{typeStr()}
				</div>
			{/if}
			<div class="leading-5 font-bold">{lesson.name}</div>

			{#if lesson.group}
				{@render text_with_icon({ icon: "group", text: lesson.group })}
			{/if}
		</div>

		<!--subgroups row-->
		<div class="flex max-w-xs items-center justify-between px-1">
			{#if lesson.subgroups}
				{#each lesson.subgroups as subgroup, id (id)}
					{@render subgroup_col(subgroup, id)}

					{#if lesson.subgroups.length - 1 !== id}
						<div class="light:border-black mx-1 h-8 rounded-sm border-1"></div>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
</div>
