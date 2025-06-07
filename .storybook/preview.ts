import "../src/app.css";

import type { Preview } from "@storybook/svelte";
import { withThemeByClassName } from "@storybook/addon-themes";
import { themes } from "storybook/theming";
import PreviewDecorator from "./PreviewDecorator.svelte";

const preview: Preview = {
	decorators: [
		withThemeByClassName({
			themes: {
				light: "light",
				dark: "dark"
			},
			defaultTheme: "dark"
		}),
		() => PreviewDecorator
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		darkMode: {
			current: "dark",
			stylePreview: true,
			classTarget: "body",
			darkClass: "vc-dark",
			lightClass: "light",
			dark: { ...themes.dark, appBg: "black" },
			light: { ...themes.normal, appBg: "red" }
		}
	},
	tags: ["autodocs"]
};

export default preview;
