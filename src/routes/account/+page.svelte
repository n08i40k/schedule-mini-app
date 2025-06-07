<script lang="ts">
	import type { LayoutProps } from "./$types";
	import TextSelect from "../../stories/TextSelect.svelte";
	import { browser } from "$app/environment";
	import { apiClient } from "$lib/requests";
	import ErrorBox, { ClientErrorCode, type ErrorMixin } from "../../stories/ErrorBox.svelte";
	import UsernameInput from "../../stories/UsernameInput.svelte";
	import {
		APISchema,
		UsersChangeGroupErrorCode,
		type UsersChangeUsernameErrorCode
	} from "$lib/requests/schema/api";

	const { data }: LayoutProps = $props();
	const groups = $derived(new Map(data.groupNames.map((v) => [v, v])));

	let username = $state(data.user!.username);
	let usernameLoading = $state(false);
	let usernameError: ErrorMixin<UsersChangeUsernameErrorCode> = $state(null);
	const onUsernameChange = (targetUsername: string) => {
		usernameError = null;
		usernameLoading = true;

		apiClient
			.post(APISchema.Users.ChangeUsername, { username: targetUsername }, undefined)
			.then((result) => {
				if (result.isOk()) username = data.user!.username = targetUsername;
				else usernameError = result.err.code;
			})
			.catch(() => (usernameError = ClientErrorCode.Unknown))
			.finally(() => (usernameLoading = false));
	};

	let group = $state(data.user!.group);
	let groupLoading = $state(false);
	let groupError: ErrorMixin<UsersChangeGroupErrorCode> = $state(null);
	const onGroupChange = (targetGroup: string) => {
		groupError = null;
		groupLoading = true;

		apiClient
			.post(APISchema.Users.ChangeGroup, { group: targetGroup }, undefined)
			.then((result) => {
				if (result.isOk()) group = data.user!.group = targetGroup;
				else groupError = result.err.code;
			})
			.catch(() => (groupError = ClientErrorCode.Unknown))
			.finally(() => (groupLoading = false));
	};
</script>

<div class="flex h-dvh w-dvw flex-col items-center gap-8 px-[10dvw] pt-[15dvh]">
	<div class="border-hint h-[35dvw] w-[35dvw] border-4 bg-gray-500 [&,*]:rounded-[50%]">
		{#if browser}
			<img
				class="animate-fade-in animate-duration-300 w-full"
				src={window.Telegram.WebApp.initDataUnsafe.user?.photo_url ?? ""}
				alt="telegram avatar"
			/>
		{/if}
	</div>

	<div class="flex w-[20rem] flex-col gap-4 [*]:text-[1.2em]">
		<div class="[.loading]:[&>*]:animate-pulse" class:loading={usernameLoading}>
			<ErrorBox error={usernameError} messages={APISchema.Users.ChangeUsername.ErrorMessages}>
				<UsernameInput
					value={username}
					disabled={usernameLoading}
					error={usernameError !== null}
					onchange={onUsernameChange}
				/>
			</ErrorBox>
		</div>

		<div class="[.loading]:[&>*]:animate-pulse" class:loading={groupLoading}>
			<ErrorBox error={groupError} messages={APISchema.Users.ChangeGroup.ErrorMessages}>
				<TextSelect
					leadingIcon="people"
					variants={groups}
					bind:value={group}
					onchange={onGroupChange}
					disabled={groupLoading}
				/>
			</ErrorBox>
		</div>
	</div>
</div>
