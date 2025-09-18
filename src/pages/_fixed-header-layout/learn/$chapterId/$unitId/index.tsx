import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_fixed-header-layout/learn/$chapterId/$unitId/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_fixed-header-layout/learn/$chapterId/$unitId/"!</div>;
}
