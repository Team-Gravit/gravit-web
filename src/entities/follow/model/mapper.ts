import type {
	FollowerResponse,
	FollowingResponse,
	SliceResponseFollowingResponse,
} from "@/shared/api/@generated/model";
import type { SliceResponseFollowerResponse } from "@/shared/api/@generated/model/sliceResponseFollowerResponse";

export const mapFollowing = (raw: FollowingResponse) => {
	return {
		id: raw.id || 0,
		nickname: raw.nickname,
		handle: raw.handle,
		profileImgNumber: raw.profileImgNumber ?? 1,
		isFollowing: true,
	};
};
export const mapFollower = (raw: FollowerResponse) => {
	return {
		id: raw.id || 0,
		nickname: raw.nickname,
		handle: raw.handle,
		profileImgNumber: raw.profileImgNumber ?? 1,
		isFollowing: raw.isFollowing ?? false,
	};
};

export const mapFollowingList = (raw: SliceResponseFollowingResponse) => {
	return {
		hasNextPage: raw.hasNextPage,
		contents: raw.contents?.map((data) => mapFollowing(data)) || [],
	};
};

export const mapFollowerList = (raw: SliceResponseFollowerResponse) => {
	return {
		hasNextPage: raw.hasNextPage,
		contents: raw.contents?.map((data) => mapFollower(data)) || [],
	};
};
