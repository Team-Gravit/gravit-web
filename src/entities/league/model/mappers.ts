// src/entities/league/model/mappers.ts
import type {
	LeagueResponse,
	LeagueRankRow,
	MyLeagueRankWithProfileResponse,
	LastSeasonPopupDto,
} from "@/shared/api/@generated";
import type {
	LeagueInfo,
	UserLeagues,
	UserLeagueInfo,
	LastSeasonPopup,
} from "./types";

/** OpenAPI LeagueResponse → 프론트엔드 LeagueInfo */
export function mapToLeagueInfo(raw: LeagueResponse): LeagueInfo {
	if (
		raw.leagueId === undefined ||
		!raw.name ||
		raw.minLp === undefined ||
		raw.maxLp === undefined
	) {
		throw new Error("Invalid league data");
	}
	return {
		leagueId: raw.leagueId,
		name: raw.name,
		minLp: raw.minLp,
		maxLp: raw.maxLp,
	};
}

/** OpenAPI LeagueRankRow → 프론트엔드 UserLeagues */
export function mapToUser(raw: LeagueRankRow): UserLeagues {
	if (
		raw.userId === undefined ||
		!raw.nickname ||
		raw.profileImgNumber === undefined ||
		raw.level === undefined ||
		raw.xp === undefined ||
		raw.lp === undefined
	) {
		throw new Error("Invalid user data");
	}
	return {
		userId: raw.userId,
		nickname: raw.nickname,
		profileImgNumber: raw.profileImgNumber,
		level: raw.level,
		xp: raw.xp,
		lp: raw.lp,
		rank: raw.rank || 0,
	};
}

/** OpenAPI MyLeagueRankWithProfileResponse → 프론트엔드 UserLeagueInfo */
export function mapToUserLeagueInfo(
	raw: MyLeagueRankWithProfileResponse,
): UserLeagueInfo {
	if (!raw.leagueName || !raw.nickname) {
		throw new Error("Invalid league info data");
	}

	return {
		leagueId: raw.leagueId ?? 0,
		leagueName: raw.leagueName,
		rank: raw.rank ?? 0,
		userId: raw.userId ?? 0,
		lp: raw.lp ?? 0,
		maxLp: raw.maxLp ?? 0,
		nickname: raw.nickname,
		profileImgNumber: raw.profileImgNumber ?? 0,
		xp: raw.xp ?? 0,
		level: raw.level ?? 0,
	};
}

/** OpenAPI LastSeasonPopupDto → 프론트엔드 LastSeasonPopup */
export function mapToLastSeasonPopup(raw: LastSeasonPopupDto): LastSeasonPopup {
	if (!raw.leagueName) {
		throw new Error("Invalid popup data");
	}
	return {
		leagueName: raw.leagueName,
		rank: raw.rank || 0,
		profileImgNumber: raw.profileImgNumber || 0,
	};
}
