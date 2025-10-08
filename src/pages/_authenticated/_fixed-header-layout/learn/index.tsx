import { createFileRoute, Link } from "@tanstack/react-router";
import Banner from "@/shared/ui/banner/Banner";
import ChapterCard from "@/features/learning/ChapterCard";
import { useFetchChapters } from "@/entities/learning/model/hooks";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learn/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { chapters, isPending, isError, error } = useFetchChapters();

	if (isPending) {
		return <div>로딩 중</div>;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (!chapters) {
		return <div>챕터가 없습니다.</div>;
	}
	return (
		<main className="flex-grow flex flex-col justify-start bg-gray-200">
			<Banner />
			<div className="w-full h-full flex flex-col items-center py-8">
				<div className="w-full max-w-[1500px] px-[120px] flex flex-col gap-8">
					<h2 className="text-black text-[32px] font-bold leading-normal">
						학습
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8  lg:gap-10 mb-10">
						{chapters.map((chapter) => {
							const { chapterId } = chapter;
							return (
								<Link
									to={"/learn/$chapterId"}
									params={{ chapterId: String(chapterId) }}
									key={chapter.chapterId}
								>
									<ChapterCard chapter={chapter} />
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</main>
	);
}
