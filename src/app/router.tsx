import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/app/@generated/routeTree.gen";
import { tokenManager } from "@/shared/api/config";
import type { AuthState } from "@/pages/__root";

export const router = createRouter({
	routeTree,
	context: {
		auth: {
			isAuthenticated: !!tokenManager.getAccessToken(),
		} as AuthState,
	},
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
