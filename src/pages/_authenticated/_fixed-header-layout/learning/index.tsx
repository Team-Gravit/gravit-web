import { createFileRoute, Link } from "@tanstack/react-router";
import Banner from "@/shared/ui/banner/Banner";
import ChapterCard from "@/features/learning/ChapterCard";
import { useFetchChapters } from "@/entities/learning/model/hooks";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/learning/",
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
			<div className="w-full h-full flex flex-col items-center py-8 mx-auto">
				<div className="w-full sm:w-[90%] xl:w-[80%] 2xl:w-[70%] flex flex-col gap-8">
					<nav className="text-4xl font-semibold">
						<button type="button" className="text-black  leading-normal">
							개념 학습
						</button>
					</nav>
					<section className="w-full grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-8 lg:gap-10 mb-10">
						{chapters.map((chapter, idx) => {
							const isActive = idx <= 2;
							return (
								<>
									{isActive ? (
										<Link
											to={"/learning/$chapterId"}
											params={{ chapterId: String(chapter.chapterId) }}
											key={chapter.chapterId}
											className="w-full"
										>
											<ChapterCard chapter={chapter} isActive={isActive} />
										</Link>
									) : (
										<ChapterCard chapter={chapter} isActive={isActive} />
									)}
								</>
							);
						})}
					</section>
				</div>
			</div>
		</main>
	);
}
