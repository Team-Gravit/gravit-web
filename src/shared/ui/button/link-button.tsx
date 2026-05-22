import { type VariantProps } from "class-variance-authority";
import { Link, type LinkProps } from "@tanstack/react-router";
import { type AnchorHTMLAttributes, forwardRef } from "react";
import { blockButtonVariants, inlineButtonVariants } from "./button.variants";

// ─── 타입 ────────────────────────────────────────────────────────────────────

type AnchorExtras = Pick<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	"rel" | "target" | "className" | "children"
>;

type InlineLinkButtonProps = { display?: "inline" } & VariantProps<
	typeof inlineButtonVariants
>;

type BlockLinkButtonProps = { display: "block" } & VariantProps<
	typeof blockButtonVariants
>;

export type LinkButtonProps = LinkProps &
	AnchorExtras &
	(InlineLinkButtonProps | BlockLinkButtonProps);

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function omit<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
): Omit<T, K> {
	const result = { ...obj };
	for (const key of keys) delete result[key];
	return result;
}

// ─── 컴포넌트 ────────────────────────────────────────────────────────────────

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	({ className, target, rel, children, ...props }, ref) => {
		const resolvedRel =
			target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

		if (props.display === "block") {
			const { variant, size } = props as BlockLinkButtonProps;
			const rest = omit(props, ["display", "variant", "size"]);

			return (
				<Link
					ref={ref}
					target={target}
					rel={resolvedRel}
					className={blockButtonVariants({ variant, size, className })}
					{...rest}
				>
					{children}
				</Link>
			);
		}

		const { variant, size } = props as InlineLinkButtonProps;
		const rest = omit(props, ["display", "variant", "size"]);

		return (
			<Link
				ref={ref}
				target={target}
				rel={resolvedRel}
				className={inlineButtonVariants({ variant, size, className })}
				{...rest}
			>
				{children}
			</Link>
		);
	},
);

LinkButton.displayName = "LinkButton";
