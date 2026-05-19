import { Link } from "@tanstack/react-router";

const USER_TABS = [
	{ to: "/user", label: "요약" },
	{ to: "/user/learning", label: "학습" },
	{ to: "/user/league", label: "리그" },
	{ to: "/user/social", label: "소셜" },
];

function UserTabs() {
	return (
		<nav>
			<ul className="flex items-center w-full gap-1 p-1 md:gap-2 md:p-2 bg-text-1-w rounded-lg md:rounded-xl text-text-3 label1 md:heading2">
				{USER_TABS.map((tab) => (
					<li key={tab.label} className="max-w-1/4 w-full">
						<Link
							to={tab.to}
							activeOptions={tab.to === "/user" ? { exact: true } : undefined}
							activeProps={{
								className: "bg-[var(--primitive-purple-700)] text-text-1-w",
							}}
							inactiveProps={{
								className: "bg-transparent",
							}}
							className="block w-full text-center  py-2.5 md:py-4 rounded-sm md:rounded-lg transition-colors"
						>
							{tab.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default UserTabs;
