import { useRef } from "react";
import type { LeagueInfo } from "@/entities/league/model/types";

type Tier = {
	id: number;
	name: string;
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

interface TierSelectorProps {
	tiers: Tier[];
	selectedTierId: number | null;
	onSelectTier: (tierId: number) => void;
	selectedTierInfo?: LeagueInfo;
}

export default function TierSelector({
	tiers,
	selectedTierId,
	onSelectTier,
	selectedTierInfo,
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
		<div className="flex flex-row lg:w-full pl-36 py-10 items-center justify-start scroll-smooth overflow-x-auto scrollbar-hide gap-16">
			<div className="flex-shrink-0 w-[calc(50%-200px)] lg:w-[calc(50%-250px)]" />
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
						className="relative flex flex-col items-center justify-start cursor-pointer transition-all duration-300 w-full min-h-[300px] mt-10"
					>
						<div className="relative w-[240px] h-[305px] flex items-center justify-center">
							<TierIcon
								className="absolute top-1/2 left-1/2 transition-transform duration-300"
								style={{
									width: "100%",
									height: "100%",
									transform: `translate(-50%, -50%) scale(${isSelected ? 1.35 : 1})`,
									filter:
										!isSelected &&
										index < tiers.findIndex((t) => t.id === selectedTierId)
											? "brightness(40%)"
											: "brightness(100%)",
								}}
							/>
						</div>

						<div className="w-full h-40 flex flex-col items-center justify-center mt-14">
							<span
								className={`text-[71px] text-white font-semibold transition-opacity duration-300 ${
									isSelected ? "opacity-100" : "opacity-0"
								} whitespace-nowrap overflow-hidden`}
							>
								{tier.name}
							</span>
							{isSelected && selectedTierInfo && (
								<span className="text-[36px] text-white font-semibold mt-5 whitespace-nowrap">
									LP {selectedTierInfo.minLp} - {selectedTierInfo.maxLp}
								</span>
							)}
						</div>
					</button>
				);
			})}
			<div className="flex-shrink-0  lg:w-[calc(50%-150px)]" />
		</div>
	);
}
