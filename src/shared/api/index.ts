import { Configuration } from "./@generated";
import type { AxiosInstance } from "axios";
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
	apiClient,
	authClient,
	privateApiConfiguration,
	publicApiConfiguration,
} from "./config";

function createApiInstance<T>(
	ApiClass: new (
		config?: Configuration,
		basePath?: string,
		axiosInstance?: AxiosInstance,
	) => T,
	config: Configuration,
	axiosInstance: AxiosInstance,
): T {
	return new ApiClass(config, undefined, axiosInstance);
}

export const api = {
	public: {
		oAuth: createApiInstance(OAuth20APIApi, publicApiConfiguration, authClient),
		refresh: createApiInstance(
			AuthTokenAPIApi,
			publicApiConfiguration,
			authClient,
		),

		restore: createApiInstance(UserAPIApi, publicApiConfiguration, authClient),
	},
	withdraw: {
		delete: createApiInstance(
			UserDeletionAPIApi,
			privateApiConfiguration,
			authClient,
		),
	},
	note: createApiInstance(CSNoteAPIApi, privateApiConfiguration, apiClient),
	league: createApiInstance(LeagueAPIApi, privateApiConfiguration, apiClient),
	ranking: {
		user: createApiInstance(
			MyLeagueProfileAPIApi,
			privateApiConfiguration,
			apiClient,
		),
		global: createApiInstance(
			LeagueRankAPIApi,
			privateApiConfiguration,
			apiClient,
		),
	},
	user: {
		delete: createApiInstance(
			UserDeletionAPIApi,
			privateApiConfiguration,
			apiClient,
		),
		manage: createApiInstance(UserAPIApi, privateApiConfiguration, apiClient),
	},
	friend: createApiInstance(FriendAPIApi, privateApiConfiguration, apiClient),
	friendSearch: createApiInstance(
		FriendSearchAPIApi,
		privateApiConfiguration,
		apiClient,
	),
	learning: createApiInstance(
		LearningAPIApi,
		privateApiConfiguration,
		apiClient,
	),
	badge: createApiInstance(BadgeApi, privateApiConfiguration, apiClient),
	notice: createApiInstance(
		NoticeQueryAPIApi,
		privateApiConfiguration,
		apiClient,
	),
};
