import { useState } from "react";
import RightArrow from "@/shared/assets/icons/buttons/right-gray-arrow.svg?react";
import LeftArrow from "@/shared/assets/icons/buttons/left-gray-arrow.svg?react";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";

interface ProfileSelectorProps {
	selectedColorIndex?: number;
	onChange?: (index: number) => void;
}

export default function ProfileSelector({
	selectedColorIndex = 0,
	onChange,
}: ProfileSelectorProps) {
	const [colorIndex, setColorIndex] = useState(selectedColorIndex);

	const colorKeys = Object.keys(PROFILE_COLORS).map(
		Number,
	) as (keyof typeof PROFILE_COLORS)[];

	const handlePrev = () => {
		const newIndex = colorIndex === 0 ? colorKeys.length - 1 : colorIndex - 1;
		setColorIndex(newIndex);
		onChange?.(newIndex);
	};

	const handleNext = () => {
		const newIndex = colorIndex === colorKeys.length - 1 ? 0 : colorIndex + 1;
		setColorIndex(newIndex);
		onChange?.(newIndex);
	};

	return (
		<div className="flex flex-row items-center justify-center gap-10">
			<button type="button" onClick={handlePrev}>
				<LeftArrow className="mt-0.5 cursor-pointer" />
			</button>

			<Profile
				className="w-40 h-40"
				style={{ color: PROFILE_COLORS[colorKeys[colorIndex]] }}
			/>

			<button type="button" onClick={handleNext}>
				<RightArrow className="cursor-pointer" />
			</button>
		</div>
	);
}
