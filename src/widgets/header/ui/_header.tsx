import { useUserInfo } from "@/entities/sidebar/api/useUserInfo";
import HeaderContent from "./header-content";

function Header() {
	const { data, isPending } = useUserInfo();

	if (isPending) return null;
	if (!data) return null;

	return (
		<header className="fixed left-0 top-0 z-[120] w-full px-15 py-5">
			<HeaderContent profileImageNum={data.profileImgNumber} />
		</header>
	);
}

export default Header;
