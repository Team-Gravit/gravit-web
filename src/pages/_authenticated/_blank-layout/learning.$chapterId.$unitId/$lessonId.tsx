import { createFileRoute } from "@tanstack/react-router";
import LessonQuizComponent from "@/widgets/learning-widget/ui/LessonQuizComponent";
import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/$lessonId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { lessonId } = Route.useParams();
	return (
		<QuizStoreProvider
			mode={"LESSON"}
			strategy={"BATCH"}
			lessonId={Number(lessonId)}
		>
			<LessonQuizComponent key={lessonId} lessonId={lessonId} />
		</QuizStoreProvider>
	);
}
