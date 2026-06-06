import { useGetMainPage } from "@/shared/api/@generated/user-api/user-api";
import useResponsive from "@/shared/model/use-responsive";
import { toMainPageViewModel } from "./main.model";
import MainMobile from "./_components/main-mobile";
import MainDesktop from "./_components/main-desktop";

export default function MainPage() {
	const { isMobile } = useResponsive();
	const { data, isPending, isError } = useGetMainPage();

	if (isPending || isError || !data) return null;

	const vm = toMainPageViewModel(data);

	return <>{isMobile ? <MainMobile vm={vm} /> : <MainDesktop vm={vm} />}</>;
}
