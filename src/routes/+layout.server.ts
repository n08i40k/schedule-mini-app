import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { apiServerClient } from "$lib/server/requests";
import { APISchema } from "$lib/requests/schema/api";
import type { AxiosError } from "axios";

export const load: LayoutServerLoad = async ({ route, cookies }) => {
	const routeId = route.id;
	const accessToken = cookies.get("access_token");

	function check_and_reroute(to: string) {
		if (routeId !== "/flow/auth" && routeId !== to && !routeId?.startsWith("/api/")) {
			console.log(`redirecting from ${routeId} to ${to}`);
			redirect(307, to);
		}
	}

	if (!accessToken) check_and_reroute("/flow/auth");

	const client = apiServerClient(accessToken!);
	const user = await client
		.get(APISchema.Users.Me, undefined)
		.then((result) => result.ok)
		.catch((error: AxiosError) => {
			if (error.status === 401) return null;

			throw error;
		});

	if (!user) check_and_reroute("/flow/auth");
	else if (!user.group) check_and_reroute("/flow/complete");
	else if (["/", "/flow/auth", "/flow/complete"].includes(routeId || ""))
		redirect(307, "/schedule/group");

	return { user };
};
