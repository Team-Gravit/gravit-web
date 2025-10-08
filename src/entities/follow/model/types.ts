export interface Follow {
	id: number;
	profileImgNumber: number;
	nickname: string;
	handle: string;
}

export interface FollowList {
	hasNextPage: boolean;
	contents: Follow[];
}
