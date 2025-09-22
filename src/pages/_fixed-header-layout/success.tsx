import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_fixed-header-layout/success")({
	component: SuccessPage,
});

function SuccessPage() {
	return <div>Hello "/_fixed-header-layout/success"!</div>;
}
