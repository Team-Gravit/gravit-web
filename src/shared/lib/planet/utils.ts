import { ASTEROID_IMAGES, PLANET_IMAGES } from "@/shared/assets/images/planets";
import type { PlanetId } from "./types";

export function isPlanetId(id: number): id is PlanetId {
	return id >= 1 && id <= 9 && Number.isInteger(id);
}

export function getPlanetImage(chapterId: number): string {
	if (isPlanetId(chapterId)) {
		return PLANET_IMAGES[chapterId]; // 타입 에러 없음!
	}
	return PLANET_IMAGES[1]; // 기본값
}

export function getAsteroidImg(isUnLocked: boolean): string {
	return isUnLocked ? ASTEROID_IMAGES.unlocked : ASTEROID_IMAGES.locked;
}
