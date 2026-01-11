import { useFetchBookmarkedProblems } from "@/entities/learning/model/use-fetch-bookmarked-problems";
import { useRouter } from "@tanstack/react-router";
import BaseQuizComponent from "../quiz/BaseQuizComponent";

export default function BookmarkQuizComponent({ unitId }: { unitId: string }) {
	const router = useRouter();
	const { data, isPending } = useFetchBookmarkedProblems(Number(unitId));

	const handleClickQuit = () => {
		router.history.back();
	};

	return (
		<BaseQuizComponent
			data={data}
			isPending={isPending}
			onQuit={handleClickQuit}
		></BaseQuizComponent>
	);
}
