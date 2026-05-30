import { cva } from "class-variance-authority";

export const inlineButtonVariants = cva(
	[
		"inline-flex items-center justify-center rounded-lg",
		"transition-all duration-200 ease-in-out",
		"cursor-pointer",
		"disabled:bg-[#dcdcdc] disabled:text-white disabled:pointer-events-none",
	],
	{
		variants: {
			variant: {
				primary: "bg-[#9b00cf] text-white hover:bg-[#6D0689]",
				secondary: "bg-[#DCDCDC] text-[#6D6D6D] hover:bg-[#A8A8A8]",
				strokeGray:
					"bg-[#F8F8F8] border border-[#CCCCCC] text-[#6D6D6D] hover:bg-[#DCDCDC] hover:text-[#6D6D6D]",
				strokePrimary:
					"bg-[#F8F8F8] border border-[#9B00CF] text-[#6D6D6D] hover:bg-[#9b00cf] hover:text-white",
			},
			size: {
				xs: "px-4 py-1 text-sm",
				sm: "px-4 py-2 text-sm",
				md: "px-4 py-2 text-base font-medium",
				lg: "px-5 py-2 text-xl font-medium",
				custom: "",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

export const blockButtonVariants = cva(
	[
		"w-full flex items-center justify-center",
		"transition-all duration-200 ease-in-out",
		"cursor-pointer",
		"disabled:bg-[#dcdcdc] disabled:text-white disabled:pointer-events-none",
	],
	{
		variants: {
			variant: {
				primary: "bg-[#9b00cf] text-white hover:bg-[#6D0689]",
				secondary: "bg-[#DCDCDC] text-[#6D6D6D] hover:bg-[#A8A8A8]",
			},
			size: {
				md: "h-[37px] md:h-[56px] rounded-sm md:rounded-lg font-medium text-[14px] md:text-lg",
				custom: "",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);
