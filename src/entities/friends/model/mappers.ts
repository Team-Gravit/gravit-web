import type { SliceResponse } from "@/shared/api/@generated";
import type { Friend, FriendList } from "./types";

/** OpenAPI raw → 프론트엔드 Friend */
export function mapToFriend(raw: unknown): Friend {
	if (
		typeof raw !== "object" ||
		raw === null ||
		!("userId" in raw) ||
		!("nickname" in raw) ||
		!("handle" in raw)
	) {
		throw new Error("Invalid friend data");
	}

	const obj = raw as {
		userId: number;
		profileImgNumber?: number;
		nickname: string;
		handle: string;
		isFollowing?: boolean;
	};

	return {
		userId: obj.userId,
		profileImgNumber: obj.profileImgNumber ?? 0,
		nickname: obj.nickname,
		handle: obj.handle,
		isFollowing: obj.isFollowing ?? false,
	};
}

/** OpenAPI SliceResponse → 프론트엔드 FriendList */
export function mapToFriendList(raw: SliceResponse): FriendList {
	if (!raw.contents || !Array.isArray(raw.contents)) {
		throw new Error("Invalid friend list data");
	}

	return {
		hasNextPage: raw.hasNextPage ?? false,
		contents: raw.contents.map(mapToFriend), // 여기서 unknown → Friend로 안전하게 변환
	};
}
