import type { LayoutServerLoad } from "../../$types";
import { apiServerClient } from "$lib/server/requests";
import { APISchema } from "$lib/requests/schema/api";

export const load: LayoutServerLoad = async ({ parent: _parent, cookies }) => {
	const parent = await _parent();

	const client = apiServerClient(cookies.get("access_token")!);
	const group = await client
		.get(APISchema.Schedule.GroupSchema, undefined)
		.then((result) => result.ok);

	return { ...parent, group };
};
