import type { MissionName } from "@/shared/config/constants";

const LESSON_MISSIONS = [
	"COMPLETE_LESSON_ONE",
	"COMPLETE_LESSONS_TWO",
	"COMPLETE_LESSONS_THREE",
] as const;
const SOCIAL_MISSIONS = ["FOLLOW_NEW_FRIEND"] as const;
const LEARNING_TIME_MISSIONS = [
	"LEARNING_MINUTES_FIVE",
	"LEARNING_MINUTES_TEN",
	"LEARNING_MINUTES_FIFTEEN",
] as const;
const PERFECT_MISSIONS = [
	"PERFECT_LESSON_ONE",
	"PERFECT_LESSONS_TWO",
	"PERFECT_LESSONS_THREE",
] as const;

const MISSION_URL_MAP: Record<MissionName, string> = {
	...Object.fromEntries(LESSON_MISSIONS.map((m) => [m, "/learning"])),
	...Object.fromEntries(SOCIAL_MISSIONS.map((m) => [m, "/user/addfriend"])),
	...Object.fromEntries(LEARNING_TIME_MISSIONS.map((m) => [m, "/learning"])),
	...Object.fromEntries(PERFECT_MISSIONS.map((m) => [m, "/learning"])),
} as Record<MissionName, string>;

export const isMissionName = (name: string): name is MissionName => {
	return name in MISSION_URL_MAP;
};

export const getMissionUrl = (missionName: string): string => {
	return isMissionName(missionName)
		? (MISSION_URL_MAP[missionName] ?? "/learning")
		: "/learning";
};
