import { LEVEL_SYSTEM } from "../config/constants";

export const getXpRangeByLevel = (
	level: number,
): { startXp: number; endXp: number | null } | null => {
	const levelData = LEVEL_SYSTEM.find((data) => data.level === level);
	return levelData
		? { startXp: levelData.startXp, endXp: levelData.endXp }
		: null;
};

/**
 *
 * @param level - 유저의 리그 레벨
 * @param xp -유저의 현재 xp
 * @returns
 */
export const getLevelProgress = (level: number, xp: number) => {
	const levelData = getXpRangeByLevel(level);

	if (levelData) {
		const { startXp, endXp } = levelData;

		if (!endXp) return 0;
		return Math.round(Math.min((xp / (endXp - startXp)) * 100, 100));
	}
	return 0;
};
