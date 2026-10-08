/** 메인 프로필 응답을 화면에서 사용하는 필드로 평탄화한 모델. */
export interface UserProfile {
  nickname: string;
  /** `getProfileColor`가 사용하는 아바타 색 번호(1~19). */
  profileImageNumber: number;
  level: number;
  currentXp: number;
  maxXp: number;
}
