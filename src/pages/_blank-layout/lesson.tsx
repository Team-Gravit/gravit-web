import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_blank-layout/lesson")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_blank-layout/lesson"!</div>;
}
