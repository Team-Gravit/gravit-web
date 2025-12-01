import type { ReactNode, Ref } from "react";

export default function FloatingButton({
	ref,
	onHandleClick,
	children,
}: {
	onHandleClick: () => void;
	children: ReactNode;
	ref: Ref<HTMLButtonElement>;
}) {
	return (
		<button
			ref={ref}
			type="button"
			onClick={onHandleClick}
			className={
				"flex items-center justify-center cursor-pointer w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] bg-main-gr rounded-full fixed bottom-15 right-15 lg:bottom-15 lg:right-30"
			}
		>
			{children}
		</button>
	);
}
