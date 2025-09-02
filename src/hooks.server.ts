import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";
import type { Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$lib/paraglide/server";

Sentry.init({
	dsn: "https://ec1d4fb226c65db91c617955320029cc@sentry.n08i40k.ru/12",
	tracesSampleRate: 1,
	enableLogs: true
});

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace("%paraglide.lang%", locale)
		});
	});

export const handle: Handle = sequence(Sentry.sentryHandle(), handleParaglide);
export const handleError = Sentry.handleErrorWithSentry();
