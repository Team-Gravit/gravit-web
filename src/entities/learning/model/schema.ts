import { z } from "zod";
import type {
	LearningDetailResponse,
	RecommendedUnitResponse,
	WeeklyLearningRecordResponse,
} from "@/shared/api/@generated";

export const weeklyLearningRecordSchema = z.object({
	MONDAY: z.boolean().default(false),
	TUESDAY: z.boolean().default(false),
	WEDNESDAY: z.boolean().default(false),
	THURSDAY: z.boolean().default(false),
	FRIDAY: z.boolean().default(false),
	SATURDAY: z.boolean().default(false),
	SUNDAY: z.boolean().default(false),
});

export const unitProgressSchema = z.object({
	unitId: z.number(),
	title: z.string().default(""),
	isCompleted: z.boolean().default(false),
});

export const learningDetailSchema = z.object({
	consecutiveSolvedDays: z.number().default(0),
	recentSolvedChapterId: z.number().optional(),
	recentSolvedChapterTitle: z.string().optional(),
	recentSolvedChapterProgressRate: z.number().optional(),
	units: z.array(unitProgressSchema).default([]),
});

export const recommendedUnitSchema = z.object({
	unitId: z.number(),
	unitTitle: z.string().default(""),
	chapterId: z.number(),
	chapterTitle: z.string().default(""),
});

export type WeeklyLearningRecord = z.infer<typeof weeklyLearningRecordSchema>;
export type UnitProgress = z.infer<typeof unitProgressSchema>;
export type LearningDetail = z.infer<typeof learningDetailSchema>;
export type RecommendedUnit = z.infer<typeof recommendedUnitSchema>;

export const toWeeklyLearningRecord = (
	raw: WeeklyLearningRecordResponse,
): WeeklyLearningRecord => weeklyLearningRecordSchema.parse(raw);

export const toLearningDetail = (
	raw: LearningDetailResponse,
): LearningDetail => learningDetailSchema.parse(raw);

export const toRecommendedUnit = (
	raw: RecommendedUnitResponse,
): RecommendedUnit => recommendedUnitSchema.parse(raw);