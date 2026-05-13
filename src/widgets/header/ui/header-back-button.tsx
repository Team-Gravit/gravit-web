import LeftArrow from "@/shared/assets/icons/buttons/left-arrow.svg?react";
import { useNavigate, useRouter } from "@tanstack/react-router";

interface HeaderBackButtonProps {
	fallbackTo?: string;
}

export default function HeaderBackButton({
	fallbackTo = "/main",
}: HeaderBackButtonProps) {
	const router = useRouter();
	const navigate = useNavigate();

	const handleBack = () => {
		if (window.history.length > 1) {
			router.history.back();
		} else {
			navigate({
				to: fallbackTo,
			});
		}
	};

	return (
		<button
			type="button"
			onClick={handleBack}
			className="cursor-pointer flex items-center justify-center"
		>
			<LeftArrow className="size-6" />
		</button>
	);
}
