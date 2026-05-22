import { createFileRoute } from "@tanstack/react-router";
import MainPage from "./main";

export const Route = createFileRoute("/_authenticated/main")({
	component: RouteComponent,
});

function RouteComponent() {
	return <MainPage />;
}
