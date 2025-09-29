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
