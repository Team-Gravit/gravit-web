import { Link, useRouter } from "@tanstack/react-router";
import Mascot404Icon from "@/shared/assets/icons/ic-mascot-404.svg?react";
import ErrorPageTemplate from "./ErrorPageTemplate"; // 위에서 만든 컴포넌트 import

export default function Page404Component() {
	const router = useRouter();

	const handleGoBack = () => {
		router.history.back();
	};

	return (
		<ErrorPageTemplate
			icon={<Mascot404Icon className="w-[300px] h-fit" />}
			title="페이지를 찾을 수 없어요."
			description={
				<>
					입력한 주소가 잘못되었거나,
					<br />
					페이지가 이동되었거나 삭제되었을 수 있어요
					<br />
					주소를 다시 확인하시거나,
					<br />
					홈으로 돌아가 서비스를 다시 이용해 주세요.
				</>
			}
		>
			<button
				type="button"
				onClick={handleGoBack}
				className="gray-btn py-5 px-16 text-2xl font-medium"
			>
				돌아가기
			</button>

			<Link
				to={"/main"}
				className="primary-btn py-5 px-16 text-2xl font-medium"
			>
				메인으로
			</Link>
		</ErrorPageTemplate>
	);
}
