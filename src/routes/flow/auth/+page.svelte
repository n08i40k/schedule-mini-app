<!--suppress JSUnresolvedReference -->

<script lang="ts">
	import MessageBox from "../../../stories/MessageBox.svelte";

	import { onMount } from "svelte";
	import { blur, draw } from "svelte/transition";
	import * as easing from "svelte/easing";

	import { apiClient } from "$lib/requests";

	import * as m from "$lib/paraglide/messages";
	import { APISchema } from "$lib/requests/schema/api";

	const steps = [
		m.pre_sign_in_step_page_loading,
		m.pre_sign_in_step_authorization,
		m.pre_sign_in_step_redirect
	];

	let messages: Array<() => string> = $state([steps[0]]);
	const messagesView = $derived(messages.map((message) => message()));

	enum StepState {
		PROCESSING,
		ERROR,
		SUCCESS
	}

	let currentStepState: StepState = $state(StepState.PROCESSING);
	let errorMessage = $state("");

	onMount(() => {
		next();

		const initData = window.Telegram?.WebApp?.initData;

		if (!initData) {
			error(m.error_flow_telegram_auth_invalid_init_data());
			return;
		}

		apiClient
			.post(APISchema.Flow.Telegram.AuthSchema, { initData: initData }, undefined)
			.then(async (result) => {
				if (result.isOk()) {
					const callback = await window.fetch(
						`/api/auth/callback?token=${encodeURIComponent(result.ok.accessToken)}`,
						{ method: "POST", credentials: "same-origin" }
					);
					if (!callback.ok) {
						error(m.error_unknown());
						return;
					}
					next();
					window.location.href = result.ok.completed ? "/schedule/group" : "/flow/complete";
				} else {
					error(
						APISchema.Flow.Telegram.AuthSchema.ErrorMessages.get(result.err.code)?.() ??
							m.error_unknown()
					);
				}
			})
			.catch(() => error(m.error_bad_connection()));
	});

	function error(message: string) {
		errorMessage = message;
		currentStepState = StepState.ERROR;
	}

	function next() {
		if (messages.length >= 3) {
			currentStepState = StepState.SUCCESS;
			return;
		}

		messages.push(steps[messages.length]);
	}
</script>

<div
	class="flex h-dvh w-dvw flex-col items-center gap-10 not-landscape:justify-center landscape:gap-5 landscape:justify-self-start landscape:pt-[7vh]"
>
	<div class="relative flex h-32 w-32 items-center justify-center">
		{#snippet circle(rotate: boolean)}
			<svg
				width="100%"
				height="100%"
				class="absolute animate-[spin-clockwise_1s_linear_infinite] transition-all duration-1000"
				class:rotate-90={rotate}
				class:stroke-neutral-600={currentStepState === StepState.PROCESSING}
				class:stroke-red-700={currentStepState === StepState.ERROR}
				class:stroke-green-700={currentStepState === StepState.SUCCESS}
				xmlns="http://www.w3.org/2000/svg"
				stroke-width="2"
				viewBox="0.5 0 24 24"
			>
				<path
					fill="none"
					d="M12.5 23c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11"
					stroke-linecap="round"
				></path>
			</svg>
		{/snippet}

		{@render circle(false)}
		{@render circle(currentStepState !== StepState.PROCESSING)}

		{#key currentStepState}
			<svg
				class="absolute stroke-red-700"
				class:hidden={currentStepState !== StepState.ERROR}
				xmlns="http://www.w3.org/2000/svg"
				height="48px"
				viewBox="0 0 101.56847 101.56847"
				width="48px"
			>
				<path
					transition:draw={{ duration: 500, delay: 500, easing: easing.cubicIn }}
					stroke-width="20"
					d="M 99.164304,2.4041631 2.4041632,99.164304 v 0 z"
					id="path1"
				/>

				<path
					transition:draw={{ duration: 500, delay: 500 + 150 }}
					stroke-width="20"
					d="M 2.4041632,2.4041631 99.164294,99.164304 v 0 z"
					id="path1-0"
				/>
			</svg>
		{/key}
	</div>

	<div class="relative flex flex-col items-center">
		{#if currentStepState === StepState.PROCESSING}
			<div class="absolute flex flex-col items-center uppercase">
				<p
					class="animate-pulse font-mono text-2xl font-bold"
					id="processing-title"
					in:blur={{ duration: 500, delay: 500, amount: 2 }}
					out:blur={{ duration: 500, amount: 2 }}
				>
					загрузка
				</p>
			</div>
		{:else if currentStepState === StepState.ERROR}
			<div
				class="absolute flex flex-col items-center"
				in:blur={{ duration: 500, delay: 500, amount: 2 }}
				out:blur={{ duration: 500, amount: 2 }}
			>
				<p class="font-mono text-2xl font-bold text-red-600 uppercase" id="error-title">ОШИБКА</p>

				<p class="w-[85vw] text-center landscape:w-[75vw]">
					{errorMessage}
				</p>
			</div>
		{/if}
	</div>

	<div class="absolute bottom-0 w-55 self-center pb-[5vh]">
		<MessageBox
			messages={messagesView}
			success={currentStepState === StepState.SUCCESS}
			error={currentStepState === StepState.ERROR}
		/>
	</div>
</div>
