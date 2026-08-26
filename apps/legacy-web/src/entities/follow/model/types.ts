export default interface FollowUser {
  id: number;
  profileImgNumber: number;
  nickname: string;
  handle: string;
  isFollowing: boolean;
}
export type FollowType = 'followers' | 'following';
