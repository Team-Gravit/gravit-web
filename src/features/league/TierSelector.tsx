import { useRef, useEffect, useCallback } from "react";
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
	const containerRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

	/** 선택된 버튼을 중앙 정렬 */
	const centerItem = useCallback((tierId: number) => {
		const container = containerRef.current;
		const target = itemRefs.current.get(tierId);
		if (!container || !target) return;

		const itemCenter = target.offsetLeft + target.offsetWidth / 2;
		const containerCenter = container.clientWidth / 2;

		const scrollLeft = itemCenter - containerCenter;

		container.scrollTo({
			left: scrollLeft,
			behavior: "smooth",
		});
	}, []);

	/** 클릭 핸들러 */
	const handleClick = (tierId: number) => {
		onSelectTier(tierId);
		// LP 텍스트와 이름은 항상 존재하므로 바로 smooth scroll 가능
		centerItem(tierId);
	};

	/** 초기 중앙 정렬 */
	useEffect(() => {
		if (!selectedTierId) return;
		centerItem(selectedTierId);
	}, [selectedTierId, centerItem]);

	return (
		<div
			ref={containerRef}
			className="flex items-center overflow-x-auto scrollbar-hide gap-16 py-10"
		>
			<div className="flex-shrink-0 w-[calc(50%-120px)] lg:w-[calc(50%-150px)]" />

			{tiers.map((tier) => {
				const isSelected = tier.id === selectedTierId;
				const TierIcon = tier.icon;

				return (
					<button
						type="button"
						key={tier.id}
						ref={(el) => {
							if (el) itemRefs.current.set(tier.id, el);
							else itemRefs.current.delete(tier.id);
						}}
						onClick={() => handleClick(tier.id)}
						className="relative flex-shrink-0 flex flex-col items-center justify-start cursor-pointer transition-all duration-300 w-[240px] min-h-[300px]"
					>
						<div className="relative w-full h-[305px] flex items-center justify-center">
							<TierIcon
								className="absolute top-1/2 left-1/2 transition-transform duration-300"
								style={{
									width: "100%",
									height: "100%",
									transform: `translate(-50%, -50%) scale(${isSelected ? 1.35 : 1})`,
									filter: `brightness(${isSelected ? 100 : 40}%)`,
								}}
							/>
						</div>

						<div className="w-full h-40 flex flex-col items-center justify-center mt-14">
							{/* 이름은 항상 존재, opacity로 토글 */}
							<span
								className={`text-[71px] text-white font-semibold transition-opacity duration-300 ${
									isSelected ? "opacity-100" : "opacity-0"
								} whitespace-nowrap overflow-hidden`}
								aria-hidden={!isSelected}
							>
								{tier.name}
							</span>

							{/* LP 정보도 항상 존재, 선택 여부에 따라 opacity만 변경 */}
							<span
								className={`text-[36px] text-white font-semibold mt-5 whitespace-nowrap transition-opacity duration-300 ${
									isSelected && selectedTierInfo ? "opacity-100" : "opacity-0"
								}`}
								aria-hidden={!(isSelected && selectedTierInfo)}
							>
								{selectedTierInfo
									? `LP ${selectedTierInfo.minLp} - ${selectedTierInfo.maxLp}`
									: "\u00A0"}
							</span>
						</div>
					</button>
				);
			})}

			<div className="flex-shrink-0 w-[calc(50%-120px)] lg:w-[calc(50%-150px)]" />
		</div>
	);
}
