import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { OnboardingRequest, UserResponse } from "@/shared/api/@generated";

export const usePostOnboarding = () => {
	return useMutation<UserResponse, unknown, OnboardingRequest>({
		mutationFn: (payload: OnboardingRequest) =>
			api.user.manage.onboardUser(payload).then((res) => res.data),

		onError: (error) => {
			console.error("온보딩 실패:", error);
			alert("온보딩 중 오류가 발생했습니다.");
		},
	});
};
