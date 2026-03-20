import { createFileRoute } from "@tanstack/react-router";
import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";
import { PageSeo } from "@/shared/ui/seo/PageSeo";
import BookmarkQuizComponent from "@/widgets/learning-widget/ui/BookmarkQuizComponent";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/bookmarked-problems",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { unitId } = Route.useParams();
	return (
		<>
			<PageSeo
				title="북마크 문제 풀기"
				description="북마크한 CS 문제를 다시 풀며 복습하세요."
				noIndex={true}
			/>
			<QuizStoreProvider
				mode={"BOOKMARK"}
				strategy={"STREAM"}
				unitId={Number(unitId)}
			>
				<BookmarkQuizComponent key={`unit: ${unitId}`} unitId={unitId} />
			</QuizStoreProvider>
		</>
	);
}
