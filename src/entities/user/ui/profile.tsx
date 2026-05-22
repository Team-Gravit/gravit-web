import { getProfileColor } from "@/shared/lib/ProfileColor";
import ProfileIcon from "@/shared/assets/icons/profile2.svg?react";
import { cva } from "class-variance-authority";

const profileVariant = cva("rounded-full shrink-0 aspect-square", {
	variants: {
		size: {
			xs: "size-8 md:size-8",
			sm: "size-[38px] md:size-12",
			md: "size-[52px] md:size-20",
			lg: "size-[70px] md:size-[140px]",
		},
	},
	defaultVariants: { size: "md" },
});

export default function Profile({
	profileImgId,
	size = "md",
}: {
	profileImgId: number;
	size?: "xs" | "sm" | "md" | "lg";
}) {
	const bgColor = getProfileColor(profileImgId);
	return (
		<div className={profileVariant({ size })}>
			<ProfileIcon style={{ color: bgColor }} className="w-full h-full" />
		</div>
	);
}
