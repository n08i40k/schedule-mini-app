<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import TextSelect from "./TextSelect.svelte";

	const { Story } = defineMeta({
		title: "Simple/TextSelect",
		component: TextSelect,
		tags: ["autodocs"],
		argTypes: {
			disabled: { control: { type: "boolean" } },
			value: { control: { type: "text" } },
			variants: { control: { type: "text" } }
		}
	});
</script>

<Story name="Main" />
<Story name="Disabled" args={{ disabled: true }} />
