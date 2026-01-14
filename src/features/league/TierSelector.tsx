import React, { useEffect, useMemo } from "react";
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
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const hasScrolledRef = React.useRef(false); // 초기 한 번만 스크롤

	// createRef 배열 생성
	const buttonRefs = useMemo(
		() => tiers.map(() => React.createRef<HTMLButtonElement>()),
		[tiers],
	);

	const handleClick = (tierId: number) => {
		onSelectTier(tierId);
	};

	// 선택된 버튼 인덱스 계산
	const selectedIndex = useMemo(() => {
		if (selectedTierId == null) return -1;
		return tiers.findIndex((t) => t.id === selectedTierId);
	}, [tiers, selectedTierId]);

	useEffect(() => {
		if (selectedIndex === -1) return;

		const target = buttonRefs[selectedIndex]?.current;
		const container = containerRef.current;
		if (!target || !container) return;

		const raf = requestAnimationFrame(() => {
			const itemCenter = target.offsetLeft + target.offsetWidth / 2;
			const containerCenter = container.clientWidth / 2;
			container.scrollTo({
				left: itemCenter - containerCenter,
				behavior: "smooth",
			});
			hasScrolledRef.current = true;
		});

		return () => cancelAnimationFrame(raf);
	}, [selectedIndex, buttonRefs]);

	return (
		<div
			ref={containerRef}
			className="flex items-center overflow-x-auto scrollbar-hide gap-16 py-10"
		>
			<div className="flex-shrink-0 w-[calc(50%-120px)] lg:w-[calc(50%-150px)]" />

			{tiers.map((tier, idx) => {
				const isSelected = idx === selectedIndex;
				const TierIcon = tier.icon;

				return (
					<button
						type="button"
						key={tier.id}
						ref={buttonRefs[idx]}
						onClick={() => handleClick(tier.id)}
						className="relative flex-shrink-0 flex flex-col items-center justify-start cursor-pointer transition-all duration-300 w-[240px] min-h-[300px]"
					>
						<div className="relative w-full h-[305px] flex items-center justify-center">
							<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
								<TierIcon
									className="transition-transform duration-300 w-[224px] h-[290px]"
									style={{
										transform: `scale(${isSelected ? 1.35 : 1})`,
										filter: `brightness(${isSelected ? 100 : 40}%)`,
									}}
								/>
							</div>
						</div>

						<div className="w-full h-40 flex flex-col items-center justify-center mt-14">
							<span
								className={`text-[71px] text-white font-semibold transition-opacity duration-300 ${
									isSelected ? "opacity-100" : "opacity-0"
								} whitespace-nowrap overflow-hidden`}
								aria-hidden={!isSelected}
							>
								{tier.name}
							</span>

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
