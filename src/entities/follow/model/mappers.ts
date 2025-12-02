import type {
	FollowerResponse,
	SliceResponseFollowerResponse,
	SliceResponseFollowingResponse,
} from "@/shared/api/@generated";
import type { Follow, FollowList } from "./types";

/** OpenAPI FollowerResponse → 프론트엔드 Follow */
export function mapToFollow(raw: FollowerResponse): Follow {
	if (!raw.nickname || !raw.handle) {
		throw new Error("Invalid follower data");
	}

	return {
		id: raw.id ?? 0,
		nickname: raw.nickname,
		handle: raw.handle,
		profileImgNumber: raw.profileImgNumber ?? 0,
	};
}

/** OpenAPI SliceResponseFollowerResponse → 프론트엔드 FollowList */
export function mapToFollowList(
	raw: SliceResponseFollowerResponse,
): FollowList {
	if (!raw.contents) {
		throw new Error("Invalid follower list data");
	}

	return {
		hasNextPage: raw.hasNextPage ?? false,
		contents: raw.contents.map(mapToFollow),
	};
}

/** OpenAPI SliceResponseFollowerResponse → 프론트엔드 FollowList */
export function mapToFollowingList(
	raw: SliceResponseFollowingResponse,
): FollowList {
	if (!raw.contents) {
		throw new Error("Invalid follower list data");
	}

	return {
		hasNextPage: raw.hasNextPage ?? false,
		contents: raw.contents.map(mapToFollow),
	};
}
