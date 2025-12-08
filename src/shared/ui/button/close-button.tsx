import CloseIcon from "@/shared/assets/icons/buttons/x.svg?react";
import { cn } from "@/shared/lib/cn";

export default function CloseButton({
	onClose,
	className,
	iconClass,
}: {
	onClose: () => void;
	className?: string;
	iconClass?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClose}
			className={cn("cursor-pointer p-1.5 text-gray-800", className)}
		>
			<CloseIcon className={iconClass} />
		</button>
	);
}
