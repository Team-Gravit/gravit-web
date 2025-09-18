import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_fixed-header-layout/learn/$chapterId/$unitId/quiz",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>Hello "/_fixed-header-layout/learn/$chapterId/$unitId/quiz"!</div>
	);
}
