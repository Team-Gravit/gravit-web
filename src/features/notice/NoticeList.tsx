import { useNavigate } from "@tanstack/react-router";
import type { NoticeItem } from "@/entities/notice/model/types";
import RightArrow from "@/shared/assets/icons/buttons/right-arrow.svg?react";

interface NoticeListProps {
	notices: NoticeItem[];
	currentPage: number;
}

export default function NoticeList({ notices, currentPage }: NoticeListProps) {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-4">
			<ul className="flex flex-col divide-y divide-[#0000001A]">
				{notices.map((notice) => (
					<li
						key={notice.id}
						className="py-8 px-[60px] flex items-center justify-between"
					>
						<div className="flex-1 flex flex-col gap-2">
							<div className="flex flex-row justify-between items-center">
								<h3 className="text-2xl font-medium">{notice.title}</h3>
								<button
									type="button"
									onClick={() =>
										navigate({
											to: "/user/notice/$page/$noticeId",
											params: {
												page: String(currentPage),
												noticeId: String(notice.id),
											},
										})
									}
								>
									<RightArrow className="w-[30px] h-[30px]" />
								</button>
							</div>

							<time className="text-xl font-medium text-[#00000099]">
								{new Date(notice.publishedAt).toLocaleDateString()}
							</time>
							<p className="text-xl font-normal">{notice.summary}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
