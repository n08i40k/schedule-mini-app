import axios from "axios";
import type { AxiosInstance } from "axios";

import { dev, browser } from "$app/environment";
import { HighLevelApiClient } from "$lib/requests/client";

const _apiClient: HighLevelApiClient | undefined = browser
	? new HighLevelApiClient(
			axios.create({
				baseURL: "/api/v1",
				withCredentials: true
			})
		)
	: undefined;

const _devApiClient: AxiosInstance | undefined =
	browser && dev
		? axios.create({
				baseURL: `/dev`,
				withCredentials: true,
				responseType: "json"
			})
		: undefined;

export const apiClient = _apiClient as HighLevelApiClient;
export const devApiClient = _devApiClient as AxiosInstance;
