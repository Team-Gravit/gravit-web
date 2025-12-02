import { createFileRoute } from "@tanstack/react-router";
import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";
import IncorrectQuizComponent from "@/widgets/learning-widget/ui/IncorrectQuizComponent";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/incorrect-problems",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { unitId } = Route.useParams();
	return (
		<QuizStoreProvider
			mode={"INCORRECT"}
			strategy={"STREAM"}
			unitId={Number(unitId)}
		>
			<IncorrectQuizComponent key={`unit: ${unitId}`} unitId={unitId} />
		</QuizStoreProvider>
	);
}
