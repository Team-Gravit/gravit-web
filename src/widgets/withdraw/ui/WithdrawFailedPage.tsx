import { Link } from "@tanstack/react-router";
import MascotIcon from "@/shared/assets/icons/ic-mascot-error.svg?react";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import AppCenterLogo from "@/shared/assets/images/logo-ac.png";

export default function WithdrawFailedPage() {
	return (
		<div className="flex flex-col w-screen h-screen items-center justify-between">
			{/** TODO: 중복되는 코드 제거하기 WithdrawFailed, WithdrawSuccess */}
			<header className="flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white border-b border-b-gray-300">
				<Link to="/" className="mr-3">
					<Logo className={`h-6`} />
				</Link>
			</header>
			<section className="flex flex-col items-center gap-10">
				<MascotIcon />
				<div className="flex flex-col items-center gap-5">
					<h2 className="text-gray-900 font-semibold text-2xl">
						탈퇴를 실패했어요.
					</h2>
					<p className="text-gray-600 text-xl text-center">
						가입하신 이메일로 메일을
						<br />
						전송해드렸으니 다시 메일을 확인해주시고
						<br />
						절차를 따라주세요.
					</p>
				</div>
			</section>

			<footer className="w-full flex items-center justify-center py-10">
				<div className="flex flex-col">
					<img alt={"앱센터 로고"} src={AppCenterLogo} />
					<span className="inline-block text-gray-700 font-semibold text-sm mt-[-10px]">
						INU App Center
					</span>
				</div>
			</footer>
		</div>
	);
}
