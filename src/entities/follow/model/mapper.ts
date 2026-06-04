import type {
	FollowerResponse,
	FollowingResponse,
	SliceResponseFollowingResponse,
} from "@/shared/api/@generated/model";
import type { SliceResponseFollowerResponse } from "@/shared/api/@generated/model/sliceResponseFollowerResponse";
import type { Follower, FollowerList, Following, FollowingList } from "./types";

export const mapFollowing = (raw: FollowingResponse): Following => {
	return {
		id: raw.id || 0,
		nickname: raw.nickname,
		handle: raw.handle,
		profileImgNumber: raw.profileImgNumber ?? 1,
		isFollowing: true,
	};
};

export const mapFollower = (raw: FollowerResponse): Follower => {
	return {
		id: raw.id || 0,
		nickname: raw.nickname,
		handle: raw.handle,
		profileImgNumber: raw.profileImgNumber ?? 1,
		isFollowing: raw.isFollowing ?? false,
	};
};

export const mapFollowingList = (raw: SliceResponseFollowingResponse): FollowingList => {
	return {
		hasNextPage: raw.hasNextPage ?? false,
		contents: raw.contents?.map((data) => mapFollowing(data)) || [],
	};
};

export const mapFollowerList = (raw: SliceResponseFollowerResponse): FollowerList => {
	return {
		hasNextPage: raw.hasNextPage ?? false,
		contents: raw.contents?.map((data) => mapFollower(data)) || [],
	};
};