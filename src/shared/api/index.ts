import {
	AuthTokenAPIApi,
	BadgeApi,
	CSNoteAPIApi,
	FriendAPIApi,
	FriendSearchAPIApi,
	LeagueAPIApi,
	LeagueRankAPIApi,
	LearningAPIApi,
	MyLeagueProfileAPIApi,
	NoticeQueryAPIApi,
	OAuth20APIApi,
	UserAPIApi,
	UserDeletionAPIApi,
} from "./@generated";
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
		// 학습
		learning: new LearningAPIApi(
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
