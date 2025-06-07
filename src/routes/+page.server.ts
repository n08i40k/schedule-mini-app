// import type { PageServerLoad } from "./$types";
// import { redirect } from "@sveltejs/kit";
// import { apiServerClient } from "$lib/server/requests";
// import type { UserEntity } from "$lib/requests/types/entity/user";
//
// export const load: PageServerLoad = async ({ route, cookies }) => {
// 	const routeId = route.id;
// 	const accessToken = cookies.get("access_token");
//
// 	function check_and_reroute(to: string) {
// 		if (!routeId?.startsWith("/flow/") && !routeId?.startsWith("/api/")) {
// 			console.log(`redirecting from ${routeId} to ${to}`);
// 			redirect(307, to);
// 		}
// 	}
//
// 	if (!accessToken) check_and_reroute("/flow/auth");
//
// 	const client = apiServerClient(accessToken!);
// 	const user = await client
// 		.get<UserEntity>("users/me")
// 		.then((response) => response.data)
// 		.catch(() => null);
//
// 	if (!user) check_and_reroute("/flow/auth");
// 	else if (!user.group) check_and_reroute("/flow/complete");
// 	else if (["/", "/flow/auth", "/flow/complete"].includes(routeId || ""))
// 		redirect(307, "/schedule");
//
// 	return { user };
// };
