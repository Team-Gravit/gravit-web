import { useNavigate } from "@tanstack/react-router";
import Friends from "@/shared/assets/icons/buttons/friends.svg?react";

export default function AddFriendButton() {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate({ to: "/user/addfriend" });
	};

	return (
		<div className="flex justify-center">
			<button
				type="button"
				onClick={handleClick}
				className="flex flex-row items-center justify-center p-[7.99px] w-[312px] h-12 rounded-[7.99px] bg-[#8100B3] text-white text-2xl font-medium gap-2"
			>
				<Friends />
				친구 추가
			</button>
		</div>
	);
}
