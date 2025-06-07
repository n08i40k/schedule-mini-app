<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import PostRegister from "./PostRegister.svelte";
	import { fn } from "@storybook/test";
	import { FlowTelegramCompleteErrorCode } from "$lib/requests/schema/api";

	const { Story } = defineMeta({
		title: "Screen/PostRegister",
		component: PostRegister,
		tags: ["autodocs"],
		parameters: {
			layout: "fullscreen"
		},
		args: {
			username: "telegram_430n8rd2349hr87",
			groups: ["ИС-214/23", "ИС-114/24"],
			group: "ИС-214/23",
			onpmrequest: fn(),
			oncontinue: fn()
		}
	});
</script>

<Story name="Default" />
<Story name="Read-only" args={{ readonly: true, canPM: true }} />
<Story
	name="Error | Occupied username"
	args={{ canPM: true, error: FlowTelegramCompleteErrorCode.UsernameAlreadyExists }}
/>
<Story
	name="Error | Already completed"
	args={{ canPM: true, error: FlowTelegramCompleteErrorCode.AlreadyCompleted }}
/>
<Story
	name="Error | Invalid group name"
	args={{ canPM: true, error: FlowTelegramCompleteErrorCode.InvalidGroupName }}
/>
