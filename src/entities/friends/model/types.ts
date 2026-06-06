export interface Friend {
	userId: number;
	profileImgNumber: number;
	nickname: string;
	handle: string;
	isFollowing: boolean;
}

export interface FriendList {
	hasNextPage: boolean;
	contents: Friend[];
}
export interface FriendActivityFeed {
	feedId: number;
	actorId: number;
	actorNickname: string;
	actorProfileImgNumber: number;
	actorHandle: string;
	message: string;
	createdAt: string;
}

export interface FriendActivityFeedList {
	hasNextPage: boolean;
	contents: FriendActivityFeed[];
}

export interface RecommendUser {
	userId: number;
	nickname: string;
	profileImgNumber: number;
	mutualFollowCount: number;
}
