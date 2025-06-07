<script module lang="ts">
	export enum ClientErrorCode {
		BadConnection = "BAD_CONNECTION",
		Unknown = "UNKNOWN"
	}

	export type ErrorMixin<T> = ClientErrorCode | T | null;
</script>

<script lang="ts">
	import type { Snippet } from "svelte";
	import Hint from "./Hint.svelte";

	import * as m from "$lib/paraglide/messages";

	interface Props {
		children: Snippet;
		error?: ErrorMixin<string>;
		messages: Map<string, () => string>;
	}

	const builtinMessages = new Map<string, () => string>([
		[ClientErrorCode.Unknown, m.error_unknown],
		[ClientErrorCode.BadConnection, m.error_bad_connection]
	]);

	const { children, error, messages }: Props = $props();
</script>

<div>
	{@render children()}
	<Hint
		type="error"
		text={error ? (builtinMessages.get(error)?.() ?? messages.get(error)?.() ?? error) : "empty"}
		disabled={error === null}
	/>
</div>
