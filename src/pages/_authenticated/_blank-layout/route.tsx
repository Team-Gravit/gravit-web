import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_blank-layout")({
	component: BlankLayoutComponent,
});

function BlankLayoutComponent() {
	return (
		<div className="flex flex-col min-h-screen min-w-screen">
			<Outlet />
		</div>
	);
}
