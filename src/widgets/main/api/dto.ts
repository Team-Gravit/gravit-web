// types/main-page.ts

export interface UserLevelDetail {
	level: number;
	xp: number;
	levelRate: number;
}

export interface LearningDetail {
	consecutiveSolvedDays: number;
	planetConquestRate: number;
	recentSolvedChapterId: number;
	recentSolvedChapterTitle: string;
	recentSolvedChapterDescription: string;
	recentSolvedChapterProgressRate: number;
}

export interface MissionDetail {
	missionDescription: string;
	awardXp: number;
	isCompleted: boolean;
}

export interface MainPageResponseDTO {
	nickname: string;
	leagueName: string;
	userLevelDetail: UserLevelDetail;
	learningDetail: LearningDetail;
	missionDetail: MissionDetail;
}
