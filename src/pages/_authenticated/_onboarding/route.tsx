import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import HeaderLogo from "@/shared/assets/icons/logo-gr.svg?react";
import BackgroundImage from "@/shared/assets/images/login-background.webp";

export const Route = createFileRoute("/_authenticated/_onboarding")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-screen h-min-screen">
			<header className=" flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white z-[110]">
				<Link to="/" className="mr-3">
					<HeaderLogo className={`h-6`} />
				</Link>
			</header>
			<div
				className="w-full flex flex-col items-center py-10 gap-4 bg-no-repeat bg-top bg-cover"
				style={{
					backgroundImage: `url(${BackgroundImage})`,
				}}
			>
				<Outlet />
			</div>
		</div>
	);
}
