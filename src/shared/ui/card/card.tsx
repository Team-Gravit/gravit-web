import { cn } from "@/shared/lib/cn";
import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("box-border flex flex-col bg-white w-full", {
	variants: {
		size: {
			sm: "p-3 rounded-lg gap-2",
			md: "p-3 rounded-lg gap-2 md:p-5 md:rounded-xl md:gap-4", // 현재 나온 디자인은 md 사이즈만 존재하지만, 추후 사이즈가 추가될 수 있으므로 다른 사이즈도 정의해둠
			lg: "p-7 rounded-2xl gap-6",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

interface CardProps extends VariantProps<typeof cardVariants> {
	children?: React.ReactNode;
	className?: string;
}

function CardHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("w-full flex items-center justify-between", className)}>
			{children}
		</div>
	);
}

function CardTitle({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<h3
			className={cn(
				"font-normal md:font-medium text-xs md:text-base text-gray-500",
				className,
			)}
		>
			{children}
		</h3>
	);
}

function CardLink({
	to,
	children,
	className,
}: {
	to: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Link
			to={to}
			className={cn(
				"font-normal md:font-medium text-xs md:text-base text-gray-400 underline underline-offset-2 shadow-[0px_4px_32px_0px_#00000006]",
				className,
			)}
		>
			{children}
		</Link>
	);
}

export default function Card({ size = "md", children, className }: CardProps) {
	return (
		<div className={cn(cardVariants({ size }), className)}>{children}</div>
	);
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Link = CardLink;
