import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/chapters/$chapterId/units/$unitId/note",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			Hello
			"/_authenticated/_fixed-header-layout/chapters/$chapterId/units/$unitId/note"!
		</div>
	);
}
