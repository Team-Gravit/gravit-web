import { createFileRoute } from "@tanstack/react-router";
import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";
import { PageSeo } from "@/shared/ui/seo/PageSeo";
import LessonQuizComponent from "@/widgets/learning-widget/ui/LessonQuizComponent";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/$lessonId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { lessonId } = Route.useParams();
	return (
		<>
			<PageSeo
				title="레슨 문제 풀기"
				description="CS 레슨 문제를 풀며 학습을 완료하세요."
				noIndex={true}
			/>
			<QuizStoreProvider
				mode={"LESSON"}
				strategy={"BATCH"}
				lessonId={Number(lessonId)}
			>
				<LessonQuizComponent key={lessonId} lessonId={lessonId} />
			</QuizStoreProvider>
		</>
	);
}
