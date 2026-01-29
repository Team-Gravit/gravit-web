import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { isMobileDevice } from "@/shared/lib/detect-mobile";
import MobileAppInstallGuide from "@/widgets/mobile-block/MobileAppInstallGuide";
import Page404Component from "@/widgets/error-widget/Page404Component";

export interface RouteContext {
	auth: AuthState;
}

export interface AuthState {
	isAuthenticated: boolean;
}

const RootLayout = () => {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		// 클라이언트 사이드에서만 모바일 감지
		setIsMobile(isMobileDevice());
	}, []);

	// 로딩 중 (SSR 대응)
	if (isMobile === null) {
		return null;
	}

	// 모바일이면 앱 설치 안내 화면만 표시
	if (isMobile) {
		return <MobileAppInstallGuide />;
	}

	// PC면 정상적으로 라우터 사용
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};
export const Route = createRootRouteWithContext<RouteContext>()({
	component: () => <RootLayout />,
	notFoundComponent: () => <Page404Component />,
});
