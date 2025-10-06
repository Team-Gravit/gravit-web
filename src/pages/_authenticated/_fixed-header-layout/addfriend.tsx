import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_fixed-header-layout/addfriend")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_fixed-header-layout/friend"!</div>;
}
