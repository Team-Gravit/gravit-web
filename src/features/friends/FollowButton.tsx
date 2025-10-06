import type { Friend } from "@/entities/friends/model/types";

interface FollowButtonProps {
	friend: Friend;
	onToggle: (newStatus: boolean) => void;
}

export default function FollowButton({ friend, onToggle }: FollowButtonProps) {
	return (
		<button
			type="button"
			onClick={() => onToggle(!friend.isFollowing)}
			className={`flex justify-center items-center px-6 py-3 gap-4 rounded-[10px] w-[151px] h-[51px] text-xl font-normal transition
        ${
					friend.isFollowing
						? "bg-white border border-black/10 text-black hover:bg-gray-50"
						: "bg-purple-800 text-white hover:bg-purple-700"
				}`}
		>
			{friend.isFollowing ? "팔로우 취소" : "팔로우"}
		</button>
	);
}
