/** 팔로우 목록 종류. 팔로워(나를 팔로우) / 팔로잉(내가 팔로우). */
export type FollowType = 'followers' | 'following';

/** 팔로우 목록의 한 사람. isFollowing은 내가 이 사람을 팔로우하는지. */
export interface FollowUser {
  id: number;
  profileImgNumber: number;
  nickname: string;
  handle: string;
  isFollowing: boolean;
}
