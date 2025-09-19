import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_fixed-header-layout/learn/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex-grow flex items-center justify-center bg-amber-200">
			학습 페이지
		</main>
	);
}
