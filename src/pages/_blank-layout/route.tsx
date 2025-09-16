import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_blank-layout")({
	component: BlankLayoutComponent,
});

function BlankLayoutComponent() {
	return (
		<div className="flex flex-col min-h-screen">
			<Outlet />
		</div>
	);
}
