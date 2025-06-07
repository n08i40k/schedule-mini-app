<script lang="ts">
	import "./post-register.css";

	import TextInput from "../TextInput.svelte";
	import TextSelect from "../TextSelect.svelte";
	import Button from "../Button.svelte";
	import Hint from "../Hint.svelte";

	import * as m from "$lib/paraglide/messages";
	import { FlowTelegramCompleteErrorCode } from "$lib/requests/schema/api";

	interface Props {
		username: string;

		groups: Array<string>;
		group: string;

		canPM?: boolean;
		onpmrequest: () => void;

		error: FlowTelegramCompleteErrorCode | null;

		readonly?: boolean;
		oncontinue: () => void;
	}

	let {
		username: _username = $bindable(),

		groups: _groups,
		group = $bindable(),

		canPM = false,
		onpmrequest,

		error = $bindable(null),

		readonly,
		oncontinue
	}: Props = $props();

	const groups = $derived(new Map(_groups.map((value) => [value, value])));

	class PMDialog {
		private _isOpen = $state(false);

		get isOpen() {
			return this._isOpen;
		}

		open() {
			this._isOpen = true;
		}

		close() {
			this._isOpen = false;
		}

		oninput() {
			if (canPM) this.close();
		}

		onclick() {
			onpmrequest();
		}
	}

	class UsernameWrapper {
		get value(): string {
			return _username;
		}

		set value(value: string) {
			_username = value;
		}

		get isAlreadyExists() {
			return error === FlowTelegramCompleteErrorCode.UsernameAlreadyExists;
		}

		get isBadLength() {
			return this.value.length < 4 || this.value.length > 32;
		}

		get total() {
			return this.isAlreadyExists || this.isBadLength;
		}

		handleChange() {
			if (error === FlowTelegramCompleteErrorCode.UsernameAlreadyExists) error = null;
		}
	}

	const pmDialog = new PMDialog();
	const username = new UsernameWrapper();

	$effect(pmDialog.oninput.bind(pmDialog));
</script>

<div class="post-register-screen flex h-dvh w-full flex-col items-center justify-evenly">
	<h1 class="text-4xl font-bold">{m.post_reg_title()}</h1>

	<div class="flex w-sm max-w-[90dvw] grow-[0.3] flex-col gap-10">
		<div>
			<h2>{m.post_reg_username()}</h2>

			<TextInput
				bind:value={username.value}
				error={username.total}
				{readonly}
				oninput={() => username.handleChange()}
			/>

			<Hint
				text={m.error_username_already_exists()}
				type="error"
				disabled={!username.isAlreadyExists}
			/>

			<Hint text={m.error_username_length()} type="error" disabled={!username.isBadLength} />
		</div>

		<div>
			<h2>{m.post_reg_group()}</h2>
			<TextSelect bind:value={group} variants={groups} disabled={readonly} />
		</div>

		<div>
			<h2>{m.post_reg_allow_pm()}</h2>
			<button
				type="button"
				class="w-full rounded-xl border border-yellow-500 py-1.5 transition-colors active:brightness-75 [.allowed]:border-green-500"
				class:allowed={canPM}
				disabled={canPM}
				onclick={pmDialog.open.bind(pmDialog)}
			>
				{m.allow_btn()}
			</button>
		</div>
	</div>

	<div class="w-sm">
		<Button
			label={m.continue_btn()}
			onclick={oncontinue}
			size="large"
			primary
			disabled={!canPM || username.total || readonly}
		/>

		<div class="px-2">
			<Hint
				text={m.error_unknown()}
				type="error"
				disabled={!error || error !== FlowTelegramCompleteErrorCode.UsernameAlreadyExists}
			/>

			<Hint text={m.post_reg_continue_hint()} type="warning" disabled={canPM} />
		</div>
	</div>
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="absolute top-0 left-0 flex h-dvh w-dvw items-center justify-center opacity-0 backdrop-brightness-25 transition-opacity not-[.open]:pointer-events-none [.open]:opacity-100"
	class:open={pmDialog.isOpen}
	onclick={() => pmDialog.close()}
>
	<div
		class="bg-contrast mx-4 flex flex-col gap-4 rounded-2xl border p-4"
		onclick={(ev) => ev.stopPropagation()}
	>
		<h1 class="self-center text-2xl font-bold">{m.pm_for_what()}</h1>

		<div class="flex flex-col gap-3">
			<p>{m.pm_for_what_1()}</p>
			<p>{m.pm_for_what_2()}</p>
		</div>

		<button
			type="button"
			class="w-full rounded-xl border px-3 py-1.5 transition-colors active:brightness-75"
			onclick={pmDialog.onclick.bind(pmDialog)}
		>
			{m.allow_btn()}
		</button>
	</div>
</div>
