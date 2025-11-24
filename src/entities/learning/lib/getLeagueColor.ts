const LEAGUE_COLORS = {
	브론즈: "text-bronze",
	실버: "text-silver",
	골드: "text-gold",
	플래티넘: "text-platinum",
	다이아몬드: "text-diamond",
} as const;

export const getLeagueColorClass = (league: string): string => {
	const [leagueName] = league.split(" ");

	if (leagueName in LEAGUE_COLORS) {
		return LEAGUE_COLORS[leagueName as keyof typeof LEAGUE_COLORS];
	}

	return "text-black";
};
