import { useState, useEffect } from "react";
import RightArrow from "@/shared/assets/icons/buttons/right-gray-arrow.svg?react";
import LeftArrow from "@/shared/assets/icons/buttons/left-gray-arrow.svg?react";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";

interface ProfileSelectorProps {
	value?: number;
	onChange?: (index: number) => void;
	gap?: number;
}

export default function ProfileSelector({
	value,
	onChange,
	gap = 10,
}: ProfileSelectorProps) {
	const [colorIndex, setColorIndex] = useState(value ?? 0);

	const colorKeys = Object.keys(PROFILE_COLORS).map(
		Number,
	) as (keyof typeof PROFILE_COLORS)[];

	useEffect(() => {
		if (value !== undefined) {
			setColorIndex(value);
		}
	}, [value]);

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
		<div
			className="flex flex-row items-center justify-center"
			style={{ gap: `${gap * 0.25}rem` }}
		>
			<button type="button" onClick={handlePrev}>
				<LeftArrow className="mt-0.5 cursor-pointer text-[#f8f8f8]" />
			</button>

			<Profile
				className="w-40 h-40"
				style={{ color: PROFILE_COLORS[colorKeys[colorIndex]] }}
			/>

			<button type="button" onClick={handleNext}>
				<RightArrow className="cursor-pointer text-[#f8f8f8]" />
			</button>
		</div>
	);
}
