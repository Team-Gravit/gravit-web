// API 클래스 직접 import
import { AuthTokenAPIApi } from "./@generated/api/auth-token-apiapi";
import { BadgeApi } from "./@generated/api/badge-api";
import { BookmarkAPIApi } from "./@generated/api/bookmark-apiapi";
import { ChapterAPIApi } from "./@generated/api/chapter-apiapi";
import { CSNoteAPIApi } from "./@generated/api/csnote-apiapi";
import { FriendAPIApi } from "./@generated/api/friend-apiapi";
import { FriendSearchAPIApi } from "./@generated/api/friend-search-apiapi";
import { LeagueAPIApi } from "./@generated/api/league-apiapi";
import { LeagueRankAPIApi } from "./@generated/api/league-rank-apiapi";
import { LessonAPIApi } from "./@generated/api/lesson-apiapi";
import { MyLeagueProfileAPIApi } from "./@generated/api/my-league-profile-apiapi";
import { NoticeQueryAPIApi } from "./@generated/api/notice-query-apiapi";
import { OAuth20APIApi } from "./@generated/api/oauth20-apiapi";
import { ProblemAPIApi } from "./@generated/api/problem-apiapi";
import { ReportAPIApi } from "./@generated/api/report-apiapi";
import { UnitAPIApi } from "./@generated/api/unit-apiapi";
import { UserAPIApi } from "./@generated/api/user-apiapi";
import { UserDeletionAPIApi } from "./@generated/api/user-deletion-apiapi";
import { WrongAnsweredNoteAPIApi } from "./@generated/api/wrong-answered-note-apiapi";

import {
	privateApiClient,
	privateApiConfiguration,
	publicApiClient,
	publicApiConfiguration,
	tokenManager, // config에 있다면 추가
} from "./config";

export const api = {
	private: {
		// 회원 탈퇴 (withdraw/user.delete 통합)
		withdrawal: new UserDeletionAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// CS 노트
		note: new CSNoteAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 리그 관련
		league: new LeagueAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		myLeagueProfile: new MyLeagueProfileAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		leagueRank: new LeagueRankAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 유저 관리
		user: new UserAPIApi(privateApiConfiguration, undefined, privateApiClient),
		// 친구 관련
		friend: new FriendAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		friendSearch: new FriendSearchAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 학습 관련 - 새로운 엔드포인트
		chapter: new ChapterAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		unit: new UnitAPIApi(privateApiConfiguration, undefined, privateApiClient),
		lesson: new LessonAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		problem: new ProblemAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 북마크
		bookmark: new BookmarkAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 오답노트
		wrongAnsweredNote: new WrongAnsweredNoteAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 신고
		report: new ReportAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 배지
		badge: new BadgeApi(privateApiConfiguration, undefined, privateApiClient),
		// 공지사항
		notice: new NoticeQueryAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
		// 토큰 재발급 (Access Token)
		authToken: new AuthTokenAPIApi(
			privateApiConfiguration,
			undefined,
			privateApiClient,
		),
	},
	public: {
		// OAuth
		oAuth: new OAuth20APIApi(
			publicApiConfiguration,
			undefined,
			publicApiClient,
		),
		// 토큰 갱신 (Refresh)
		authToken: new AuthTokenAPIApi(
			publicApiConfiguration,
			undefined,
			publicApiClient,
		),
		// 계정 복구
		userRestore: new UserAPIApi(
			publicApiConfiguration,
			undefined,
			publicApiClient,
		),
	},
} as const;

// 토큰 유틸리티 export (config에 존재한다고 가정)
export { tokenManager };

// 타입들 export
export * from "./@generated/models";
