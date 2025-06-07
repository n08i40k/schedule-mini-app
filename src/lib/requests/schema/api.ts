import { z } from "zod/v4";
import { util } from "zod/v4/core";
import { ScheduleEntrySchema } from "$lib/requests/schema/schedule";
import { UserSchema } from "$lib/requests/schema/user";

import * as m from "$lib/paraglide/messages";

function ErrorResponse<const T extends util.EnumLike>($enum: T) {
	return z.object({
		code: z.enum($enum),
		message: z.string()
	});
}

export enum FlowTelegramAuthErrorCode {
	InvalidInitData = "INVALID_INIT_DATA",
	ExpiredInitData = "EXPIRED_INIT_DATA"
}

export enum FlowTelegramCompleteErrorCode {
	AlreadyCompleted = "ALREADY_COMPLETED",
	UsernameAlreadyExists = "USERNAME_ALREADY_EXISTS",
	InvalidGroupName = "INVALID_GROUP_NAME"
}

export enum ScheduleGroupErrorCode {
	SignUpNotCompleted = "SIGN_UP_NOT_COMPLETED",
	NotFound = "NOT_FOUND"
}

export enum ScheduleTeacherErrorCode {
	NotFound = "NOT_FOUND"
}

export enum UsersChangeGroupErrorCode {
	NotFound = "NOT_FOUND"
}

export enum UsersChangeUsernameErrorCode {
	AlreadyExists = "ALREADY_EXISTS"
}

export interface RouteSchema {
	Uri: string;
	UriArgsCount: number;

	Request?: z.ZodObject;
	Response?: z.ZodObject;

	ErrorResponse?: z.ZodObject;
	ErrorMessages?: Map<keyof Record<string, string>, () => string>;
}

export const FlowSchema = {
	Telegram: {
		AuthSchema: {
			Uri: "/flow/telegram-auth",
			UriArgsCount: 0,
			Request: z.object({ initData: z.string() }),
			Response: z.object({ completed: z.boolean() }),
			ErrorResponse: ErrorResponse(FlowTelegramAuthErrorCode),
			ErrorMessages: new Map([
				[FlowTelegramAuthErrorCode.ExpiredInitData, m.error_flow_telegram_auth_expired_init_data],
				[FlowTelegramAuthErrorCode.InvalidInitData, m.error_flow_telegram_auth_invalid_init_data]
			])
		} as const satisfies RouteSchema,
		CompleteSchema: {
			Uri: "/flow/telegram-complete",
			UriArgsCount: 0,
			Request: z.object({ username: z.string(), group: z.string() }),
			ErrorResponse: ErrorResponse(FlowTelegramCompleteErrorCode),
			ErrorMessages: new Map([
				[FlowTelegramCompleteErrorCode.AlreadyCompleted, m.error_unknown],
				[FlowTelegramCompleteErrorCode.UsernameAlreadyExists, m.error_username_already_exists],
				[FlowTelegramCompleteErrorCode.InvalidGroupName, m.error_group_not_found]
			])
		} as const satisfies RouteSchema
	}
};

export const ScheduleSchema = {
	GroupNamesSchema: {
		Uri: "/schedule/group-names",
		UriArgsCount: 0,
		Response: z.object({ names: z.array(z.string()) })
	} as const satisfies RouteSchema,
	TeacherNamesSchema: {
		Uri: "/schedule/teacher-names",
		UriArgsCount: 0,
		Response: z.object({ names: z.array(z.string()) })
	} as const satisfies RouteSchema,
	GroupSchema: {
		Uri: "/schedule/group",
		UriArgsCount: 0,
		Response: ScheduleEntrySchema,
		ErrorResponse: ErrorResponse(ScheduleGroupErrorCode),
		ErrorMessages: new Map([
			[ScheduleGroupErrorCode.NotFound, m.error_group_not_found],
			[ScheduleGroupErrorCode.SignUpNotCompleted, m.error_unknown]
		])
	} as const satisfies RouteSchema,
	TeacherSchema: {
		Uri: "/schedule/teacher/{0}",
		UriArgsCount: 1,
		Response: ScheduleEntrySchema,
		ErrorResponse: ErrorResponse(ScheduleTeacherErrorCode),
		ErrorMessages: new Map([[ScheduleTeacherErrorCode.NotFound, m.error_teacher_not_found]])
	} as const satisfies RouteSchema
};

export const UsersSchema = {
	ChangeGroup: {
		Uri: "/users/change-group",
		UriArgsCount: 0,
		Request: z.object({ group: z.string() }),
		ErrorResponse: ErrorResponse(UsersChangeGroupErrorCode),
		ErrorMessages: new Map([[UsersChangeGroupErrorCode.NotFound, m.error_group_not_found]])
	} as const satisfies RouteSchema,
	ChangeUsername: {
		Uri: "/users/change-username",
		UriArgsCount: 0,
		Request: z.object({ username: z.string() }),
		ErrorResponse: ErrorResponse(UsersChangeUsernameErrorCode),
		ErrorMessages: new Map([
			[UsersChangeUsernameErrorCode.AlreadyExists, m.error_username_already_exists]
		])
	} as const satisfies RouteSchema,
	Me: {
		Uri: "/users/me",
		UriArgsCount: 0,
		Response: UserSchema
	} as const satisfies RouteSchema
};

export const APISchema = {
	Flow: FlowSchema,
	Schedule: ScheduleSchema,
	Users: UsersSchema
};
