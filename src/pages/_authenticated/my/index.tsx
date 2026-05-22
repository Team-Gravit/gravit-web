import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/my/")({
	beforeLoad: () => {
		throw redirect({ to: "/my/summary" });
	},
});