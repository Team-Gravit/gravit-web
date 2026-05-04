import { cn } from "@/shared/lib/cn";
import { cva } from "class-variance-authority";
import Card from "./Card";

const bgCardVariants = cva(
	" flex flex-col w-full bg-cover bg-center bg-no-repeat h-fit",
	{
		variants: {
			size: {
				sm: "p-3 rounded-lg gap-2",
				md: "p-5 rounded-xl gap-4",
				lg: "p-7 rounded-2xl gap-6",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type BgCardProps = {
	children?: React.ReactNode;
	className?: string;
	size?: "sm" | "md" | "lg";
	backgroundImage: string;
};

export default function BgCard({
	children,
	className,
	size = "md",
	backgroundImage,
}: BgCardProps) {
	return (
		<div
			className={cn(bgCardVariants({ size }), className)}
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			{children}
		</div>
	);
}

BgCard.Header = Card.Header;
BgCard.Title = Card.Title;
BgCard.Link = Card.Link;
