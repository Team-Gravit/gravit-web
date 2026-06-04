export default interface FollowUser {
  id: number;
  profileImgNumber: number;
  nickname: string;
  handle: string;
  isFollowing: boolean;
}

export interface Follower extends FollowUser {
  isFollowing: boolean;
}

export interface Following extends FollowUser {
  isFollowing: true;
}

export interface FollowingList {
  hasNextPage: boolean;
  contents: Following[];
}

export interface FollowerList {
  hasNextPage: boolean;
  contents: Follower[];
}

export type FollowType = 'followers' | 'following';