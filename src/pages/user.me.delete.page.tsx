import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useConfirmWithdraw } from "@/features/user/delete-user/api/useWithdraw";
import MascotIcon from "@/shared/assets/icons/ic-mascot-error.svg?react";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import AppCenterLogo from "@/shared/assets/images/logo-ac.png";
import WithdrawFailedPage from "@/widgets/withdraw/ui/WithdrawFailedPage";
import WithdrawSuccessPage from "@/widgets/withdraw/ui/WithdrawSuccessPage";

export const Route = createFileRoute("/user/me/delete/page")({
	component: RouteComponent,
	validateSearch: z.object({
		mailAuthCode: z.string(),
	}),
});

function RouteComponent() {
	const { mailAuthCode } = Route.useSearch();
	const confirmWithdraw = useConfirmWithdraw();
	const [isConfirmed, setIsConfirmed] = useState(false);

	const handleConfirmWithdraw = () => {
		if (isConfirmed) return;

		setIsConfirmed(true);
		confirmWithdraw.mutate(mailAuthCode);
	};

	// 탈퇴 요청 성공
	if (confirmWithdraw.isSuccess) {
		return <WithdrawSuccessPage />;
	}

	// 탈퇴 요청 실패
	if (confirmWithdraw.isError) {
		return <WithdrawFailedPage />;
	}

	// 확인 페이지
	return (
		<div className="flex flex-col w-screen h-screen items-center justify-between">
			<header className="flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white border-b border-b-gray-300">
				<Link to="/" className="mr-3">
					<Logo className={`h-6`} />
				</Link>
			</header>
			<section className="flex flex-col items-center gap-10">
				<MascotIcon />
				<div className="flex flex-col items-center gap-5">
					<h2 className="text-gray-900 font-semibold text-2xl">
						정말 탈퇴하실건가요?
					</h2>
					<p className="text-gray-600 text-xl text-center">
						클릭 시 즉시 확정되며,
						<br />
						관련 데이터는 정책에 따라 순차 삭제됩니다.
					</p>
				</div>

				<button
					type="button"
					onClick={handleConfirmWithdraw}
					disabled={confirmWithdraw.isPending}
					className="w-full bg-red-600 text-white font-medium text-2xl py-5 rounded-[10px] cursor-pointer
                   hover:bg-red-700 disabled:bg-gray-400"
				>
					{confirmWithdraw.isPending ? "탈퇴 처리 중..." : "탈퇴 확정하기"}
				</button>
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
