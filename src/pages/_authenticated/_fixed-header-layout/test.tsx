import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/test",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return;
}
