import { createFileRoute } from "@tanstack/react-router";
import { QuizStoreProvider } from "@/features/quiz/model/quiz-store-context";
import { PageSeo } from "@/shared/ui/seo/PageSeo";
import IncorrectQuizComponent from "@/widgets/learning-widget/ui/IncorrectQuizComponent";

export const Route = createFileRoute(
	"/_authenticated/_blank-layout/learning/$chapterId/$unitId/incorrect-problems",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { unitId } = Route.useParams();
	return (
		<>
			<PageSeo
				title="오답 문제 풀기"
				description="틀린 CS 문제를 다시 풀며 약점을 보완하세요."
				noIndex={true}
			/>
			<QuizStoreProvider
				mode={"INCORRECT"}
				strategy={"STREAM"}
				unitId={Number(unitId)}
			>
				<IncorrectQuizComponent key={`unit: ${unitId}`} unitId={unitId} />
			</QuizStoreProvider>
		</>
	);
}
