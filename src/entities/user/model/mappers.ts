import type { UserDTO } from "../api/dto";
import type { User } from "./types";

// 서버 응답 형태를 프론트 데이터 형태로 변환해주는 함수
export function toUser(dto: UserDTO): User {
	return {
		id: dto.id,
		profileId: 3,
		firstName: dto.firstName,
		lastName: dto.lastName,
	};
}
