<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import TextInput from "./TextInput.svelte";

	const { Story } = defineMeta({
		title: "Simple/TextInput",
		component: TextInput,
		tags: ["autodocs"],
		argTypes: {
			value: { control: "text" },
			type: {
				control: { type: "select" },
				options: ["text", "password"]
			},
			placeholder: { control: "text" },
			leadingIcon: {
				control: { type: "select" },
				options: ["person"]
			},
			disabled: { control: "boolean" },
			error: { control: "boolean" }
		}
	});
</script>

<Story name="Text" args={{ type: "text" }} />
<Story name="Password" args={{ type: "password" }} />
