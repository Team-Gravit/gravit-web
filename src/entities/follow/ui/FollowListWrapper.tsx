// FollowListWrapper.tsx
import { type RefObject } from "react";
import type { Follow } from "@/entities/follow/model/types";
import FollowListItem from "@/features/follow/FollowListItem";

interface Props {
	follow: Follow[];
	isLoading: boolean;
	hasNextPage: boolean;
	fetchNextPage: () => void;
	isFetchingNextPage: boolean;
	scrollRef: RefObject<HTMLDivElement | null>;
	type: "followers" | "following";
}

export default function FollowListWrapper({
	follow,
	isLoading,
	hasNextPage,
	fetchNextPage,
	isFetchingNextPage,
	scrollRef,
	type,
}: Props) {
	const handleScroll = () => {
		const target = scrollRef.current;
		if (!target) return;

		if (
			target.scrollHeight - target.scrollTop <= target.clientHeight + 50 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	};

	console.log("FollowListWrapper follow 배열:", follow); // 👈 map 전에 전체 배열 확인

	return (
		<div
			ref={scrollRef}
			className="w-full h-[440px] overflow-y-auto"
			onScroll={handleScroll}
		>
			{isLoading ? (
				<div className="flex items-center justify-center h-full text-gray-400">
					로딩 중...
				</div>
			) : follow.length === 0 ? (
				<div className="flex items-center justify-center h-full text-gray-400">
					리스트가 없습니다
				</div>
			) : (
				<ul className="flex flex-col px-6 py-4 gap-4">
					{follow.map((item) => {
						console.log("FollowListWrapper map item:", item); // 👈 map 안에서 아이템 확인
						return <FollowListItem key={item.id} item={item} type={type} />;
					})}
				</ul>
			)}
		</div>
	);
}
