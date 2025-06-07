import type { RequestHandler } from "@sveltejs/kit";
import { dev } from "$app/environment";

const emptyResponse = new Response(null, { status: 204 });

interface Request {
	level: "debug" | "log" | "info" | "warn" | "error";
	args: never[];
	timestamp: number;
}

export const POST: RequestHandler = async ({ request }) => {
	if (!dev) return emptyResponse;

	const { level, args, timestamp }: Request = await request.json();

	if (level! in ["debug", "log", "info", "warn", "error"]) return emptyResponse;

	console[level](`[CLIENT ${new Date(timestamp).toISOString()}]`, ...args);
	return emptyResponse;
};
