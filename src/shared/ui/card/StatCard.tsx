import Card from "./Card";

interface StatCardProps {
	icon: string;
	label: string;
	value: string;
}

export const StatCard = ({ icon, label, value }: StatCardProps) => {
	return (
		<Card className="w-full flex-1 gap-2 flex flex-row justify-center items-center">
			<img src={icon} className="w-[50px]" alt={label} />
			<p className="flex flex-col justify-start items-start">
				<dt className="font-normal text-base">{label}</dt>
				<dd className="font-semibold text-2xl">{value}</dd>
			</p>
		</Card>
	);
};
