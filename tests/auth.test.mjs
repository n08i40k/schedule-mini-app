import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";

const server = await createServer({
	configFile: false,
	server: { middlewareMode: true, watch: null, hmr: false, ws: false },
	plugins: [
		{
			name: "test-api-host",
			resolveId(id) {
				if (id === "$env/static/public") return "\0test-api-host";
				if (id === "$lib/server/requests") return "\0test-server-client";
				if (id === "$lib/requests/schema/api") return "\0test-api-schema";
			},
			load(id) {
				if (id === "\0test-api-host") return 'export const PUBLIC_API_HOST = "api.example.test";';
				if (id === "\0test-server-client")
					return 'export const apiServerClient = () => { throw new Error("Unexpected API call"); };';
				if (id === "\0test-api-schema") return "export const APISchema = {};";
			}
		}
	]
});
after(() => server.close());

const proxy = await server.ssrLoadModule("/src/routes/api/v1/[...path]/+server.ts");
const callback = await server.ssrLoadModule("/src/routes/api/auth/callback/+server.ts");
const { UserSchema } = await server.ssrLoadModule("/src/lib/requests/schema/user.ts");
const layout = await server.ssrLoadModule("/src/routes/+layout.server.ts");

test("visitors without a session can reach login without calling the API", async () => {
	assert.deepEqual(
		await layout.load({ route: { id: "/flow/auth" }, cookies: { get: () => undefined } }),
		{ user: null }
	);
	await assert.rejects(
		layout.load({ route: { id: "/schedule/group" }, cookies: { get: () => undefined } }),
		(error) => error.status === 307 && error.location === "/flow/auth"
	);
});

test("login works using only the Mini App cookie, without an API domain cookie", async (t) => {
	const session = new Map();
	const cookies = {
		get: (name) => session.get(name),
		set: (name, value, options) => {
			assert.equal(options.httpOnly, true);
			assert.equal(options.sameSite, "lax");
			assert.equal(options.path, "/");
			session.set(name, value);
		}
	};
	const initData = "user=%7B%22id%22%3A123%7D&signature=abc-_&hash=xyz";
	let calls = 0;
	t.mock.method(globalThis, "fetch", async (url, options) => {
		calls++;
		assert.equal(url.origin, "https://api.example.test");
		assert.equal(options.redirect, "manual");
		assert.equal(options.headers.get("cookie"), null);
		if (url.pathname === "/api/v1/flow/telegram-auth") {
			assert.equal(options.headers.get("authorization"), null);
			assert.deepEqual(JSON.parse(new TextDecoder().decode(options.body)), { initData });
			return Response.json(
				{ completed: true, accessToken: "test.jwt.token" },
				{ headers: { "set-cookie": "access_token=ignored; Domain=api.example.test" } }
			);
		}
		assert.equal(url.pathname, "/api/v1/users/me");
		assert.equal(url.search, "?test=1");
		assert.equal(options.headers.get("authorization"), "Bearer test.jwt.token");
		return Response.json({ id: "123", accessToken: null });
	});

	const loginUrl = new URL("https://mini.example.test/api/v1/flow/telegram-auth");
	const login = await proxy.POST({
		url: loginUrl,
		cookies,
		request: new Request(loginUrl, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ initData })
		})
	});
	assert.equal(login.headers.get("set-cookie"), null);
	assert.equal(login.headers.get("cache-control"), "no-store");
	const { accessToken } = await login.json();
	const saved = await callback.POST({
		url: new URL(`https://mini.example.test/api/auth/callback?token=${accessToken}`),
		cookies
	});
	assert.equal(saved.status, 200);
	const meUrl = new URL("https://mini.example.test/api/v1/users/me?test=1");
	const me = await proxy.GET({ url: meUrl, cookies, request: new Request(meUrl) });
	assert.equal(me.status, 200);
	assert.equal((await me.json()).id, "123");
	assert.equal(calls, 2);
});

test("API authentication failures retain their status and error code", async (t) => {
	t.mock.method(globalThis, "fetch", async () =>
		Response.json({ code: "EXPIRED_INIT_DATA", message: "Expired" }, { status: 401 })
	);
	const url = new URL("https://mini.example.test/api/v1/flow/telegram-auth");
	const result = await proxy.POST({
		url,
		cookies: { get: () => undefined },
		request: new Request(url, { method: "POST", body: "{}" })
	});
	assert.equal(result.status, 401);
	assert.equal((await result.json()).code, "EXPIRED_INIT_DATA");
});

test("network failures become a gateway error", async (t) => {
	t.mock.method(globalThis, "fetch", async () => {
		throw new TypeError("Network unavailable");
	});
	const url = new URL("https://mini.example.test/api/v1/users/me");
	await assert.rejects(
		proxy.GET({ url, cookies: { get: () => undefined }, request: new Request(url) }),
		(error) => error.status === 502
	);
});

test("the session callback rejects missing and malformed tokens", async () => {
	for (const token of ["", "invalid token", "a".repeat(4097)]) {
		const url = new URL("https://mini.example.test/api/auth/callback");
		url.searchParams.set("token", token);
		await assert.rejects(
			callback.POST({
				url,
				cookies: { set: () => assert.fail("Invalid token must not create a session") }
			}),
			(error) => error.status === 400
		);
	}
});

test("user responses accept omitted, null and string access tokens", () => {
	const user = {
		id: "0123456789abcdef01234567",
		username: "student",
		group: "group",
		role: "STUDENT",
		vkId: null,
		telegramId: 123
	};
	for (const extra of [{}, { accessToken: null }, { accessToken: "test.jwt.token" }]) {
		assert.equal(UserSchema.safeParse({ ...user, ...extra }).success, true);
	}
});
