import { cn } from "@/shared/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("box-border flex flex-col bg-white w-full", {
	variants: {
		size: {
			sm: "p-3 rounded-lg gap-2",
			md: "p-5 rounded-xl gap-4", // 현재 나온 디자인은 md 사이즈만 존재하지만, 추후 사이즈가 추가될 수 있으므로 다른 사이즈도 정의해둠
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
		<h3 className={cn("font-medium text-base text-gray-500", className)}>
			{children}
		</h3>
	);
}

function CardLink({
	url,
	children,
	className,
}: {
	url: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<a
			href={url}
			className={cn(
				"font-medium text-base text-gray-400 underline underline-offset-2 shadow-[0px_4px_32px_0px_#00000006]",
				className,
			)}
		>
			{children}
		</a>
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
