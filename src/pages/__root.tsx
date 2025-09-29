import {
	createRootRoute,
	Outlet,
	useLayoutEffect,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

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
export const Route = createRootRoute({ component: RootLayout });
