import type { UserDTO } from "./dto";

export async function fetchUserInfos(): Promise<UserDTO> {
	// 실제로는 api 호출 코드가 들어가는 부분
	return {
		id: 3,
		firstName: "mori",
		lastName: "jo",
	};
}
