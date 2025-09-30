import { useRef } from "react";

type Tier = {
	id: number;
	name: string;
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

interface TierSelectorProps {
	tiers: Tier[];
	selectedTierId: number | null;
	onSelectTier: (tierId: number) => void;
}

export default function TierSelector({
	tiers,
	selectedTierId,
	onSelectTier,
}: TierSelectorProps) {
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const handleClick = (tierId: number, index: number) => {
		onSelectTier(tierId);
		itemRefs.current[index]?.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest",
		});
	};

	return (
		<div className="flex flex-row lg:w-full md:px-3 sm:pl-0 pl-36 py-8 items-center lg:justify-start justify-center gap-6 scroll-smooth overflow-x-auto">
			<div className="flex-shrink-0 w-[calc(50%+360px)] lg:w-[calc(50%-140px)]" />
			{tiers.map((tier, index) => {
				const isSelected = tier.id === selectedTierId;
				const TierIcon = tier.icon;

				return (
					<button
						key={tier.id}
						type="button"
						ref={(el) => {
							itemRefs.current[index] = el;
						}}
						onClick={() => handleClick(tier.id, index)}
						className={`flex flex-col items-center cursor-pointer transition-all duration-300 justify-center ${
							isSelected ? "scale-110 px-4" : ""
						} min-h-[140px]`}
					>
						<div className="flex items-center justify-center">
							<TierIcon className={isSelected ? "w-52 h-52" : "w-48 h-48"} />
						</div>
						<div
							className="flex flex-col items-center justify-center pt-4 min-h-[60px]"
							style={{ visibility: isSelected ? "visible" : "hidden" }}
						>
							<span className="mb-1 text-3xl font-semibold">{tier.name}</span>
						</div>
					</button>
				);
			})}
			<div className="flex-shrink-0 w-[calc(50%-96px)] lg:w-[calc(50%-208px)]" />
		</div>
	);
}
