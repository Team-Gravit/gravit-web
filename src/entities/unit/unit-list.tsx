import UnitItem from "./unit-item";
import type { UnitProgress } from "@/entities/learning/model/schema";

export default function UnitList({
	units,
	className,
}: {
	units: UnitProgress[];
	className?: string;
}) {
	return (
		<div className={`flex flex-col gap-2 ${className ?? ""}`}>
			{units.map((unit) => (
				<UnitItem
					key={unit.unitId}
					unitId={unit.unitId}
					unitTitle={unit.title}
					unitStatus={unit.isCompleted ? "completed" : "inProgress"}
				/>
			))}
		</div>
	);
}
