import axios from "axios";
import { HighLevelApiClient } from "$lib/requests/client";
import { PUBLIC_API_HOST } from "$env/static/public";

export const apiServerClient: (accessToken: string) => HighLevelApiClient = (accessToken) =>
	new HighLevelApiClient(
		axios.create({
			baseURL: `https://${PUBLIC_API_HOST}/api/v1`,
			responseType: "json",
			headers: {
				Cookie: `access_token=${accessToken}`
			}
		})
	);
