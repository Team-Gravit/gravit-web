import { type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { blockButtonVariants, inlineButtonVariants } from "./button.variants";

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
