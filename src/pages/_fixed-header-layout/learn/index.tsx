import { createFileRoute, Link } from "@tanstack/react-router";
import Banner from "@/shared/ui/banner/Banner";
import ChapterCard from "@/features/learning/ChapterCard";

export const Route = createFileRoute("/_fixed-header-layout/learn/")({
	component: RouteComponent,
});

const data = [
	{
		chapterId: 1,
		name: "자료구조",
		description:
			"배열, 연결리스트, 스택, 큐, 힙, 해시, 트리 등 기본적인 자료구조의 개념과 구현을 학습하는 챕터",
		totalUnits: 7,
		completedUnits: 0,
	},
	{
		chapterId: 2,
		name: "알고리즘",
		description:
			"정렬, 그리디, 탐색, 동적계획법, 그래프 알고리즘 등 핵심 알고리즘 기법을 다루는 챕터",
		totalUnits: 6,
		completedUnits: 0,
	},
	{
		chapterId: 3,
		name: "네트워크",
		description:
			"네트워크 기초부터 OSI 7계층, TCP/IP, 각 계층별 프로토콜과 보안까지 학습하는 챕터",
		totalUnits: 7,
		completedUnits: 0,
	},
	{
		chapterId: 4,
		name: "운영체제",
		description:
			"시스템 구조, 프로세스, 스레드, 메모리 관리, 파일 시스템 등 OS 핵심 개념을 다루는 챕터",
		totalUnits: 8,
		completedUnits: 0,
	},
	{
		chapterId: 5,
		name: "데이터베이스",
		description:
			"데이터베이스 시스템, 관계형 모델, 관계대수, SQL 등 DB 설계와 운영을 학습하는 챕터",
		totalUnits: 6,
		completedUnits: 0,
	},
	{
		chapterId: 6,
		name: "보안",
		description:
			"입력 검증, 접근 제어, 인증, 웹 보안 취약점과 대응 방안을 다루는 챕터",
		totalUnits: 8,
		completedUnits: 0,
	},
	{
		chapterId: 7,
		name: "SW 공학",
		description:
			"소프트웨어 개발 생명주기, 요구사항 분석, 설계, 테스트, 유지보수를 학습하는 챕터",
		totalUnits: 6,
		completedUnits: 0,
	},
];

function RouteComponent() {
	return (
		<main className="flex-grow flex flex-col justify-start bg-gray-200">
			<Banner />
			<div className="w-full h-full flex flex-col items-center py-8">
				<div className="w-full max-w-[1500px] px-[120px] flex flex-col gap-8">
					<h2 className="text-black text-[32px] font-bold leading-normal">
						학습
					</h2>
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8  lg:gap-10 mb-10">
						{data?.map((chapter) => {
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
