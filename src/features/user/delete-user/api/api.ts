import { privateApiClient } from "@/shared/api/config";
import type { ApiResponse } from "@/shared/api/types";

export const userDeleteApi = {
	/** 계정 삭제 요청 메일 발송 */
	requestAccountDeletion: async (dest: string): Promise<void> => {
		const response = await privateApiClient.post<ApiResponse<undefined>>(
			`/users/deletion/request?dest=${dest}`,
		);
		if ("error" in response) {
			const errorCode = response.data?.error;
			const message = response.data?.message;

			switch (errorCode) {
				case "MAIL_4002":
					throw new Error("메일 전송에 실패하였습니다.");
				case "USER_4041":
					throw new Error("사용자를 찾을 수 없습니다.");
				default:
					throw new Error(message || "예기치 못한 예외 발생");
			}
		}
	},
	confirmAccountDeletion: async (mailAuthCode: string): Promise<void> => {
		const response = await privateApiClient.post<ApiResponse<undefined>>(
			`/users/deletion/confirm?mailAuthCode=${mailAuthCode}`,
		);

		if ("error" in response) {
			const errorCode = response.data?.error;
			const message = response.data?.message;

			switch (errorCode) {
				case "MAIL_4001":
					throw new Error("인증 코드가 유효하지 않거나 만료되었습니다.");
				case "USER_4041":
					throw new Error("사용자를 찾을 수 없습니다.");
				default:
					throw new Error(message || "계정 삭제 요청에 실패했습니다.");
			}
		}
	},
};
