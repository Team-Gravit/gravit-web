import * as ScrollArea from "@radix-ui/react-scroll-area";
import UnitList from "@/entities/unit/unit-list";

interface UnitListScrollAreaProps {
	units: {
		id: number;
		title: string;
		status: "completed" | "inProgress" | "notStarted";
	}[];
}

export default function UnitListScrollArea({ units }: UnitListScrollAreaProps) {
	return (
		<ScrollArea.Root className="h-[232px] md:h-[184px] overflow-hidden">
			<ScrollArea.Viewport className="h-full w-full px-3 md:px-5">
				<UnitList units={units} />
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				orientation="vertical"
				className="flex w-5 touch-none select-none px-[7px]"
			>
				<ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-400 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[7px] before:-translate-x-1/2 before:-translate-y-1/2" />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	);
}
