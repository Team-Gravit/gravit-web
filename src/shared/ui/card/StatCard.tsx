import Card from "./Card";

interface StatCardProps {
	icon: string;
	label: string;
	value: string;
	size?: "sm" | "md" | "lg";
}

export const StatCard = ({
	icon,
	label,
	value,
	size = "md",
}: StatCardProps) => {
	const sizeClasses = {
		sm: "w-[40px] text-sm text-lg",
		md: "w-[66px] text-xl text-3xl",
		lg: "w-[150px] text-3xl text-5xl",
	};

	const gapClasses = {
		sm: "gap-1 ",
		md: "gap-2 gap-2",
		lg: "gap-[64px] gap-6",
	};

	const iconSize = sizeClasses[size].split(" ")[0];
	const labelSize = sizeClasses[size].split(" ")[1];
	const valueSize = sizeClasses[size].split(" ")[2];
	const cardGap = gapClasses[size].split(" ")[0];
	const textGap = gapClasses[size].split(" ")[1];

	return (
		<Card
			className={`w-full flex-1 gap-2 flex flex-row justify-center items-center ${cardGap}`}
		>
			<img src={icon} className={`${iconSize}`} alt={label} />
			<p className={`flex flex-col justify-start items-start ${textGap}`}>
				<dt className={`font-normal ${labelSize}`}>{label}</dt>
				<dd className={`font-semibold ${valueSize}`}>{value}</dd>
			</p>
		</Card>
	);
};
