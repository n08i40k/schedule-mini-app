<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Hint from "./Hint.svelte";

	const { Story } = defineMeta({
		title: "Simple/Hint",
		component: Hint,
		tags: ["autodocs"],
		argTypes: {}
	});
</script>

<Story name="Default" args={{ text: "oo fuck yourself" }} />
<Story name="Success" args={{ text: "Go fuck yourself", type: "success" }} />
<Story name="Warning" args={{ text: "Go fuck yourself", type: "warning" }} />
<Story name="Error" args={{ text: "Go fuck yourself", type: "error" }} />
