import type { UserResponse } from "@/shared/api/@generated";
import type { UserProfile } from "./types";

/** OpenAPI UserResponse → 프론트엔드 UserProfile */
export function mapToUserProfile(raw: UserResponse): UserProfile {
	if (!raw.nickname) {
		throw new Error("Invalid user data: nickname is required");
	}

	return {
		nickname: raw.nickname,
		profileImgNumber: raw.profileImgNumber ?? 0,
	};
}
