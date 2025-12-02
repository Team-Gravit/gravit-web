import type {
	MyPageResponse,
	AllBadgesResponse,
	BadgeCategoryResponse,
	BadgeResponse,
} from "@/shared/api/@generated";
import type { UserInfo, Badge, BadgeCategory, UserBadges } from "./types";

/** OpenAPI MyPageResponse → 프론트엔드 UserInfo */
export function mapToUserInfo(raw: MyPageResponse): UserInfo {
	if (!raw.nickname || !raw.handle) {
		throw new Error("Invalid user info data");
	}

	return {
		nickname: raw.nickname,
		profileImgNumber: raw.profileImgNumber ?? 0,
		handle: raw.handle,
		follower: raw.follower ?? 0,
		following: raw.following ?? 0,
	};
}

/** OpenAPI BadgeResponse → 프론트엔드 Badge */
export function mapToBadge(raw: BadgeResponse): Badge {
	if (!raw.code || !raw.name || !raw.description) {
		throw new Error("Invalid badge data");
	}

	return {
		badgeId: raw.badgeId ?? 0,
		code: raw.code,
		name: raw.name,
		description: raw.description,
		order: raw.order ?? 0,
		iconId: raw.iconId ?? 0,
		earned: raw.earned ?? false,
	};
}

/** OpenAPI BadgeCategoryResponse → 프론트엔드 BadgeCategory */
export function mapToBadgeCategory(raw: BadgeCategoryResponse): BadgeCategory {
	if (!raw.categoryName || !raw.categoryDescription) {
		throw new Error("Invalid badge category data");
	}

	return {
		categoryId: raw.categoryId ?? 0,
		categoryName: raw.categoryName,
		order: raw.order ?? 0,
		categoryDescription: raw.categoryDescription,
		badgeResponses: raw.badgeResponses.map(mapToBadge),
	};
}

/** OpenAPI AllBadgesResponse → 프론트엔드 UserBadges */
export function mapToUserBadges(raw: AllBadgesResponse): UserBadges {
	if (!raw.badgeCategoryResponses) {
		throw new Error("Invalid all badges data");
	}

	return {
		earnedCount: raw.earnedCount ?? 0,
		totalCount: raw.totalCount ?? 0,
		badgeCategoryResponses: raw.badgeCategoryResponses.map(mapToBadgeCategory),
	};
}
