import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const inlineButtonVariants = cva(
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
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

const blockButtonVariants = cva(
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
			size: { md: "h-[56px] rounded-lg font-semibold text-md" },
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

type InlineButtonProps = { display?: "inline" } & VariantProps<
	typeof inlineButtonVariants
>;
type BlockButtonProps = { display: "block" } & VariantProps<
	typeof blockButtonVariants
>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
	(InlineButtonProps | BlockButtonProps) & {
		loading?: boolean;
		loadingText?: string;
	};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			loading = false,
			className,
			disabled,
			loadingText = "로딩 중...",
			...props
		},
		ref,
	) => {
		let variantClassName: string;

		if (props.display === "block") {
			const { variant, size, ...rest } =
				props as ButtonHTMLAttributes<HTMLButtonElement> & BlockButtonProps;
			variantClassName = blockButtonVariants({ variant, size, className });
			// rest는 아래 spread에서 사용
			return (
				<button
					ref={ref}
					disabled={loading || disabled}
					className={variantClassName}
					{...rest}
				>
					{loading ? <span>{loadingText}</span> : children}
				</button>
			);
		}

		const { variant, size, ...rest } =
			props as ButtonHTMLAttributes<HTMLButtonElement> & InlineButtonProps;
		variantClassName = inlineButtonVariants({ variant, size, className });

		return (
			<button
				ref={ref}
				disabled={loading || disabled}
				className={variantClassName}
				{...rest}
			>
				{loading ? <span>{loadingText}</span> : children}
			</button>
		);
	},
);

Button.displayName = "Button";
