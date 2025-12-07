import Mascot401Icon from "@/shared/assets/icons/ic-mascot-401.svg?react";
import ErrorPageTemplate from "./ErrorPageTemplate";

export default function Page401Component() {
	return (
		<ErrorPageTemplate
			icon={<Mascot401Icon className="w-[300px] h-fit" />}
			title="접근 권한이 없어요."
			description={
				<>
					이 페이지는 로그인한 사용자만
					<br />
					이용할 수 있어요.
					<br />
					계속하시려면 로그인 후 다시 시도해 주세요.
				</>
			}
		/>
	);
}
