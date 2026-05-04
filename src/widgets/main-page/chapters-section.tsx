import ChapterCard from "@/features/learning/ui/chapter-card";
import Card from "@/shared/ui/card/Card";

interface ChaptersSectionProps {
	chapters: {
		id: number;
		title: string;
		status: "locked" | "unlocked";
		lessonNum: number;
	}[];
}

export default function ChaptersSection({ chapters }: ChaptersSectionProps) {
	return (
		<Card>
			<Card.Header>
				<Card.Title>새 주제 시작하기</Card.Title>
				<Card.Link url="./">전체 보기</Card.Link>
			</Card.Header>
			<div className="w-full flex-1 grid grid-cols-2 gap-4">
				{chapters.map((chapter) => (
					<ChapterCard
						key={chapter.id}
						title={chapter.title}
						status={chapter.status}
						lessonNum={chapter.lessonNum}
						chapterId={chapter.id}
					/>
				))}
			</div>
		</Card>
	);
}
