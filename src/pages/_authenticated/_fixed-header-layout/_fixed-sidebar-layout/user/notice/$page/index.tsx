import {
	createFileRoute,
	useParams,
	useNavigate,
} from "@tanstack/react-router";
import SectionHeader from "@/widgets/header/ui/SectionHeader";
import NoticeList from "@/features/notice/NoticeList";
import PaginationButton from "@/features/button/PaginationButton";
import { useNoticeList } from "@/entities/notice/api/useNoticeList";
import type { NoticeItem } from "@/entities/notice/model/types";

export const Route = createFileRoute(
	"/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/notice/$page/",
)({
	component: RouteComponent,
});

export default function RouteComponent() {
	const { page } = useParams({
		from: "/_authenticated/_fixed-header-layout/_fixed-sidebar-layout/user/notice/$page/",
	});
	const navigate = useNavigate();

	const currentPage = Number(page);

	const { data, isLoading, isError } = useNoticeList(currentPage);

	if (isLoading) return <p>Loading...</p>;
	if (isError || !data) return <p>공지사항 불러오기 실패</p>;

	const notices: NoticeItem[] = data.contents.map((n) => ({
		...n,
		id: n.id,
	}));

	const handlePageChange = (pageNum: number) => {
		if (pageNum === currentPage || pageNum <= 0) return;
		navigate({
			to: "/user/notice/$page",
			params: { page: String(pageNum) },
		});
	};

	return (
		<div className="flex flex-col w-full h-full">
			<SectionHeader title="공지사항" />
			<NoticeList notices={notices} currentPage={currentPage} />
			<PaginationButton
				totalPages={data.totalPages}
				currentPage={currentPage}
				onPageChange={handlePageChange}
			/>
		</div>
	);
}
