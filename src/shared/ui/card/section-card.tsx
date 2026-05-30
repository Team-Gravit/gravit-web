import { cn } from "@/shared/lib/cn";
import Card from "./card";

interface SectionCardProps {
	title: string;
	description: string;
	className?: string;
	headerClassName?: string;
	children: React.ReactNode;
}

function SectionCard({
	title,
	description,
	className,
	headerClassName,
	children,
}: SectionCardProps) {
	return (
		<Card
			className={cn("p-4 md:px-8 md:py-7 md:gap-6 overflow-hidden", className)}
		>
			<Card.Header
				className={cn("flex flex-col items-start gap-2", headerClassName)}
			>
				<Card.Title>{title}</Card.Title>
				<p className="text-headline2 md:text-title3">{description}</p>
			</Card.Header>
			{children}
		</Card>
	);
}

export default SectionCard;
