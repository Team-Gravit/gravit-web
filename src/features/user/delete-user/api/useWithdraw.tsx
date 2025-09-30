import { useMutation } from "@tanstack/react-query";
import { userDeleteApi } from "./api";

export const useSendWithdrawEmail = () => {
	return useMutation({
		mutationFn: () => {
			const dest =
				import.meta.env.VITE_ENVIRONMENT === "prod" ? "prod" : "local";
			return userDeleteApi.requestAccountDeletion(dest);
		},
		onSuccess: (data) => {
			console.log("계정 삭제 확인 메일이 전송됨", data);
		},
		onError: (error) => {
			console.error("계정 삭제 확인 메일 전송에 실패:", error);
		},
	});
};

export const useConfirmWithdraw = () => {
	return useMutation({
		mutationFn: (mailAuthCode: string) => {
			return userDeleteApi.confirmAccountDeletion(mailAuthCode);
		},
		onSuccess: (data) => {
			console.log("탈퇴되었습니다.", data);
		},
		onError: (error) => {
			console.error("탈퇴에 실패하였습니다.", error);
		},
	});
};
