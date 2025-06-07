import { z } from "zod/v4";

export enum UserRole {
	Student = "STUDENT",
	Teacher = "TEACHER",
	Admin = "ADMIN"
}

export const UserSchema = z.object({
	id: z.string().length(24),
	username: z.string(),
	group: z.string().nullable(),
	role: z.enum(UserRole),
	vkId: z.number().nullable(),
	telegramId: z.number().nullable(),
	accessToken: z.string().nullable()
});
