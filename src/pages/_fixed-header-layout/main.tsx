import Footer from "@/widgets/Footer/ui/Footer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_fixed-header-layout/main")({
	component: MainPage,
});

function MainPage() {
	return (
		<>
			<main className="flex-grow flex items-center justify-center bg-gray-200">
				메인 페이지
			</main>
			<Footer />
		</>
	);
}
