import { Link } from "@tanstack/react-router";
import HomeFillIcon from "@/shared/assets/_icons/button/home-fill-icon.svg?react";
import HomeIcon from "@/shared/assets/_icons/button/home-icon.svg?react";
import LearningFillIcon from "@/shared/assets/_icons/button/learning-fill-icon.svg?react";
import LearningIcon from "@/shared/assets/_icons/button/learning-icon.svg?react";
import LevelFillIcon from "@/shared/assets/_icons/button/level-fill-icon.svg?react";
import LevelIcon from "@/shared/assets/_icons/button/level-icon.svg?react";
import MyPageFillIcon from "@/shared/assets/_icons/button/my-page-fill-icon.svg?react";
import MyPageIcon from "@/shared/assets/_icons/button/my-page-icon.svg?react";
import { cn } from "@/shared/lib/cn";

const DEFAULT_BOTTOM_TAB_NAV_LIST = [
	{
		label: "홈",
		to: "/main",
		icon: <HomeIcon />,
		fillIcon: <HomeFillIcon />,
	},
	{
		label: "학습",
		to: "/learning",
		icon: <LearningIcon />,
		fillIcon: <LearningFillIcon />,
	},
	{
		label: "리그",
		to: "/league",
		icon: <LevelIcon />,
		fillIcon: <LevelFillIcon />,
	},
	{
		label: "마이그래빗",
		to: "/my",
		icon: <MyPageIcon />,
		fillIcon: <MyPageFillIcon />,
	},
];

// TODO : 색상 토큰 적용
export default function BottomTabBar() {
	return (
		<div className="fixed bottom-0 left-0 w-full z-50 bg-white">
			<nav className="py-2">
				<ul className="flex items-center w-full justify-around">
					{DEFAULT_BOTTOM_TAB_NAV_LIST.map((navItem) => (
						<li key={navItem.label} className="w-1/4">
							<Link
								to={navItem.to}
								className={"flex flex-col items-center justify-center gap-1"}
							>
								{({ isActive }) => (
									<>
										{isActive ? navItem.fillIcon : navItem.icon}

										<span
											className={cn(
												"caption1",
												isActive ? "text-main-2" : "text-[#625B71]",
											)}
										>
											{navItem.label}
										</span>
									</>
								)}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
