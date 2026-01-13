import { useLocation, useNavigate } from "@tanstack/react-router";
import LeftArrow from "@/shared/assets/icons/buttons/left-arrow.svg?react";

interface SectionHeaderProps {
	title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const handleBack = () => {
		const pathParts = location.pathname.split("/").filter(Boolean);

		if (
			pathParts[0] === "user" &&
			pathParts[1] === "notice" &&
			pathParts.length === 4
		) {
			navigate({ to: `/user/notice/${pathParts[2]}` });
		} else {
			navigate({ to: "/user" });
		}
	};

	return (
		<div className="flex h-[84px] items-center gap-4 px-8 py-4 border-b border-[#E0E0E0] bg-white">
			<button
				type="button"
				onClick={handleBack}
				className="flex items-center justify-center p-2"
			>
				<LeftArrow className="h-[30px] w-[30px] text-[#222222]" />
			</button>
			<span className="text-[22px] font-semibold text-[#222222]">{title}</span>
		</div>
	);
}
