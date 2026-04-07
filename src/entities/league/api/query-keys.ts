export const leagueKeys = {
	all: ["league"] as const,

	info: (leagueId: number) => [...leagueKeys.all, "info", leagueId] as const,

	seasonInfo: () => [...leagueKeys.all, "season-info"] as const,

	ranking: (leagueId: number) =>
		[...leagueKeys.all, "ranking", leagueId] as const,

	userLeagueProfile: () =>
		[...leagueKeys.all, "user-league-profile"] as const,

	userLeagueRanking: () =>
		[...leagueKeys.all, "user-league-ranking"] as const,
} as const;
