<!--suppress JSUnresolvedReference -->

<script lang="ts">
	import PostRegister from "../../../stories/screen/PostRegister.svelte";

	import type { LayoutProps } from "./$types";
	import { onMount } from "svelte";
	import { apiClient } from "$lib/requests";
	import { APISchema, FlowTelegramCompleteErrorCode } from "$lib/requests/schema/api";

	let { data }: LayoutProps = $props();

	let username = $state(data.user!.username);
	let group = $state(data.groupNames![0]);

	let canPM = $state(true);
	onMount(() => (canPM = window.Telegram.WebApp.initDataUnsafe.user!.allows_write_to_pm === true));

	let error: FlowTelegramCompleteErrorCode | null = $state(null);

	const onpmrequest = () => {
		window.Telegram.WebApp.requestWriteAccess((success) => (canPM = success));
	};

	let readonly = $state(false);
	const oncontinue = () => {
		readonly = true;

		apiClient
			.post(APISchema.Flow.Telegram.CompleteSchema, { username, group }, undefined)
			.then((result) => {
				if (result.isOk()) window.location.href = "/schedule/group";
				else error = result.err.code;
			})
			.finally(() => (readonly = false));
	};
</script>

<PostRegister
	bind:username
	groups={data.groupNames}
	bind:group
	{canPM}
	{onpmrequest}
	bind:error
	{readonly}
	{oncontinue}
/>
