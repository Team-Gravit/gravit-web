const LEAGUE_COLORS = {
	브론즈: "text-bronze",
	실버: "text-gray",
	골드: "text-yellow",
	플래티넘: "text-slate",
	다이아몬드: "text-blue",
} as const;

export const getLeagueColorClass = (league: string): string => {
	const [leagueName] = league.split(" ");

	if (leagueName in LEAGUE_COLORS) {
		return LEAGUE_COLORS[leagueName as keyof typeof LEAGUE_COLORS];
	}

	return "text-black";
};
