import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_fixed-header-layout/league")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex-grow flex items-center justify-center bg-pink-200">
			리그 페이지
		</main>
	);
}
