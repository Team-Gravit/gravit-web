import {
	Outlet,
	useLayoutEffect,
	useLocation,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface RouteContext {
	auth: AuthState;
}

interface AuthState {
	isAuthenticated: boolean;
	user?: {
		id: string;
		email: string;
		name: string;
	};
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
