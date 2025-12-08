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
import { apiClient, authClient, privateApiConfiguration } from "./config";

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
	auth: {
		oAuth: createApiInstance(
			OAuth20APIApi,
			privateApiConfiguration,
			authClient,
		),
		refresh: createApiInstance(
			AuthTokenAPIApi,
			privateApiConfiguration,
			authClient,
		),
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
