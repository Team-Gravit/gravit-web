export interface LevelRange {
	level: number;
	startXp: number;
	endXp: number;
}

export const LEVEL_XP_TABLE: LevelRange[] = [
	{ level: 1, startXp: 0, endXp: 99 },
	{ level: 2, startXp: 100, endXp: 199 },
	{ level: 3, startXp: 200, endXp: 399 },
	{ level: 4, startXp: 400, endXp: 699 },
	{ level: 5, startXp: 700, endXp: 1099 },
	{ level: 6, startXp: 1100, endXp: 1599 },
	{ level: 7, startXp: 1600, endXp: 2199 },
	{ level: 8, startXp: 2200, endXp: 2899 },
	{ level: 9, startXp: 2900, endXp: 3699 },
	{ level: 10, startXp: 3700, endXp: Infinity },
];

export function getLevelInfo(xp: number) {
	const levelInfo =
		LEVEL_XP_TABLE.find((lvl) => xp >= lvl.startXp && xp <= lvl.endXp) ??
		LEVEL_XP_TABLE[LEVEL_XP_TABLE.length - 1];

	const progress =
		levelInfo.endXp === Infinity
			? 1
			: Math.min(
					(xp - levelInfo.startXp) / (levelInfo.endXp - levelInfo.startXp),
					1,
				);

	return {
		...levelInfo,
		progress,
	};
}
