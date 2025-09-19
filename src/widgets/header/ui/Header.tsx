import { Link } from "@tanstack/react-router";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import { cn } from "@/shared/lib/cn";

const HEADER_NAV_LIST: HeaderNavProps[] = [
	{ to: "/main", text: "홈" },
	{ to: "/study", text: "학습" },
	{ to: "/league", text: "리그" },
	{ to: "/user", text: "사용자" },
];

export default function Header({ className }: { className?: string }) {
	return (
		<header
			className={cn(
				"flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white",
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
