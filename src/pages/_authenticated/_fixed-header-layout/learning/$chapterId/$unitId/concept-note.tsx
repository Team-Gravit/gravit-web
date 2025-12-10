import { createFileRoute } from "@tanstack/react-router";
import Banner2 from "@/shared/ui/banner/Banner2";
import StudyNote from "@/shared/ui/studynote/studynote";
import { useNote } from "@/entities/cs-notes/api/useNote";
import { useFetchChapterWithUnits } from "@/entities/learning/model/hooks";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learning/$chapterId/$unitId/concept-note",
)({
	component: ConceptNotePage,
});

export default function ConceptNotePage() {
	const { chapterId, unitId } = Route.useParams();
	const noteQuery = useNote(Number(unitId));

	const { chapterInfo, units } = useFetchChapterWithUnits(Number(chapterId));

	if (!chapterInfo || !units) {
		return <div>정보를 불러오지 못했습니다.</div>;
	}

	const currentUnitIndex = units.findIndex(
		(u) => u.unitId.toString() === unitId,
	);

	const unitNumber = (currentUnitIndex + 1).toString().padStart(2, "0");

	const bannerData = {
		subject: chapterInfo.chapterName,
		title: `Unit${unitNumber} 개념노트`,
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
				<StudyNote content={noteContent} />
			</div>
		</div>
	);
}
