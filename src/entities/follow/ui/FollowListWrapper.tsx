import { useState } from "react";
import type { RefObject } from "react";
import type { Follow } from "@/entities/follow/model/types";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";
import { useToggleFollow } from "@/entities/friends/api/postFollowButton";

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

	const safeFollow = follow.filter((f): f is Follow => !!f);
	const { mutate: toggleFollow } = useToggleFollow(""); // API 호출 훅

	// 팔로잉 상태를 로컬에서 관리
	const [followStates, setFollowStates] = useState<Record<number, boolean>>(
		() =>
			safeFollow.reduce(
				(acc, f) => {
					acc[f.Id] = true; // 팔로잉 목록은 처음에 모두 true
					return acc;
				},
				{} as Record<number, boolean>,
			),
	);

	const handleToggle = (item: Follow) => {
		// API 호출
		toggleFollow({
			userId: item.Id,
			profileImgNumber: item.profileImgNumber,
			nickname: item.nickname,
			handle: item.handle,
			isFollowing: followStates[item.Id], // 현재 상태
		});

		// 버튼 상태 바로 반영
		setFollowStates((prev) => ({
			...prev,
			[item.Id]: !prev[item.Id],
		}));
	};

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
			) : safeFollow.length === 0 ? (
				<div className="flex items-center justify-center h-full text-gray-400">
					리스트가 없습니다
				</div>
			) : (
				<ul className="flex flex-col px-6 py-4 gap-4">
					{safeFollow.map((item, index) => (
						<li
							key={`${item.Id}-${index}`}
							className="flex items-center justify-between p-2 hover:bg-gray-50"
						>
							<div className="flex items-center gap-6">
								<Profile
									className="w-14 h-14"
									style={{
										color:
											PROFILE_COLORS[
												item.profileImgNumber as keyof typeof PROFILE_COLORS
											] ?? "#ccc",
									}}
								/>
								<div className="flex flex-col">
									<span className="font-semibold text-2xl">
										{item.nickname}
									</span>
									<span className="text-[#494949] font-normal text-2xl">
										@{item.handle}
									</span>
								</div>
							</div>

							{/* 팔로워 / 팔로잉 버튼 */}
							{type === "following" ? (
								<button
									type="button"
									className={`flex justify-center items-center px-6 py-3 gap-4 rounded-[10px] w-[151px] h-[51px] text-xl font-normal transition
									${
										followStates[item.Id]
											? "bg-white border border-black/10 text-black hover:bg-gray-50"
											: "bg-purple-800 text-white hover:bg-purple-700"
									}`}
									onClick={() => handleToggle(item)}
								>
									{followStates[item.Id] ? "팔로우 취소" : "팔로우"}
								</button>
							) : (
								<button
									type="button"
									className="text-gray-400 text-2xl font-bold"
									onClick={() => {
										// 팔로워 삭제 API 없음
									}}
								>
									×
								</button>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
