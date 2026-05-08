import { Link, useNavigate } from "@tanstack/react-router";

import Logo from "@/shared/assets/icons/logo.svg?react";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";
import { tokenManager } from "@/shared/api";
import { cn } from "@/shared/lib/cn";

interface HeaderContentProps {
	profileImageNum: number;
}

const HEADER_NAV_LIST = [
	{ to: "/main", label: "홈" },
	{ to: "/learning", label: "학습" },
	{ to: "/league", label: "리그" },
	{ to: "/user", label: "마이그래빗" },
];

export default function HeaderContent({ profileImageNum }: HeaderContentProps) {
	return (
		<div
			className={cn(
				"relative w-full rounded-full bg-black/30 backdrop-blur-sm",
				"after:p-px after:pointer-events-none after:absolute after:inset-0 after:rounded-full",
				"after:bg-linear-to-l after:from-white/60 after:via-white/20 after:to-white/60",
				"after:mask-[linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:[mask-origin:content-box,border-box] after:[mask-clip:content-box,border-box] after:mask-exclude after:mask-",
			)}
		>
			<div className="relative rounded-full z-10 text-white text-lg flex h-full justify-between items-center px-8 p-2.5">
				<Logo className="w-25" />

				<HeaderNav />

				<HeaderUserMenu profileImageNum={profileImageNum} />
			</div>
		</div>
	);
}

function HeaderNav() {
	return (
		<nav>
			<ul className="flex items-center gap-18">
				{HEADER_NAV_LIST.map((navItem) => (
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

function HeaderUserMenu({ profileImageNum }: { profileImageNum: number }) {
	const navigate = useNavigate();

	const profileBgColor =
		PROFILE_COLORS[profileImageNum as keyof typeof PROFILE_COLORS];

	const handleLogout = () => {
		tokenManager.clearTokens();
		navigate({ from: "/", replace: true });
	};

	return (
		<div className="flex items-center gap-5">
			<Profile
				style={{ color: profileBgColor }}
				className="size-12.5 aspect-square"
			/>

			<button onClick={handleLogout} className="cursor-pointer">
				로그아웃
			</button>
		</div>
	);
}
