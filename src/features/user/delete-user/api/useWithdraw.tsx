import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useSendWithdrawEmail = () => {
	return useMutation({
		mutationFn: () => {
			const dest =
				import.meta.env.VITE_ENVIRONMENT === "local" ? "local" : "prod";

			return api.private.withdrawal.request(dest);
		},
	});
};

export const useConfirmWithdraw = () => {
	return useMutation({
		mutationFn: (mailAuthCode: string) => {
			return api.private.withdrawal.confirm(mailAuthCode);
		},
	});
};
