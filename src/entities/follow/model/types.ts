export interface Following {
	id: number;
	profileImgNumber: number;
	nickname: string;
	handle: string;
	isFollowing?: boolean;
}

export interface Follower extends Following {
	isFollowing: boolean;
}

export interface FollowingList {
	hasNextPage: boolean;
	contents: Following[];
}

export interface FollowerList {
	hasNextPage: boolean;
	contents: Follower[];
}

export type FollowType = "followers" | "following";
