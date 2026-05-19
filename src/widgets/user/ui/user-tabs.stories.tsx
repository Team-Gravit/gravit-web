import type { Meta, StoryObj } from "@storybook/react-vite";
import UserTabs from "./user-tabs";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";

const withUserTabRouter = (initialPath = "/user") => {
	return (Story: React.ComponentType) => {
		const rootRoute = createRootRoute({
			component: () => <Outlet />,
		});

		const routes = [
			"/user",
			"/user/learning",
			"/user/league",
			"/user/social",
		].map((path) =>
			createRoute({
				getParentRoute: () => rootRoute,
				path,
				component: () => <Story />,
			}),
		);

		const router = createRouter({
			history: createMemoryHistory(),
			routeTree: rootRoute.addChildren(routes),
		});

		router.navigate({ to: initialPath });

		return (
			<div className="bg-text-2-w p-4">
				<RouterProvider router={router} />
			</div>
		);
	};
};

const meta: Meta<typeof UserTabs> = {
	title: "Widgets/User/UI/UserTabs",
	component: UserTabs,
	decorators: [withUserTabRouter()],
};

export default meta;

type Story = StoryObj<typeof UserTabs>;

export const Default: Story = {
	name: "데스크탑",
};

export const Mobile: Story = {
	name: "모바일",
	globals: {
		viewport: { value: "mobile2", isRotated: false },
	},
};
