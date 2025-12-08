import { createFileRoute, Outlet } from "@tanstack/react-router";
import Page401Component from "@/widgets/error-widget/Page401Component";
import { tokenManager } from "@/shared/api/config";
import { api } from "@/shared/api";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const accessToken = tokenManager.getAccessToken();
		const refreshToken = tokenManager.getRefreshToken();

		if (accessToken) {
			return;
		}

		if (refreshToken) {
			try {
				const response = await api.auth.refresh.reissueToken({ refreshToken });
				if (response.data.accessToken) {
					tokenManager.setTokens(response.data.accessToken);
					return;
				}
			} catch (error) {
				console.error("Token refresh failed:", error);
				tokenManager.clearTokens();
			}
		}

		throw new Error("Unauthorized");
	},
	errorComponent: ({ error }) => {
		if (error.message === "Unauthorized") {
			return <Page401Component />;
		}
		return <div>에러가 발생했습니다: {error.message}</div>;
	},
	component: () => <Outlet />,
});
