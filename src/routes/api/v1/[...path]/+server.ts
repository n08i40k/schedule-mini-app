import { PUBLIC_API_HOST } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// Keep browser requests and the session cookie on the Mini App's own origin.
const proxy: RequestHandler = async ({ request, url, cookies }) => {
	const upstream = new URL(`https://${PUBLIC_API_HOST}`);
	upstream.pathname = url.pathname;
	upstream.search = url.search;

	const headers = new Headers();
	const contentType = request.headers.get("content-type");
	if (contentType) headers.set("content-type", contentType);

	const accessToken = cookies.get("access_token");
	if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

	let response: Response;
	try {
		response = await fetch(upstream, {
			method: request.method,
			headers,
			body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
			redirect: "manual"
		});
	} catch {
		error(502, "API unavailable");
	}

	// The callback sets the local session cookie; upstream cookie domains do not apply here.
	const responseHeaders = new Headers({ "cache-control": "no-store" });
	const responseContentType = response.headers.get("content-type");
	if (responseContentType) responseHeaders.set("content-type", responseContentType);

	return new Response(response.body, {
		status: response.status,
		headers: responseHeaders
	});
};

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
