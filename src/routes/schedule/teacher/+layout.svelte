<script lang="ts">
	import type { LayoutProps } from "./$types";
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation";

	let { data, children }: LayoutProps = $props();

	let teacher = $state(data.teacherNames[0]);
	let readonly = $state(false);

	const onchange = () => goto(`/schedule/teacher/${teacher}`);

	beforeNavigate(() => (readonly = true));
	afterNavigate(() => (readonly = false));
</script>

<div class="[.loading]:[&&]:animate-text-pulse" class:loading={readonly}>
	<select
		bind:value={teacher}
		{onchange}
		disabled={readonly}
		class="disable-focus-outline bg-contrast h-15 w-full border-none px-7"
	>
		{#each data.teacherNames as teacher (teacher)}
			<option value={teacher}>{teacher}</option>
		{/each}
	</select>

	{@render children()}
</div>
