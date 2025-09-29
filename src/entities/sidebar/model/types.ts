export interface UserInfo {
	nickname: string;
	profileImgNumber: number;
	handle: string;
	follower: number;
	following: number;
}

export interface Badge {
	badgeId: number;
	code: string;
	name: string;
	description: string;
	order: number;
	iconId: number;
	earned: boolean;
}

export interface BadgeCategory {
	categoryId: number;
	categoryName: string;
	order: number;
	categoryDescription: string;
	badgeResponses: Badge[];
}

export interface UserBadges {
	earnedCount: number;
	totalCount: number;
	badgeCategoryResponses: BadgeCategory[];
}
