import { createFileRoute } from "@tanstack/react-router";
import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";
import BookmarkQuizComponent from "@/widgets/learning-widget/ui/BookmarkQuizComponent";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/bookmarked-problems",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { unitId } = Route.useParams();
	return (
		<QuizStoreProvider
			mode={"BOOKMARK"}
			strategy={"STREAM"}
			unitId={Number(unitId)}
		>
			<BookmarkQuizComponent key={`unit: ${unitId}`} unitId={unitId} />
		</QuizStoreProvider>
	);
}
