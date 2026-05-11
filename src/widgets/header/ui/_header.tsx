import { useUserInfo } from "@/entities/sidebar/api/useUserInfo";
import HeaderContent from "./header-content";
import { getHeaderNavList } from "../header-nav-list";
import { useLocation } from "@tanstack/react-router";
import HeaderBackButton from "./header-back-button";
import DeleteUserButton from "@/features/user/delete-user/ui/delete-user-button";

function Header() {
	const pathname = useLocation({
		select: (location) => location.pathname,
	});

	const { data, isPending } = useUserInfo();

	if (isPending) return null;
	if (!data) return null;

	const isMainPage = pathname === "/main";

	const leftSlot = isMainPage ? null : <HeaderBackButton />;
	const rightSlot = isMainPage ? null : <DeleteUserButton />;

	return (
		<header className="fixed left-0 top-0 z-50 w-full px-15 py-5">
			<HeaderContent
				navList={getHeaderNavList(pathname)}
				profileImageNum={data.profileImgNumber}
				leftSlot={leftSlot}
				rightSlot={rightSlot}
			/>
		</header>
	);
}

export default Header;
