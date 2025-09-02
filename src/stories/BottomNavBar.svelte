<script lang="ts">
	import type { Snippet } from "svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	import * as m from "$lib/paraglide/messages";
	import { NavigationObserver } from "$lib/utils/navigation.svelte";

	interface Props {
		children?: Snippet;
	}

	const { ...props }: Props = $props();

	interface RouteButtonProps {
		icon: string;
		text: () => string;
		targetRoute: string;
	}

	const isCurrentRoute = (route: string) => {
		return page.url.pathname === route || page.url.pathname.startsWith(route + "/");
	};

	const navObserver = new NavigationObserver();
</script>

{#snippet routeButton(props: RouteButtonProps)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="flex flex-col items-center gap-1"
		class:disabled={navObserver.isNavigating}
		role="button"
		onclick={() => !navObserver.isNavigating && goto(props.targetRoute)}
		tabindex="0"
	>
		<div
			class="bg-bnb-selected [.current]:bg-chip-neutral rounded-2xl px-5 py-1 transition-colors duration-300"
			class:current={isCurrentRoute(props.targetRoute)}
		>
			<span class="mso mso-lg align-text-top text-2xl leading-5">
				{props.icon}
			</span>
		</div>

		<div class="relative h-[1.5ch] w-0">
			<p class="absolute p-0 text-xs font-light" style="transform: translateX(-50%)">
				{props.text()}
			</p>
		</div>
	</div>
{/snippet}

<section class="flex flex-col h-screen w-dvw">
	<div class="flex-1">{@render props.children?.()}</div>
	<div class="bg-contrast sticky bottom-0 flex min-h-20 w-full items-center justify-evenly">
		{@render routeButton({
			icon: "account_circle",
			text: m.nav_bar_profile,
			targetRoute: "/account"
		})}
		{@render routeButton({
			icon: "date_range",
			text: m.nav_bar_schedule,
			targetRoute: "/schedule/group"
		})}
		{@render routeButton({
			icon: "person",
			text: m.nav_bar_teachers,
			targetRoute: "/schedule/teacher"
		})}
	</div>
</section>
