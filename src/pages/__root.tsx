import {
	Outlet,
	useLayoutEffect,
	useLocation,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface RouteContext {
	auth: AuthState;
}

export interface AuthState {
	isAuthenticated: boolean;
}

const RootLayout = () => {
	const location = useLocation();

	useLayoutEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [location.pathname]);

	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};
export const Route = createRootRouteWithContext<RouteContext>()({
	component: () => <RootLayout />,
});
