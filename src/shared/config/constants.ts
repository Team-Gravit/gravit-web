import type { LevelData } from "../model/types";

export const LEVEL_SYSTEM: LevelData[] = [
	{ level: 1, startXp: 0, endXp: 99 },
	{ level: 2, startXp: 100, endXp: 199 },
	{ level: 3, startXp: 200, endXp: 399 },
	{ level: 4, startXp: 400, endXp: 699 },
	{ level: 5, startXp: 700, endXp: 1099 },
	{ level: 6, startXp: 1100, endXp: 1599 },
	{ level: 7, startXp: 1600, endXp: 2199 },
	{ level: 8, startXp: 2200, endXp: 2899 },
	{ level: 9, startXp: 2900, endXp: 3699 },
	{ level: 10, startXp: 3700, endXp: null },
];

export const MISSION_LABEL_MAP = {
	COMPLETE_LESSON_ONE: "학습 페이지",
	COMPLETE_LESSONS_TWO: "학습 페이지",
	COMPLETE_LESSONS_THREE: "학습 페이지",
	PERFECT_LESSON_ONE: "학습 페이지",
	PERFECT_LESSONS_TWO: "학습 페이지",
	PERFECT_LESSONS_THREE: "학습 페이지",
	LEARNING_MINUTES_FIVE: "학습 페이지",
	LEARNING_MINUTES_TEN: "학습 페이지",
	LEARNING_MINUTES_FIFTEEN: "학습 페이지",
	FOLLOW_NEW_FRIEND: "친구 추가 페이지",
} as const;

export type MissionName = keyof typeof MISSION_LABEL_MAP;

export const BOTTOM_TAB_BAR_HEIGHT = 68;
export const HEADER_HEIGHT = 70;
