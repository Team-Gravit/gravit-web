import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/widgets/header/ui/Header";

export const Route = createFileRoute("/_authenticated/_fixed-header-layout")({
	component: FixedHeaderLayoutComponent,
});

function FixedHeaderLayoutComponent() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header className="fixed" />
			<Outlet />
		</div>
	);
}
