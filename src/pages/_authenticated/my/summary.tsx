import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/my/summary")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/my/summary"!</div>;
}
