<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import WeekDaySelector from "./WeekDaySelector.svelte";
	import { fn } from "@storybook/test";

	const { Story } = defineMeta({
		title: "Schedule/WeekDaySelector",
		component: WeekDaySelector,
		tags: ["autodocs"],
		args: { startDate: new Date(), onselect: fn() }
	});
</script>

<Story name="Default" />
