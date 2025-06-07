<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import HorizontalPager from "./HorizontalPager.svelte";

	const { Story } = defineMeta({
		title: "Pager/Horizontal",
		component: HorizontalPager,
		tags: ["autodocs"],
		argTypes: {}
	});
</script>

{#snippet itemSnippet(item: unknown)}
	<div class="h-40 w-full overflow-clip rounded-2xl bg-black p-5">{item}</div>
{/snippet}

<Story
	name="Primary"
	args={{ items: ["123", "321", "1234 234", "234f234f"], itemSnippet: itemSnippet }}
/>
