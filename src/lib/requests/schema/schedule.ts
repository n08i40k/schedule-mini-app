// noinspection JSUnusedGlobalSymbols

import z from "zod/v4";

export enum LessonTypeEnum {
	Default = 0,
	Additional,
	Break,
	Consultation,
	IndependentWork,
	Exam,
	ExamWithGrade,
	ExamDefault,
	CourseProject,
	CourseProjectDefense,
	Practice
}

export const LessonTypeSchema = z.enum(LessonTypeEnum);

export const SubGroupSchema = z.object({
	cabinet: z.string().nullable(),
	teacher: z.string().nullable()
});
export type SubGroupType = z.infer<typeof SubGroupSchema>;

export const LessonBoundariesSchema = z.object({
	start: z.coerce.date(),
	end: z.coerce.date()
});
export type LessonBoundariesType = z.infer<typeof LessonBoundariesSchema>;

export const LessonSchema = z.object({
	type: LessonTypeSchema,
	range: z.array(z.int32()).nullable(),
	name: z.string().nullable(),
	time: LessonBoundariesSchema,
	subgroups: z.array(SubGroupSchema.nullable()),
	group: z.string().nullable()
});
export type LessonType = z.infer<typeof LessonSchema>;

export const DaySchema = z.object({
	name: z.string(),
	street: z.string().nullable(),
	date: z.coerce.date(),
	lessons: z.array(LessonSchema)
});
export type DayType = z.infer<typeof DaySchema>;

export const ScheduleEntrySchema = z.object({
	name: z.string(),
	days: z.array(DaySchema)
});
export type ScheduleEntryType = z.infer<typeof ScheduleEntrySchema>;
