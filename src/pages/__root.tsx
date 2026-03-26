import { createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { isMobileDevice } from "@/shared/lib/detect-mobile";
// import MobileAppInstallGuide from "@/widgets/mobile-block/MobileAppInstallGuide";
import Page404Component from "@/widgets/error-widget/Page404Component";
import ErrorPageTemplate from "@/widgets/error-widget/ErrorPageTemplate";
import Mascot404Icon from "@/shared/assets/icons/ic-mascot-error.svg?react";

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
	// if (isMobile) {
	// 	return <MobileAppInstallGuide />;
	// }

	// PC면 정상적으로 라우터 사용
	return (
		<>
			{/* <Outlet /> */}
			<ErrorPageTemplate
				icon={<Mascot404Icon className="w-[300px]" />}
				title="점검중입니다."
				description={
					<>
						불편을 끼쳐드려 죄송합니다.
						<br />
						서버 점검으로 인해
						<br />
						일시적으로 접속이 불가하오니
						<br />
						많은 양해 부탁드립니다.
					</>
				}
			>
				<div></div>
			</ErrorPageTemplate>
			<TanStackRouterDevtools />
		</>
	);
};
export const Route = createRootRouteWithContext<RouteContext>()({
	component: () => <RootLayout />,
	notFoundComponent: () => <Page404Component />,
});
