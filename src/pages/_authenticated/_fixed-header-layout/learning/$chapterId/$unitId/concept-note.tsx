import { createFileRoute } from "@tanstack/react-router";
import Banner2 from "@/shared/ui/banner/Banner2";
import StudyNote from "@/shared/ui/studynote/studynote";
import { useNote } from "@/entities/cs-notes/api/useNote";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learning/$chapterId/$unitId/concept-note",
)({
	validateSearch: (search: { chapterName?: string }) => search,
	component: ConceptNotePage,
});

function ConceptNotePage() {
	const { unitId } = Route.useParams();
	const { chapterName } = Route.useSearch();

	const noteQuery = useNote(Number(unitId));

	const bannerData = {
		subject: chapterName,
		title: `유닛 ${unitId} 개념노트`,
	};

	if (noteQuery.isLoading) {
		return <div className="p-10 text-center">로딩 중...</div>;
	}

	if (noteQuery.isError) {
		return (
			<div className="p-10 text-center text-red-500">
				개념 노트를 불러오지 못했습니다.
			</div>
		);
	}

	const noteContent = noteQuery.data ?? "";

	return (
		<div className="w-screen min-h-screen flex-col">
			<Banner2 subject={bannerData.subject} title={bannerData.title} />

			<div className="flex py-14 justify-center">
				<StudyNote
					title="개념노트"
					subtitle={`Unit ${unitId}`}
					content={noteContent}
				/>
			</div>
		</div>
	);
}
