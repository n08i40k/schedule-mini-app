import * as Sentry from "@sentry/sveltekit";
import { browser, dev } from "$app/environment";
import { devApiClient } from "$lib/requests";

Sentry.init({
	dsn: "https://ec1d4fb226c65db91c617955320029cc@sentry.n08i40k.ru/12",
	tracesSampleRate: 1,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.replayIntegration()],
	enableLogs: true
});

export const handleError = Sentry.handleErrorWithSentry();

if (browser && dev) {
	const original = {
		debug: console.debug,
		log: console.log,
		info: console.info,
		warn: console.warn,
		error: console.error
	};

	function sendLog(level: keyof typeof original, args: never[]) {
		void devApiClient.post("/logs", { level, args, timestamp: new Date().getTime() });
	}

	Object.keys(original).map((_level) => {
		const level = _level as keyof typeof original;

		console[level] = (...args: never[]) => {
			original[level].apply(console, args);

			if (level === "log" && args.length >= 1 && typeof args[0] === "string") {
				const arg = args[0] as string;

				if (arg.includes("tgbrowser") || arg.includes("Telegram.WebView")) return;
			}

			sendLog(level, args);
		};
	});
}
