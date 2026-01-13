import { Link } from "@tanstack/react-router";
import CheckIcon from "@/shared/assets/icons/check.svg?react";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import AppCenterLogo from "@/shared/assets/images/logo-ac.png";

export default function WithdrawSuccessPage() {
	return (
		<div className="flex flex-col w-screen h-screen items-center justify-between">
			<header className="flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white border-b border-b-gray-300">
				<Link to="/" className="mr-3">
					<Logo className={`h-6`} />
				</Link>
			</header>
			<section className="flex flex-col items-center gap-10">
				{/* 전달받은 아이콘 렌더링 */}
				<div className="w-[100px] aspect-square bg-main-2 rounded-full flex items-center justify-center">
					<CheckIcon />
				</div>

				<div className="flex flex-col items-center gap-5">
					<h2 className="text-gray-900 font-semibold text-2xl">
						탈퇴가 완료되었어요.
					</h2>
					<p className="text-gray-600 text-xl text-center">
						7일 내에 복구 절차를 진행하지 않을 시, <br />
						계정과 데이터들이 모두 삭제됩니다.
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
