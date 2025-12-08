import CopperBadge from "@/shared/assets/icons/copper-badge.svg?react";
import GoldBadge from "@/shared/assets/icons/gold-badge.svg?react";
import type { UserBadges } from "@/entities/sidebar/model/types";

interface Props {
	userBadges: UserBadges;
}

export default function Badges({ userBadges }: Props) {
	return (
		<section className="flex flex-col py-5 px-4">
			<div className="flex items-end gap-1.5 text-[25px] font-semibold mb-6">
				<h3 className="self-end">뱃지</h3>
				<span className="text-[15px] text-[#494949]">
					{userBadges.earnedCount}개
				</span>
				<span className="text-[15px] text-[#6D6D6D] font-medium">획득</span>
			</div>

			{userBadges.badgeCategoryResponses.map((category, index) => (
				<section key={category.categoryId}>
					<div className="flex flex-row items-center gap-2">
						<h3 className="text-[22px] font-semibold text-[#494949] mb-2.5">
							{category.categoryName}
						</h3>
						{category.categoryDescription && (
							<p className="text-[#6D6D6D] text-[13.5px]">
								* {category.categoryDescription}
							</p>
						)}
					</div>

					<div className="grid grid-cols-5 gap-3 w-full bg-[#F2F2F2] rounded-xl p-3">
						{category.badgeResponses.map((badge) => (
							<div
								key={badge.badgeId}
								className="flex flex-col items-center text-center"
							>
								{badge.earned ? (
									<GoldBadge className="p-0.5" />
								) : (
									<CopperBadge className="p-0.5" />
								)}
								<span className="text-[19px] font-medium text-[#494949]">
									{badge.name}
								</span>
							</div>
						))}
					</div>

					{index !== userBadges.badgeCategoryResponses.length - 1 && (
						<div className="w-full border-[#DCDCDC] border border-dashed my-6"></div>
					)}
				</section>
			))}
		</section>
	);
}
