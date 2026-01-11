import Page404Component from "@/widgets/error-widget/Page404Component";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface RouteContext {
	auth: AuthState;
}

export interface AuthState {
	isAuthenticated: boolean;
}

const RootLayout = () => {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};
export const Route = createRootRouteWithContext<RouteContext>()({
	component: () => <RootLayout />,
	notFoundComponent: () => <Page404Component />,
});
