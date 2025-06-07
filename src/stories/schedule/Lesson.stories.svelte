<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Lesson from "./Lesson.svelte";
	import { LessonTypeEnum, type SubGroupType } from "$lib/requests/schema/schedule";

	const defaultSubGroups: Array<SubGroupType | null> = [
		{ teacher: "Хомченко Н.Е.", cabinet: "с/з" }
	];

	const bothSubGroups: Array<SubGroupType | null> = [
		{ teacher: "Хомченко Н.Е.", cabinet: "с/з" },
		{ teacher: "Таганов А.?.", cabinet: "42" }
	];

	const onlyFirstSubGroup: Array<SubGroupType | null> = [
		{ teacher: "Хомченко Н.Е.", cabinet: "с/з" },
		null
	];

	const { Story } = defineMeta({
		title: "Schedule/Lesson",
		component: Lesson,
		tags: ["autodocs"],
		argTypes: {
			current: { control: { type: "boolean" } },
			type: { control: { type: "range", min: 0, max: LessonTypeEnum.CourseProjectDefense } },
			name: { control: { type: "text" } },
			group: { control: { type: "text" } }
		},
		args: {
			range: [1, 1],
			name: 'Производственная практика ПП.ПМ.05 "Разработка и тестирование информационных систем"',
			time: { start: new Date(), end: new Date() },
			subgroups: defaultSubGroups
		}
	});
</script>

<Story name="Default" />
<Story name="Current" args={{ current: true }} />

<Story name="Both subgroups" args={{ subgroups: bothSubGroups }} />
<Story name="Only first subgroup" args={{ subgroups: onlyFirstSubGroup }} />

<Story name="None subgroups" args={{ subgroups: undefined }} />

<Story name="Long" args={{ range: [1, 3] }} />

<Story name="With group name" args={{ group: "ИС-214/23" }} />

<Story name="With custom type" args={{ type: LessonTypeEnum.Exam }} />
