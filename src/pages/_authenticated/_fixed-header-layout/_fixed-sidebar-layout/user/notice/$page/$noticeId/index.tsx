import { createFileRoute, useParams } from "@tanstack/react-router";
import { useNoticeDetail } from "@/entities/notice/api/useNoticeDetail";
import SectionHeader from "@/widgets/header/ui/SectionHeader";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/notice/$page/$noticeId/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { noticeId } = useParams({ from: Route.id });
	const noticeIdNumber = Number(noticeId);

	const { data: notice, isLoading, isError } = useNoticeDetail(noticeIdNumber);

	if (isLoading) return <p>Loading...</p>;
	if (isError || !notice) return <p>공지사항 불러오기 실패</p>;

	return (
		<div className="flex flex-col w-full h-full">
			<SectionHeader title="공지사항 상세" />
			<div className="flex flex-col gap-2 px-[60px] py-8">
				<h1 className="text-2xl font-medium">{notice.title}</h1>
				<time className="text-xl font-medium text-[#00000099]">
					{new Date(notice.publishedAt).toLocaleDateString()}
				</time>
				<p className="text-xl font-normal">{notice.content}</p>
			</div>
		</div>
	);
}
