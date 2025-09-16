import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_fixed-header-layout/user")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex-grow flex items-center justify-center bg-green-200">
			사용자 페이지
		</main>
	);
}
