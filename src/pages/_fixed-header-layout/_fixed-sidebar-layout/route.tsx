import Sidebar from "@/widgets/sidebar/SideBar";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_fixed-header-layout/_fixed-sidebar-layout",
)({
	component: FixedSidebarLayoutComponent,
});

function FixedSidebarLayoutComponent() {
	return (
		<div className="flex flex-row min-h-screen pt-[var(--header-height)]">
			<Sidebar />
			<div className="flex w-full lg:w-2/3 min-h-screen">
				<Outlet />
			</div>
		</div>
	);
}
