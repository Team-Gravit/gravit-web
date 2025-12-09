import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";
import { Link } from "@tanstack/react-router";
import CheckIcon from "@/shared/assets/icons/ic-round-check.svg?react";
import AppCenterLogo from "@/shared/assets/images/logo-ac.png";
import Logo from "@/shared/assets/icons/logo-gr.svg?react";
import { useRestoreAccount } from "@/features/user/use-restore-account";
import { toast } from "@/shared/lib/toast";

const searchSchema = z.object({
	providerId: z.string(),
});

export const Route = createFileRoute("/restore")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { providerId } = Route.useSearch();
	const navigate = useNavigate();
	const restoreUserMutate = useRestoreAccount();

	const handleCancelRestore = () => {
		navigate({ to: "/" });
	};

	const handleRestoreUser = async () => {
		restoreUserMutate.mutate(providerId, {
			onSuccess: () => {
				navigate({ to: "/" }); // 메인 페이지로 이동
				toast.confirm("복구가 완료되었습니다.");
			},
		});
	};

	return (
		<div className="flex flex-col w-screen h-screen items-center justify-between">
			<header className="flex items-center px-8 py-4 justify-start h-[var(--header-height)] w-full bg-white border-b border-b-gray-300">
				<Link to="/" className="mr-3">
					<Logo className={`h-6`} />
				</Link>
			</header>
			<section className="flex flex-col items-center gap-10">
				{/* 전달받은 아이콘 렌더링 */}
				<CheckIcon className="w-[100px]" />

				<h2 className="text-gray-900 font-semibold text-2xl">
					돌아오신 것을 환영해요!
				</h2>

				<div className="flex items-center gap-7">
					{restoreUserMutate.isPending ? (
						<div className="text-gray-500 animate-pulse text-xl">
							복구 중입니다...
						</div>
					) : (
						<>
							<button
								type="button"
								className="gray-btn py-4 px-15 font-medium text-2xl"
								onClick={handleCancelRestore}
							>
								취소하기
							</button>
							<button
								type="button"
								className="primary-btn py-4 px-15 text-2xl"
								onClick={handleRestoreUser}
							>
								복구하기
							</button>
						</>
					)}
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
