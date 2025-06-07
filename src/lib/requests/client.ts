import type { RouteSchema } from "$lib/requests/schema/api";
import { z } from "zod/v4";
import type { AxiosError, AxiosInstance } from "axios";
import { Result, type ResultType } from "$lib/result";

type TupleOfLength<N extends number, R extends string[] = []> = N extends 0
	? never
	: R["length"] extends N
		? R
		: TupleOfLength<N, [...R, string]>;

type IndexedTupleOfLength<N extends number> = N extends 0
	? undefined
	: TupleOfLength<N> & Record<number, string>;

type InferRequest<S extends RouteSchema> = S["Request"] extends z.ZodObject
	? z.infer<S["Request"]>
	: never;

type InferResponse<S extends RouteSchema> = S["Response"] extends z.ZodObject
	? z.infer<S["Response"]>
	: never;

type InferErrorResponse<S extends RouteSchema> = S["ErrorResponse"] extends z.ZodObject
	? z.infer<S["ErrorResponse"]>
	: never;

type NonUndef<T> = Exclude<T, undefined>;

type RequestResultTemplate<S extends RouteSchema> = ResultType<
	NonUndef<InferResponse<S>>,
	NonUndef<InferErrorResponse<S>>
>;

// noinspection JSUnusedGlobalSymbols
export class HighLevelApiClient {
	constructor(private readonly lowerLevel: AxiosInstance) {}

	async makeRequest<S extends RouteSchema>(
		schema: S,
		body: InferRequest<S>,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>,
		method: "GET" | "POST" | "PATCH" | "HEAD" | "PUT" | "DELETE"
	): Promise<RequestResultTemplate<S>> {
		const filledUri =
			schema.UriArgsCount > 0
				? schema.Uri.replace(/\{(\d+)\}/g, (_, idx: string) => encodeURIComponent(uriArgs![+idx]))
				: schema.Uri;

		type Response = NonUndef<InferResponse<S>>;
		type ErrorResponse = NonUndef<InferErrorResponse<S>>;

		return await this.lowerLevel
			.request<NonUndef<InferResponse<S>>>({
				method,
				url: filledUri,
				data: body
			})
			.then((response) => {
				return Result.ok(schema.Response?.parse(response.data) as Response);
			})
			.catch((error: AxiosError) => {
				if (error.response === undefined && schema.ErrorResponse === undefined) throw error;
				return Result.err(schema.ErrorResponse!.parse(error.response!.data) as ErrorResponse);
			});
	}

	async get<S extends RouteSchema>(
		schema: S,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>
	): Promise<RequestResultTemplate<S>> {
		return await this.makeRequest(schema, undefined as InferResponse<S>, uriArgs, "GET");
	}

	async post<S extends RouteSchema>(
		schema: S,
		body: InferRequest<S>,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>
	): Promise<RequestResultTemplate<S>> {
		return await this.makeRequest(schema, body, uriArgs, "POST");
	}

	async patch<S extends RouteSchema>(
		schema: S,
		body: InferRequest<S>,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>
	): Promise<RequestResultTemplate<S>> {
		return await this.makeRequest(schema, body, uriArgs, "PATCH");
	}

	async head<S extends RouteSchema>(
		schema: S,
		body: InferRequest<S>,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>
	): Promise<RequestResultTemplate<S>> {
		return await this.makeRequest(schema, body, uriArgs, "HEAD");
	}

	async put<S extends RouteSchema>(
		schema: S,
		body: InferRequest<S>,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>
	): Promise<RequestResultTemplate<S>> {
		return await this.makeRequest(schema, body, uriArgs, "PUT");
	}

	async delete<S extends RouteSchema>(
		schema: S,
		body: InferRequest<S>,
		uriArgs: IndexedTupleOfLength<S["UriArgsCount"]>
	): Promise<RequestResultTemplate<S>> {
		return await this.makeRequest(schema, body, uriArgs, "DELETE");
	}
}
