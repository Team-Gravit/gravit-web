import type { LastSeasonPopupDto } from "@/entities/league/model/types";
import SeasonEnd from "@/shared/assets/icons/season-end.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { tiers } from "@/shared/lib/tiers";
import LeafLeft from "@/shared/assets/icons/leaf-left.svg?react";
import LeafRight from "@/shared/assets/icons/leaf-right.svg?react";

interface SeasonEndModalProps {
	popup: LastSeasonPopupDto;
	onConfirm: () => void;
}

export default function SeasonEndModal({
	popup,
	onConfirm,
}: SeasonEndModalProps) {
	const profileBgColor =
		PROFILE_COLORS[popup.profileImgNumber as keyof typeof PROFILE_COLORS];

	const tier = tiers.find((t) => t.name === popup.leagueName);
	const TierIcon = tier?.icon;

	return (
		<div className="bg-white rounded-[20px] w-full h-full p-14 flex flex-row items-center justify-center gap-40">
			<div className="relative flex flex-col items-center justify-center">
				<p className="text-[#8100B3] text-[57px] font-bold mb-8 text-shadow-lg">
					{popup.rank}등
				</p>

				<LeafLeft className="absolute top-[75px] -left-[90px] w-36 h-36 transform" />
				<LeafRight className="absolute top-[75px] -right-[90px] w-36 h-36 transform" />

				<div className="relative w-64 h-64 rounded-full border-[6px] border-[#BA00FF] flex items-center justify-center">
					<Profile style={{ color: profileBgColor }} className="w-64 h-64" />
				</div>
			</div>

			<div className="flex flex-col items-center justify-center gap-6">
				<SeasonEnd />
				<div className="flex items-center gap-2">
					<p className="text-[81px] font-bold">{popup.leagueName}</p>
					{TierIcon && <TierIcon className="w-40 h-36" />}
				</div>
				<p className="text-2xl text-[#6D6D6D] font-normal">
					다음 시즌도 지금처럼 진행해주세요!
				</p>
				<button
					type="button"
					className="w-full py-4 bg-[#8100B3] text-2xl text-white font-semibold rounded-[10px]"
					onClick={onConfirm}
				>
					확인
				</button>
			</div>
		</div>
	);
}
