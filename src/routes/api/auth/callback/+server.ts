import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const DAY = 60 * 60 * 24;

export const POST: RequestHandler = async ({ url, cookies }) => {
	const token = url.searchParams.get("token");
	if (!token) {
		throw error(400, "Missing token");
	}

	if (!/^[A-Za-z0-9._\-~]+$/.test(token) || token.length > 4096) {
		throw error(400, "Invalid token");
	}

	cookies.set("access_token", token, {
		httpOnly: true,
		secure: true,
		path: "/",
		sameSite: "lax",
		maxAge: 7 * DAY
	});

	return new Response(null, { status: 200 });
};
