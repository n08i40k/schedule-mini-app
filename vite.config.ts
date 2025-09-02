import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import { sentrySvelteKit } from "@sentry/sveltekit";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "VITE_");

	return {
		plugins: [
			tailwindcss(),
			sveltekit(),
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/lib/paraglide"
			}),
			sentrySvelteKit({
				sourceMapsUploadOptions: {
					org: "schedule-parser",
					project: "mini-app",
					url: "https://sentry.n08i40k.ru/"
				},
				adapter: "auto"
			})
		],
		server: {
			allowedHosts: ["mini-app.polytechnic.n08i40k.ru", "mini-app.polytechnic.dev.n08i40k.ru"],
			proxy: {
				"/api": {
					target: `https://${env.VITE_API_HOST}`,
					changeOrigin: true,
					rewrite: (path) => path
				}
			}
		}
	};
});
