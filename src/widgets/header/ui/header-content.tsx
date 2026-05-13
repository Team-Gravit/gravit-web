import { Link, useNavigate } from "@tanstack/react-router";

import Logo from "@/shared/assets/icons/logo.svg?react";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { getProfileColor } from "@/shared/lib/ProfileColor";
import { tokenManager } from "@/shared/api";
import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

interface HeaderContentProps {
	profileImageNum: number;
	leftSlot?: ReactNode;
	rightSlot?: ReactNode;
	navList: { to: string; label: string }[];
}

export default function HeaderContent({
	profileImageNum,
	leftSlot,
	rightSlot,
	navList,
}: HeaderContentProps) {
	return (
		<div
			className={cn(
				"relative w-full rounded-full bg-black/10 backdrop-blur-[66px]",
				"after:p-px after:pointer-events-none after:absolute after:inset-0 after:rounded-full",
				"after:bg-linear-to-l after:from-white/60 after:via-white/20 after:to-white/60",
				"after:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:[mask-origin:content-box,border-box] after:[mask-clip:content-box,border-box] after:mask-exclude",
			)}
		>
			<div className="relative rounded-full z-10 text-white text-lg flex h-full justify-between items-center px-8 p-2.5">
				<div className="flex items-center gap-5">
					{leftSlot}
					<Logo className="w-25" />
				</div>

				<HeaderNav navList={navList} />

				<HeaderUserMenu profileImageNum={profileImageNum}>
					{rightSlot}
				</HeaderUserMenu>
			</div>
		</div>
	);
}

function HeaderNav({ navList }: { navList: { to: string; label: string }[] }) {
	return (
		<nav>
			<ul className="flex items-center gap-18 text-xl">
				{navList.map((navItem) => (
					<li key={navItem.label}>
						<Link
							className="p-2"
							activeProps={{ className: "underline underline-offset-8" }}
							to={navItem.to}
						>
							{navItem.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

function HeaderUserMenu({
	profileImageNum,
	children,
}: {
	profileImageNum: number;
	children?: React.ReactNode;
}) {
	const navigate = useNavigate();

	const handleLogout = () => {
		tokenManager.clearTokens();
		navigate({ from: "/", replace: true });
	};

	return (
		<div className="flex items-center gap-5 text-xl">
			<Profile
				style={{ color: getProfileColor(profileImageNum) }}
				className="size-12.5 aspect-square"
			/>

			<button onClick={handleLogout} className="cursor-pointer">
				로그아웃
			</button>
			{children}
		</div>
	);
}
