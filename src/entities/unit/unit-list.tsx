import UnitItem from "./unit-item";

interface UnitListProps {
	units: {
		id: number;
		title: string;
		status: "completed" | "inProgress" | "notStarted";
	}[];
	className?: string;
}

export default function UnitList({ units, className }: UnitListProps) {
	return (
		<div className={`flex flex-col gap-2 ${className ?? ""}`}>
			{units.map((unit) => (
				<UnitItem
					key={unit.id}
					unitId={unit.id}
					unitTitle={unit.title}
					unitStatus={unit.status}
				/>
			))}
		</div>
	);
}
