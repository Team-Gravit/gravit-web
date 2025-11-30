import { Link } from "@tanstack/react-router";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import { cn } from "@/shared/lib/cn";
import Profile from "@/shared/assets/icons/profile2.svg?react";
import { useUserInfo } from "@/entities/sidebar/api/getUserInfo";
import { PROFILE_COLORS } from "@/shared/lib/ProfileColor";
import { tokenManager } from "@/shared/api/config";

const HEADER_NAV_LIST: HeaderNavProps[] = [
	{ to: "/main", text: "홈" },
	{ to: "/learning", text: "학습" },
	{ to: "/league", text: "리그" },
	{ to: "/user", text: "사용자" },
];

export default function Header({ className }: { className?: string }) {
	const { data } = useUserInfo();

	let loginState = <div></div>;

	if (data) {
		const profileBgColor =
			PROFILE_COLORS[data.profileImgNumber as keyof typeof PROFILE_COLORS];

		loginState = (
			<p className="h-full flex gap-4 items-center flex-1 justify-end">
				<Profile
					style={{ color: profileBgColor }}
					className="w-[40px] h-[40px]"
				/>
				<span className="text-black font-bold text-xl leading-normal">
					어서오세요, {data.nickname}님
				</span>
				<button
					type="button"
					onClick={() => {
						tokenManager.clearTokens();
						/** TODO 나중에 수정 */
						window.location.href = "/";
					}}
					className="text-gray-500 text-xl font-bold cursor-pointer"
				>
					로그아웃
				</button>
			</p>
		);
	}

	return (
		<header
			className={cn(
				" flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white z-[110] ",

				className,
			)}
		>
			<Link to="/main" className="mr-3">
				<Logo className={`h-6`} />
			</Link>
			<nav className="flex justify-between gap-8 px-8">
				{HEADER_NAV_LIST.map((nav) => {
					return <HeaderNav {...nav} key={nav.text} />;
				})}
			</nav>
			{loginState}
		</header>
	);
}

type HeaderNavProps = {
	to: string;
	text: string;
};

const HeaderNav = ({ to, text }: HeaderNavProps) => {
	return (
		<Link
			to={to}
			className="text-gray-500 font-bold text-xl leading-6"
			activeProps={{
				style: {
					color: "#222124",
				},
			}}
		>
			{text}
		</Link>
	);
};
