import axios from "axios";
import { HighLevelApiClient } from "$lib/requests/client";

export const apiServerClient: (accessToken: string) => HighLevelApiClient = (accessToken) =>
	new HighLevelApiClient(
		axios.create({
			baseURL: `https://${import.meta.env.VITE_HOST}/api/v1`,
			responseType: "json",
			headers: {
				Cookie: `access_token=${accessToken}`
			}
		})
	);
