export interface UserLeagueInfo {
	leagueId: number;
	leagueName: string;
	rank: number;
	userId: number;
	lp: number;
	maxLp: number;
	nickname: string;
	profileImgNumber: number;
	xp: number;
	level: number;
}

export interface UserLeagues {
	rank: number;
	userId: number;
	lp: number;
	nickname: string;
	profileImgNumber: number;
	xp: number;
	level: number;
}

export interface UserLeaguesList {
	hasNextPage: boolean;
	contents: UserLeagues[];
}

export interface CurrentSeason {
	nowSeason: string;
}

export interface LastSeasonPopupDto {
	rank: number;
	leagueName: string;
	profileImgNumber: number;
}

export type SeasonInfo =
	| {
			containsPopup: true;
			currentSeason: CurrentSeason;
			lastSeasonPopupDto: LastSeasonPopupDto;
	  }
	| {
			containsPopup: false;
			currentSeason: CurrentSeason;
			lastSeasonPopupDto: null;
	  };
