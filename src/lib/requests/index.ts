declare global {
	// noinspection JSUnusedGlobalSymbols
	interface Window {
		axios: (typeof import("axios"))["default"];
	}
}

import type { AxiosInstance } from "axios";

import { dev, browser } from "$app/environment";
import { HighLevelApiClient } from "$lib/requests/client";

const _apiClient: HighLevelApiClient | undefined = browser
	? new HighLevelApiClient(
			window.axios.create({
				baseURL: `/api/v1`,
				withCredentials: true
			})
		)
	: undefined;

const _devApiClient: AxiosInstance | undefined =
	browser && dev
		? window.axios.create({
				baseURL: `/dev`,
				withCredentials: true,
				responseType: "json"
			})
		: undefined;

export const apiClient = _apiClient as HighLevelApiClient;
export const devApiClient = _devApiClient as AxiosInstance;
