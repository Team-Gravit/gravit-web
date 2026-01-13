import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "@/shared/api";
import { tokenManager } from "@/shared/api/config";
import Page401Component from "@/widgets/error-widget/Page401Component";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const accessToken = tokenManager.getAccessToken();
		const refreshToken = tokenManager.getRefreshToken();

		if (accessToken) {
			return;
		}

		if (refreshToken) {
			try {
				const response = await api.private.authToken.reissueToken({
					refreshToken,
				});
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
