import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/notice/",
)({
	component: RouteComponent,
	loader: () => {
		return redirect({
			to: "/user/notice/$page",
			params: { page: "1" },
			replace: true,
		});
	},
});

function RouteComponent() {
	return null;
}
