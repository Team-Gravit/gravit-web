import { createFileRoute, Outlet } from "@tanstack/react-router";
import Sidebar from "@/widgets/sidebar/SideBar";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout",
)({
	component: FixedSidebarLayoutComponent,
});

function FixedSidebarLayoutComponent() {
	return (
		<div className="flex flex-row min-h-screen pt-[var(--header-height)]">
			<Sidebar />
			<div className="flex w-full lg:w-3/4 min-h-screen">
				<Outlet />
			</div>
		</div>
	);
}
