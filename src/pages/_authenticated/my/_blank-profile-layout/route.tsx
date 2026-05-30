import { createFileRoute, Outlet } from "@tanstack/react-router";
import PageLayout from "@/shared/ui/layout.tsx/page-layout";

import useResponsive from "@/shared/model/use-responsive";

export const Route = createFileRoute("/_authenticated/my/_blank-profile-layout")({
	component: MyLayout,
});

function MyLayout() {
	const { isMobile } = useResponsive();
	return (
		<PageLayout bottomTabBar={isMobile}>
			<Outlet />
		</PageLayout>
	)
}
