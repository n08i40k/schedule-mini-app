<script lang="ts">
	import * as m from "$lib/paraglide/messages";
	import { slide } from "svelte/transition";

	// constants
	const monthTranslations: Array<() => string> = [
		m.month_january,
		m.month_february,
		m.month_march,
		m.month_april,
		m.month_may,
		m.month_june,
		m.month_july,
		m.month_august,
		m.month_september,
		m.month_october,
		m.month_november,
		m.month_december
	];

	const dayOfWeekTranslations: Array<[() => string, () => string]> = [
		[m.day_monday, m.day_short_monday],
		[m.day_tuesday, m.day_short_tuesday],
		[m.day_wednesday, m.day_short_wednesday],
		[m.day_thursday, m.day_short_thursday],
		[m.day_friday, m.day_short_friday],
		[m.day_saturday, m.day_short_saturday]
	];

	// types
	interface Props {
		startDate: Date;
		value: number;
		loading?: boolean;
		onselect?: (day: number) => void;
	}

	// dynamic data
	let { startDate, value = $bindable(0), loading, onselect }: Props = $props();

	const weekDates: Array<Date> = $derived([
		startDate,
		new Date(startDate.getTime() + 86400000),
		new Date(startDate.getTime() + 86400000 * 2),
		new Date(startDate.getTime() + 86400000 * 3),
		new Date(startDate.getTime() + 86400000 * 4),
		new Date(startDate.getTime() + 86400000 * 5)
	]);

	// 0 - day of week.
	// 1 - month.
	const translations: Array<[[() => string, () => string], () => string]> = $derived(
		weekDates.map((date, index) => [
			dayOfWeekTranslations[index],
			monthTranslations[date.getMonth()]
		])
	);

	// functions
	function onclick(id: number) {
		if (loading) return;

		value = id;

		onselect?.call(onselect, id);
	}

	function lerp(from: number, to: number, t: number) {
		return from + (to - from) * t;
	}

	interface TextSlideProps {
		duration?: number;
		delay?: number;
	}

	function textSlide(
		node: HTMLElement,
		props: TextSlideProps = {},
		options: { direction: "out" | "in" | "both" }
	) {
		console.assert(
			options.direction === "both",
			"This transition can be used only using 'transition:' keyword!"
		);
		const { duration = 400, delay } = props;

		if (node.inert) {
			return { duration, delay };
		}

		const previous = node.previousSibling as HTMLElement;
		console.assert(
			previous !== null && previous.inert,
			"Previous element should exist and be inert!"
		);

		const width = {
			from: previous.getBoundingClientRect().width,
			to: node.getBoundingClientRect().width
		};

		const backup = {
			width: node.style.width,
			opacity: node.style.opacity
		};

		if (width.from > width.to) {
			node.hidden = true;
		} else {
			previous.style.position = "absolute";
			node.style.width = `${width.from}px`;
			node.style.opacity = "0";
		}

		return {
			duration,
			delay,
			tick: (t: number) => {
				if (t === 1) {
					node.style.width = backup.width;
					node.style.opacity = backup.opacity;
					return;
				}

				if (width.from > width.to) {
					if (t < 0.8) {
						t = t * (5 / 4);

						previous.style.width = `${lerp(width.from, width.to, t)}px`;
					} else {
						t = (t - 0.8) * 5;

						previous.style.position = "absolute";
						previous.style.opacity = (1 - t).toString();

						node.style.opacity = t.toString();
						node.hidden = false;
					}
				} else {
					if (t < 0.2) {
						t = t * 5;

						previous.style.opacity = (1 - t).toString();

						node.style.opacity = t.toString();
					} else {
						t = (t - 0.2) * (5 / 4);

						previous.style.opacity = "0";

						node.style.width = `${lerp(width.from, width.to, t)}px`;
					}
				}
			}
		};
	}
</script>

<div
	class="week-day-selector bg-contrast align-center flex w-full flex-col gap-2 rounded-2xl px-4 py-3"
>
	<div class="px-2 [.loading]:animate-pulse" class:loading>
		{#key value}
			<div class="text-2xl font-bold" transition:slide>
				{translations[value][0][0]()},
				{translations[value][1]()}
				{weekDates[value].getDate()}
			</div>
		{/key}
	</div>

	<div class="selector flex w-full gap-2">
		<!--{value}-->
		{#each dayOfWeekTranslations as weekDay, id (weekDay)}
			<!--{id} {id === value}-->
			<button class:sel={id === value} onclick={() => onclick(id)}>
				{#key value === id}
					<div transition:textSlide>{weekDay[+(id !== value)]()}</div>
				{/key}
			</button>
		{/each}
	</div>
</div>
