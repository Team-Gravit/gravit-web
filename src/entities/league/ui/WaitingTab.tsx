import React from "react";
import Mascot from "@/shared/assets/icons/league-mascot.svg?react";

export default function WaitingTab() {
	return (
		<div className="flex flex-col items-center justify-center gap-7">
			<div
				className="w-[860px] h-[188px] 
                    flex flex-col items-center justify-center gap-5 
                    bg-gradient-to-r from-[rgba(255,255,255,0.2)] to-[rgba(255,255,255,0.04)]
                    shadow-[2px_2px_8px_rgba(0,0,0,0.25)] backdrop-blur-sm rounded-[39px] "
			>
				{/* 시즌 종료 텍스트 */}
				<span className="text-center font-mbc font-normal text-[46px] leading-[120%] text-[#FFC1FC]">
					시즌 1 종료
				</span>

				{/* 시즌 집계 안내 텍스트 */}
				<span className="text-center font-pretendard font-semibold text-[31px] leading-[120%] text-white">
					시즌 정보를 집계중이에요!
				</span>
			</div>
			<Mascot />
		</div>
	);
}
