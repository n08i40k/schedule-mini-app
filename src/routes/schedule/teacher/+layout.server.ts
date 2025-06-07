import type { LayoutServerLoad } from "./$types";
import { apiServerClient } from "$lib/server/requests";
import { redirect } from "@sveltejs/kit";
import { APISchema } from "$lib/requests/schema/api";

export const load: LayoutServerLoad = async ({ parent: _parent, cookies, route }) => {
	const parent = await _parent();

	const client = apiServerClient(cookies.get("access_token")!);
	const { names } = await client
		.get(APISchema.Schedule.TeacherNamesSchema, undefined)
		.then((result) => result.ok);

	if (route.id === "/schedule/teacher") redirect(307, `/schedule/teacher/${names[0]}`);

	return { ...parent, teacherNames: names };
};
