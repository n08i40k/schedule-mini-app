<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Week from "./Week.svelte";
	import { type DayType, type LessonType } from "$lib/requests/schema/schedule";

	const randomLessons: Array<LessonType> = [
		{
			type: 1,
			range: null,
			name: "Линейка",
			time: {
				start: new Date("2025-05-19T04:30:00Z"),
				end: new Date("2025-05-19T04:40:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 2,
			range: null,
			name: null,
			time: {
				start: new Date("2025-05-19T04:40:00Z"),
				end: new Date("2025-05-19T04:45:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 1,
			range: null,
			name: "Разговор о важном",
			time: {
				start: new Date("2025-05-19T04:45:00Z"),
				end: new Date("2025-05-19T05:15:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 2,
			range: null,
			name: null,
			time: {
				start: new Date("2025-05-19T05:15:00Z"),
				end: new Date("2025-05-19T05:25:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 0,
			range: [1, 1],
			name: "Основы алгоритмизации и программирования.",
			time: {
				start: new Date("2025-05-19T05:25:00Z"),
				end: new Date("2025-05-19T06:45:00Z")
			},
			subgroups: [
				{
					cabinet: "45",
					teacher: "Ивашов Ю.А."
				},
				{
					cabinet: "31",
					teacher: "Цацаева Т.Н."
				}
			],
			group: null
		},
		{
			type: 2,
			range: null,
			name: null,
			time: {
				start: new Date("2025-05-19T06:45:00Z"),
				end: new Date("2025-05-19T06:55:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 0,
			range: [2, 2],
			name: "Иностранный язык в профессиональной деятельности (английский)",
			time: {
				start: new Date("2025-05-19T06:55:00Z"),
				end: new Date("2025-05-19T08:15:00Z")
			},
			subgroups: [
				{
					cabinet: "22",
					teacher: "Шевель Л.Г."
				},
				{
					cabinet: "23",
					teacher: "Шевель Л.Г."
				}
			],
			group: null
		},
		{
			type: 2,
			range: null,
			name: null,
			time: {
				start: new Date("2025-05-19T08:15:00Z"),
				end: new Date("2025-05-19T08:35:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 0,
			range: [3, 3],
			name: "Архитектура аппаратных средств",
			time: {
				start: new Date("2025-05-19T08:35:00Z"),
				end: new Date("2025-05-19T09:55:00Z")
			},
			subgroups: [
				{
					cabinet: "42",
					teacher: "Сергачева А.О."
				}
			],
			group: null
		},
		{
			type: 2,
			range: null,
			name: null,
			time: {
				start: new Date("2025-05-19T09:55:00Z"),
				end: new Date("2025-05-19T10:05:00Z")
			},
			subgroups: [],
			group: null
		},
		{
			type: 5,
			range: [4, 4],
			name: "Иностранный язык в профессиональной деятельности (английский)",
			time: {
				start: new Date("2025-05-19T10:05:00Z"),
				end: new Date("2025-05-19T11:25:00Z")
			},
			subgroups: [
				{
					cabinet: "22",
					teacher: "Шевель Л.Г."
				},
				{
					cabinet: "23",
					teacher: "Шевель Л.Г."
				}
			],
			group: null
		}
	];

	const days: Array<DayType> = [
		{
			name: "Понедельник",
			date: new Date("2025-05-19T00:00:00Z"),
			lessons: randomLessons,
			street: null
		},
		{
			name: "Вторник",
			date: new Date("2025-05-19T00:00:00Z"),
			lessons: randomLessons,
			street: null
		},
		{
			name: "Среда",
			date: new Date("2025-05-19T00:00:00Z"),
			lessons: [],
			street: null
		},
		{
			name: "Четверг",
			date: new Date("2025-05-19T00:00:00Z"),
			lessons: randomLessons,
			street: null
		},
		{
			name: "Пятница",
			date: new Date("2025-05-19T00:00:00Z"),
			lessons: [],
			street: null
		},
		{
			name: "Суббота",
			date: new Date("2025-05-19T00:00:00Z"),
			lessons: randomLessons,
			street: null
		}
	];

	const { Story } = defineMeta({
		title: "Schedule/Week",
		component: Week,
		tags: ["autodocs"],
		args: { days }
	});
</script>

<Story name="Default" />
