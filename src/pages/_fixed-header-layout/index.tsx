import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_fixed-header-layout/")({
	component: Index,
});

function Index() {
	return (
		<div className="flex-grow flex items-center justify-center bg-purple-200">
			로그인 페이지
		</div>
	);
}
