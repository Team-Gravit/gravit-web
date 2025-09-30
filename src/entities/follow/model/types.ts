export interface Follow {
	Id: number;
	profileImgNumber: number;
	nickname: string;
	handle: string;
}

export interface FollowList {
	hasNextPage: boolean;
	contents: Follow[];
}
